"""
Database operations — the "service layer" between routers and the ORM.

Keeping these functions out of the routers means each router file stays focused
on HTTP concerns (status codes, validation, error handling) while crud.py
concentrates the database logic. It also makes the database operations easy to
unit-test without spinning up FastAPI itself.
"""
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

import models
import schemas


# ---- Students --------------------------------------------------------------

def list_students(db: Session) -> list[models.Student]:
    return db.query(models.Student).all()


def get_student(db: Session, student_id: int) -> Optional[models.Student]:
    return db.query(models.Student).filter(models.Student.id == student_id).first()


def create_student(db: Session, payload: schemas.StudentCreate) -> models.Student:
    student = models.Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def delete_student(db: Session, student_id: int) -> bool:
    student = get_student(db, student_id)
    if student is None:
        return False
    db.delete(student)
    db.commit()
    return True

def update_student(db: Session, student_id: int, payload:schemas.StudentUpdate,) -> Optional[models.Student]:
    student = get_student(db, student_id)
    if student is None:
        return None
    # exclude_unset=True is the KEY idea - we only get the fields
    # the user actually sent, not the ones that defaulted to None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


# ---- Subjects --------------------------------------------------------------

def list_subjects(db: Session) -> list[models.Subject]:
    return db.query(models.Subject).all()


def get_subject(db: Session, subject_id: int) -> Optional[models.Subject]:
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()


def get_subject_by_name(db: Session, name: str) -> Optional[models.Subject]:
    return db.query(models.Subject).filter(models.Subject.name == name).first()


def create_subject(db: Session, payload: schemas.SubjectCreate) -> models.Subject:
    subject = models.Subject(**payload.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def delete_subject(db: Session, subject_id: int) -> bool:
    subject = get_subject(db, subject_id)
    if subject is None:
        return False
    db.delete(subject)
    db.commit()
    return True


# ---- Grades ----------------------------------------------------------------

def list_grades(
    db: Session,
    student_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    semester: Optional[str] = None,
) -> list[models.Grade]:
    q = db.query(models.Grade)
    if student_id is not None:
        q = q.filter(models.Grade.student_id == student_id)
    if subject_id is not None:
        q = q.filter(models.Grade.subject_id == subject_id)
    if semester is not None:
        q = q.filter(models.Grade.semester == semester)
    return q.all()


def get_grade(db: Session, grade_id: int) -> Optional[models.Grade]:
    return db.query(models.Grade).filter(models.Grade.id == grade_id).first()


def create_grade(db: Session, payload: schemas.GradeCreate) -> models.Grade:
    grade = models.Grade(**payload.model_dump())
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade


def delete_grade(db: Session, grade_id: int) -> bool:
    grade = get_grade(db, grade_id)
    if grade is None:
        return False
    db.delete(grade)
    db.commit()
    return True


# ---- Computed: per-subject averages for one student ------------------------

def student_summary(
    db: Session,
    student_id: int,
    semester: Optional[str] = None,
) -> Optional[schemas.StudentSummary]:
    student = get_student(db, student_id)
    if student is None:
        return None

    q = (
        db.query(
            models.Subject.id.label("subject_id"),
            models.Subject.name.label("subject_name"),
            func.avg(models.Grade.score).label("avg_score"),
            func.count(models.Grade.id).label("grade_count"),
        )
        .join(models.Grade, models.Grade.subject_id == models.Subject.id)
        .filter(models.Grade.student_id == student_id)
    )
    if semester is not None:
        q = q.filter(models.Grade.semester == semester)
    q = q.group_by(models.Subject.id, models.Subject.name)

    subjects = [
        schemas.SubjectAverage(
            subject_id=row.subject_id,
            subject_name=row.subject_name,
            average_score=round(row.avg_score, 2),
            grade_count=row.grade_count,
        )
        for row in q.all()
    ]

    return schemas.StudentSummary(
        student_id=student.id,
        student_name=student.name,
        semester=semester,
        subjects=subjects,
    )


# ---- Attendance ------------------------------------------------------------

def list_attendance(
    db: Session,
    student_id: Optional[int] = None,
    date: Optional[str] = None,
    status: Optional[str] = None,
) -> list[models.Attendance]:
    q = db.query(models.Attendance)
    if student_id is not None:
        q = q.filter(models.Attendance.student_id == student_id)
    if date is not None:
        q = q.filter(models.Attendance.date == date)
    if status is not None:
        q = q.filter(models.Attendance.status == status)
    return q.all()


def get_attendance(db: Session, attendance_id: int) -> Optional[models.Attendance]:
    return db.query(models.Attendance).filter(models.Attendance.id == attendance_id).first()


def create_attendance(db: Session, payload: schemas.AttendanceCreate) -> models.Attendance:
    attendance = models.Attendance(**payload.model_dump())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


def update_attendance(
    db: Session, attendance_id: int, payload: schemas.AttendanceUpdate
) -> Optional[models.Attendance]:
    attendance = get_attendance(db, attendance_id)
    if attendance is None:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(attendance, field, value)
    db.commit()
    db.refresh(attendance)
    return attendance


def delete_attendance(db: Session, attendance_id: int) -> bool:
    attendance = get_attendance(db, attendance_id)
    if attendance is None:
        return False
    db.delete(attendance)
    db.commit()
    return True


# ---- Assignments -----------------------------------------------------------

def list_assignments(
    db: Session,
    subject_id: Optional[int] = None,
    status: Optional[str] = None,
) -> list[models.Assignment]:
    q = db.query(models.Assignment)
    if subject_id is not None:
        q = q.filter(models.Assignment.subject_id == subject_id)
    if status is not None:
        q = q.filter(models.Assignment.status == status)
    return q.all()


def get_assignment(db: Session, assignment_id: int) -> Optional[models.Assignment]:
    return db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()


def create_assignment(db: Session, payload: schemas.AssignmentCreate) -> models.Assignment:
    assignment = models.Assignment(**payload.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


def update_assignment(
    db: Session, assignment_id: int, payload: schemas.AssignmentUpdate
) -> Optional[models.Assignment]:
    assignment = get_assignment(db, assignment_id)
    if assignment is None:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(assignment, field, value)
    db.commit()
    db.refresh(assignment)
    return assignment


def delete_assignment(db: Session, assignment_id: int) -> bool:
    assignment = get_assignment(db, assignment_id)
    if assignment is None:
        return False
    db.delete(assignment)
    db.commit()
    return True
