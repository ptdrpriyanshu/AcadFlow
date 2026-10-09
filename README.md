# AcadFlow · Academic Management System

<p align="center">
  <strong>Modern Student Performance & Academic Management System</strong><br>
  Built with FastAPI, SQLAlchemy, SQLite, Alembic, and React + Vite.
</p>

---

## 🌟 Overview

**AcadFlow** is a comprehensive academic management platform designed for administrators, teachers, and educational institutions. It delivers end-to-end management of students, subjects, grades, daily attendance, and course assignments, backed by JWT-authenticated REST APIs and an interactive dashboard.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT bearer tokens (`python-jose` + `passlib` bcrypt) guarding all administrative write operations (`POST`, `PATCH`, `DELETE`). Read endpoints remain publicly accessible for reporting and analytics.
- **👨‍🎓 Student Management**: Full CRUD operations with grade-level tagging, search filtering, detailed modal profiles, and automated summary aggregations.
- **📚 Subjects & Curriculum**: Subject catalog with duplicate-prevention constraints and cascade orphan removal.
- **📊 Grades & Computed Averages**: Record exam and coursework marks (0–100 scale), semester breakdown, and automated per-subject group averages (`/students/{id}/summary`).
- **📅 Daily Attendance Tracking**: Record student presence (`Present`, `Absent`, `Late`, `Excused`), filterable by student, date, and status with attendance rate analytics.
- **📝 Course Assignments**: Manage assignment deadlines, descriptions, and dynamic status progressions (`Pending` ➔ `In Progress` ➔ `Completed`).
- **📈 Real-Time Dashboard**: Live analytics calculating overall average scores, active assignments, attendance percentages, and recent grade submissions directly from database queries.
- **⚙️ Alembic Database Migrations**: Non-destructive, versioned database migrations preserving existing records across schema iterations.
- **🧪 Comprehensive Test Suite**: 90+ tests covering unit CRUD, API integration, and security authorization with pytest.
- **🎨 AcadFlow UI**: Clean interface built with React 19 + Vite and responsive CSS.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Server**: Uvicorn ASGI
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Database**: SQLite (Development / Local) & PostgreSQL compatible
- **Migrations**: Alembic
- **Testing**: Pytest & FastAPI TestClient

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS (Modular, responsive, custom design system)
- **State & Communication**: React Hooks + native Fetch API with JWT Bearer storage

---

## 📡 REST API Endpoints

All write routes (`POST`, `PATCH`, `DELETE`) require `Authorization: Bearer <token>`. Read routes (`GET`) are public.

| Area | Method | Path | Auth | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Public | Exchange `username` & `password` for JWT access token |
| **Health** | `GET` | `/health` | Public | Service health status check |
| **Docs** | `GET` | `/docs` | Public | Interactive Swagger UI API documentation |
| **Docs** | `GET` | `/redoc` | Public | ReDoc interactive API specification |
| **Students** | `GET` | `/students` | Public | List all students |
| | `POST` | `/students` | 🔒 Required | Create a new student profile |
| | `GET` | `/students/{id}` | Public | Retrieve a specific student by ID |
| | `PATCH` | `/students/{id}` | 🔒 Required | Partial update of student details |
| | `DELETE` | `/students/{id}` | 🔒 Required | Delete student (cascades to grades & attendance) |
| | `GET` | `/students/{id}/summary` | Public | Per-subject average grades summary (`?semester=`) |
| **Subjects** | `GET` | `/subjects` | Public | List all subjects |
| | `POST` | `/subjects` | 🔒 Required | Create a subject (409 Conflict if duplicate name) |
| **Grades** | `GET` | `/grades` | Public | List grades (`?student_id=&subject_id=&semester=`) |
| | `POST` | `/grades` | 🔒 Required | Record student grade in a subject for a semester |
| **Attendance** | `GET` | `/attendance` | Public | List attendance records (`?student_id=&date=&status=`) |
| | `POST` | `/attendance` | 🔒 Required | Record attendance (`Present`, `Absent`, `Late`, `Excused`) |
| | `GET` | `/attendance/{id}` | Public | Get single attendance record |
| | `PATCH` | `/attendance/{id}` | 🔒 Required | Update attendance date or status |
| | `DELETE` | `/attendance/{id}` | 🔒 Required | Delete attendance record |
| **Assignments**| `GET` | `/assignments` | Public | List assignments (`?subject_id=&status=`) |
| | `POST` | `/assignments` | 🔒 Required | Create assignment with title, subject, due date |
| | `GET` | `/assignments/{id}` | Public | Get single assignment details |
| | `PATCH` | `/assignments/{id}` | 🔒 Required | Update title, subject, due date, or status |
| | `DELETE` | `/assignments/{id}` | 🔒 Required | Delete assignment |

---

## ⚡ Getting Started

### 1. Backend Setup

```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
alembic upgrade head

# 4. Seed admin user (if first run)
ADMIN_USERNAME=admin ADMIN_PASSWORD=adminpassword python seed_admin.py

# 5. Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

The backend will be available at:
- **API Base**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

### 2. Frontend Setup

```bash
cd frontend

# 1. Install frontend packages
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build
npm run build
```

The frontend application runs at `http://127.0.0.1:5173`.

---

## 🗄️ Database Migrations with Alembic

Database migrations are managed safely through Alembic:

```bash
# Check current migration revision
alembic current

# Apply pending migrations
alembic upgrade head

# Generate a new migration after updating models.py
alembic revision --autogenerate -m "describe changes"
```

---

## 🧪 Testing

Execute the comprehensive backend test suite:

```bash
source .venv/bin/activate
pytest -v
```

Tests cover:
- CRUD logic for Students, Subjects, Grades, Attendance, and Assignments
- API route status codes (200, 201, 204, 401, 404, 409, 422)
- JWT authentication and token validation
- Cascade deletions and isolated database fixtures