"""
Pydantic schemas — request and response shapes.

FastAPI uses these to validate incoming data and shape outgoing responses.

Naming convention:
    *Base    : fields shared by Create and Read
    *Create  : request body for POST endpoints (no id, no created_at)
    *Read    : response body returned to clients (with id, computed fields)
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


# ---- Student ---------------------------------------------------------------

class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    grade_level: str = Field(..., min_length=1, max_length=10)


class StudentCreate(StudentBase):
    pass


class StudentRead(StudentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class StudentUpdate(BaseModel):
    """Partial update, every field optional."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    grade_level: Optional[str] = Field(None, min_length=1, max_length=10)

    
# ---- Subject ---------------------------------------------------------------

class SubjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class SubjectCreate(SubjectBase):
    pass


class SubjectRead(SubjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ---- Grade -----------------------------------------------------------------

class GradeBase(BaseModel):
    student_id: int
    subject_id: int
    score: float = Field(..., ge=0.0, le=100.0)
    semester: str = Field(..., min_length=4, max_length=20)


class GradeCreate(GradeBase):
    pass


class GradeRead(GradeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---- Computed summary ------------------------------------------------------

class SubjectAverage(BaseModel):
    subject_id: int
    subject_name: str
    average_score: float
    grade_count: int


class StudentSummary(BaseModel):
    student_id: int
    student_name: str
    semester: Optional[str] = None
    subjects: list[SubjectAverage]


# ---- Attendance ------------------------------------------------------------

class AttendanceBase(BaseModel):
    student_id: int
    date: str = Field(..., min_length=4, max_length=20)
    status: str = Field(..., min_length=1, max_length=20)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid_statuses = {
            "present": "Present",
            "absent": "Absent",
            "late": "Late",
            "excused": "Excused",
        }
        lower_v = v.strip().lower()
        if lower_v in valid_statuses:
            return valid_statuses[lower_v]
        raise ValueError("Status must be one of: Present, Absent, Late, Excused")


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    date: Optional[str] = Field(None, min_length=4, max_length=20)
    status: Optional[str] = Field(None, min_length=1, max_length=20)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        valid_statuses = {
            "present": "Present",
            "absent": "Absent",
            "late": "Late",
            "excused": "Excused",
        }
        lower_v = v.strip().lower()
        if lower_v in valid_statuses:
            return valid_statuses[lower_v]
        raise ValueError("Status must be one of: Present, Absent, Late, Excused")


class AttendanceRead(AttendanceBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---- Assignment ------------------------------------------------------------

class AssignmentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subject_id: int
    description: Optional[str] = Field(default="", max_length=1000)
    due_date: str = Field(..., min_length=4, max_length=20)
    status: str = Field(default="Pending", min_length=1, max_length=20)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid_statuses = {
            "pending": "Pending",
            "in progress": "In Progress",
            "in_progress": "In Progress",
            "completed": "Completed",
        }
        lower_v = v.strip().lower()
        if lower_v in valid_statuses:
            return valid_statuses[lower_v]
        raise ValueError("Status must be one of: Pending, In Progress, Completed")


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subject_id: Optional[int] = None
    description: Optional[str] = Field(None, max_length=1000)
    due_date: Optional[str] = Field(None, min_length=4, max_length=20)
    status: Optional[str] = Field(None, min_length=1, max_length=20)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        valid_statuses = {
            "pending": "Pending",
            "in progress": "In Progress",
            "in_progress": "In Progress",
            "completed": "Completed",
        }
        lower_v = v.strip().lower()
        if lower_v in valid_statuses:
            return valid_statuses[lower_v]
        raise ValueError("Status must be one of: Pending, In Progress, Completed")


class AssignmentRead(AssignmentBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---- Auth --------------------------------------------------------------

class UserCreate(BaseModel):
    """Internal use only (seeding) — there is no public registration endpoint."""
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, max_length=200)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
