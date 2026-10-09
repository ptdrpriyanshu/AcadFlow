"""Subject endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("", response_model=list[schemas.SubjectRead])
async def list_subjects(db: Session = Depends(get_db)):
    """List all subjects."""
    return crud.list_subjects(db)


@router.post(
    "",
    response_model=schemas.SubjectRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_subject(
    payload: schemas.SubjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new subject. Requires authentication."""
    existing = crud.get_subject_by_name(db, payload.name.strip())
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Subject '{payload.name.strip()}' already exists",
        )
    return crud.create_subject(db, payload)


@router.get("/{subject_id}", response_model=schemas.SubjectRead)
async def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """Get a single subject by ID."""
    subject = crud.get_subject(db, subject_id)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject {subject_id} not found",
        )
    return subject


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a subject. Requires authentication."""
    deleted = crud.delete_subject(db, subject_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject {subject_id} not found",
        )
    return None
