"""Assignment endpoints."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("", response_model=list[schemas.AssignmentRead])
async def list_assignments(
    subject_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    List assignments with optional filters:
        GET /assignments?subject_id=1
        GET /assignments?status=Pending
    """
    return crud.list_assignments(db, subject_id=subject_id, status=status)


@router.get("/{assignment_id}", response_model=schemas.AssignmentRead)
async def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Get a single assignment by id."""
    assignment = crud.get_assignment(db, assignment_id)
    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment {assignment_id} not found",
        )
    return assignment


@router.post(
    "",
    response_model=schemas.AssignmentRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_assignment(
    payload: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new academic assignment. Requires authentication."""
    subject = crud.get_subject(db, payload.subject_id)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject {payload.subject_id} not found",
        )
    return crud.create_assignment(db, payload)


@router.patch("/{assignment_id}", response_model=schemas.AssignmentRead)
async def update_assignment(
    assignment_id: int,
    payload: schemas.AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update an assignment. Requires authentication."""
    if payload.subject_id is not None:
        subject = crud.get_subject(db, payload.subject_id)
        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject {payload.subject_id} not found",
            )

    updated = crud.update_assignment(db, assignment_id, payload)
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment {assignment_id} not found",
        )
    return updated


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete an assignment. Requires authentication."""
    deleted = crud.delete_assignment(db, assignment_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment {assignment_id} not found",
        )
    return None
