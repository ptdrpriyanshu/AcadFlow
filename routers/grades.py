"""Grade endpoints."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/grades", tags=["grades"])


@router.get("", response_model=list[schemas.GradeRead])
async def list_grades(
    student_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    semester: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    List grades. All three filters are optional and can be combined:

        GET /grades?student_id=3
        GET /grades?student_id=3&semester=2026-S1
        GET /grades?subject_id=1&semester=2026-S1
    """
    return crud.list_grades(db, student_id, subject_id, semester)


@router.post(
    "",
    response_model=schemas.GradeRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_grade(
    payload: schemas.GradeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Record a new grade for a student in a subject in a semester. Requires authentication."""
    student = crud.get_student(db, payload.student_id)
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student {payload.student_id} not found",
        )
    subject = crud.get_subject(db, payload.subject_id)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject {payload.subject_id} not found",
        )
    return crud.create_grade(db, payload)


@router.get("/{grade_id}", response_model=schemas.GradeRead)
async def get_grade(grade_id: int, db: Session = Depends(get_db)):
    """Get a single grade by ID."""
    grade = crud.get_grade(db, grade_id)
    if grade is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grade {grade_id} not found",
        )
    return grade


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a grade record. Requires authentication."""
    deleted = crud.delete_grade(db, grade_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grade {grade_id} not found",
        )
    return None
