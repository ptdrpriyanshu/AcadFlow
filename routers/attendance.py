"""Attendance endpoints."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=list[schemas.AttendanceRead])
async def list_attendance(
    student_id: Optional[int] = None,
    date: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    List attendance records with optional filters:
        GET /attendance?student_id=1
        GET /attendance?date=2026-09-17
        GET /attendance?status=Present
    """
    return crud.list_attendance(db, student_id=student_id, date=date, status=status)


@router.get("/{attendance_id}", response_model=schemas.AttendanceRead)
async def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    """Get a single attendance record by id."""
    record = crud.get_attendance(db, attendance_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record {attendance_id} not found",
        )
    return record


@router.post(
    "",
    response_model=schemas.AttendanceRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_attendance(
    payload: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Record student attendance. Requires authentication."""
    student = crud.get_student(db, payload.student_id)
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student {payload.student_id} not found",
        )
    return crud.create_attendance(db, payload)


@router.patch("/{attendance_id}", response_model=schemas.AttendanceRead)
async def update_attendance(
    attendance_id: int,
    payload: schemas.AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update an attendance record. Requires authentication."""
    record = crud.update_attendance(db, attendance_id, payload)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record {attendance_id} not found",
        )
    return record


@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete an attendance record. Requires authentication."""
    deleted = crud.delete_attendance(db, attendance_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record {attendance_id} not found",
        )
    return None
