"""
School Portal API — FastAPI rebuild of the School Portal API layer.

A learning project: same domain as the original (students, subjects, grades)
but built from scratch in FastAPI with SQLAlchemy + SQLite, to learn the
React-plus-FastAPI stack hands-on.
"""
from fastapi import FastAPI

import models
from database import Base, engine
from routers import assignments, attendance, auth, grades, students, subjects
from fastapi.middleware.cors import CORSMiddleware

# Create database tables on startup.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AcadFlow API",
    description=(
        "AcadFlow — Student Academic Management & Performance System. "
        "Comprehensive REST API featuring Students, Subjects, Grades, "
        "Attendance, and Assignments with JWT Authentication."
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server (default)
        "http://127.0.0.1:5173",
        "http://localhost:3000",   # Common alt (Next.js, CRA)
        "http://127.0.0.1:3000",
        "https://school-portal-frontend-iota.vercel.app",  
        "https://school-portal-frontend-git-master-aleksei-lopatin-s-projects.vercel.app",
        "https://school-portal-frontend-5rldlzfjv-aleksei-lopatin-s-projects.vercel.app",
        "https://gradebook.alekseilopatin.com", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
async def root():
    return {"message": "AcadFlow API is running"}


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


# Register routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(subjects.router)
app.include_router(grades.router)
app.include_router(attendance.router)
app.include_router(assignments.router)
