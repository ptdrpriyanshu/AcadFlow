"""
SQLAlchemy ORM models — the database tables.

Four tables for the Mini-Gradebook:
    - Student  : who you are tracking
    - Subject  : what subjects exist (Math, English, etc.)
    - Grade    : a single score for one student, one subject, one semester
    - User     : an authenticated account allowed to write to the API
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    grade_level = Column(String, nullable=False)  # e.g. "5A", "5B"

    grades = relationship(
        "Grade", back_populates="student", cascade="all, delete-orphan"
    )
    attendances = relationship(
        "Attendance", back_populates="student", cascade="all, delete-orphan"
    )


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    grades = relationship(
        "Grade", back_populates="subject", cascade="all, delete-orphan"
    )
    assignments = relationship(
        "Assignment", back_populates="subject", cascade="all, delete-orphan"
    )


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    score = Column(Float, nullable=False)            # 0.0 to 100.0
    semester = Column(String, nullable=False)        # e.g. "2026-S1"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="grades")
    subject = relationship("Subject", back_populates="grades")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(String, nullable=False)            # e.g. "2026-09-17"
    status = Column(String, nullable=False)          # "Present", "Absent", "Late", "Excused"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="attendances")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    description = Column(String, nullable=True, default="")
    due_date = Column(String, nullable=False)        # e.g. "2026-09-25"
    status = Column(String, nullable=False, default="Pending")  # "Pending", "In Progress", "Completed"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subject = relationship("Subject", back_populates="assignments")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
