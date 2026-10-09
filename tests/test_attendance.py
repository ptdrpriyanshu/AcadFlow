"""
Tests for attendance: CRUD logic and API routes.
"""
import crud
import schemas


# ---- CRUD Unit Tests --------------------------------------------------------

class TestAttendanceCRUD:
    def test_list_attendance_starts_empty(self, db_session):
        assert crud.list_attendance(db_session) == []

    def test_create_attendance_returns_record_with_id(self, db_session):
        student = crud.create_student(
            db_session, schemas.StudentCreate(name="Alice", grade_level="10A")
        )
        record = crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(
                student_id=student.id, date="2026-09-17", status="Present"
            ),
        )
        assert record.id is not None
        assert record.student_id == student.id
        assert record.date == "2026-09-17"
        assert record.status == "Present"

    def test_list_attendance_filtered_by_student(self, db_session):
        s1 = crud.create_student(
            db_session, schemas.StudentCreate(name="Alice", grade_level="10A")
        )
        s2 = crud.create_student(
            db_session, schemas.StudentCreate(name="Bob", grade_level="10B")
        )
        crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=s1.id, date="2026-09-17", status="Present"),
        )
        crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=s2.id, date="2026-09-17", status="Absent"),
        )

        alice_records = crud.list_attendance(db_session, student_id=s1.id)
        assert len(alice_records) == 1
        assert alice_records[0].status == "Present"

    def test_list_attendance_filtered_by_status(self, db_session):
        s1 = crud.create_student(
            db_session, schemas.StudentCreate(name="Alice", grade_level="10A")
        )
        crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=s1.id, date="2026-09-17", status="Present"),
        )
        crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=s1.id, date="2026-09-18", status="Absent"),
        )

        absent_records = crud.list_attendance(db_session, status="Absent")
        assert len(absent_records) == 1
        assert absent_records[0].date == "2026-09-18"

    def test_update_attendance(self, db_session):
        student = crud.create_student(
            db_session, schemas.StudentCreate(name="Alice", grade_level="10A")
        )
        record = crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=student.id, date="2026-09-17", status="Absent"),
        )
        updated = crud.update_attendance(
            db_session, record.id, schemas.AttendanceUpdate(status="Present")
        )
        assert updated is not None
        assert updated.status == "Present"

    def test_delete_attendance(self, db_session):
        student = crud.create_student(
            db_session, schemas.StudentCreate(name="Alice", grade_level="10A")
        )
        record = crud.create_attendance(
            db_session,
            schemas.AttendanceCreate(student_id=student.id, date="2026-09-17", status="Present"),
        )
        assert crud.delete_attendance(db_session, record.id) is True
        assert crud.get_attendance(db_session, record.id) is None
        assert crud.delete_attendance(db_session, 9999) is False


# ---- API Route Integration Tests --------------------------------------------

class TestAttendanceRoutes:
    def test_get_attendance_public(self, client):
        response = client.get("/attendance")
        assert response.status_code == 200
        assert response.json() == []

    def test_post_attendance_without_token_returns_401(self, client):
        response = client.post(
            "/attendance",
            json={"student_id": 1, "date": "2026-09-17", "status": "Present"},
        )
        assert response.status_code == 401

    def test_post_attendance_creates_record(self, client, auth_headers):
        student = client.post(
            "/students",
            json={"name": "Alice", "grade_level": "10A"},
            headers=auth_headers,
        ).json()

        response = client.post(
            "/attendance",
            json={"student_id": student["id"], "date": "2026-09-17", "status": "Present"},
            headers=auth_headers,
        )
        assert response.status_code == 201
        body = response.json()
        assert body["student_id"] == student["id"]
        assert body["status"] == "Present"
        assert "id" in body

    def test_post_attendance_with_nonexistent_student_returns_404(self, client, auth_headers):
        response = client.post(
            "/attendance",
            json={"student_id": 9999, "date": "2026-09-17", "status": "Present"},
            headers=auth_headers,
        )
        assert response.status_code == 404

    def test_post_attendance_with_invalid_status_returns_422(self, client, auth_headers):
        student = client.post(
            "/students",
            json={"name": "Alice", "grade_level": "10A"},
            headers=auth_headers,
        ).json()

        response = client.post(
            "/attendance",
            json={"student_id": student["id"], "date": "2026-09-17", "status": "InvalidStatus"},
            headers=auth_headers,
        )
        assert response.status_code == 422

    def test_patch_attendance_updates_status(self, client, auth_headers):
        student = client.post(
            "/students",
            json={"name": "Alice", "grade_level": "10A"},
            headers=auth_headers,
        ).json()

        created = client.post(
            "/attendance",
            json={"student_id": student["id"], "date": "2026-09-17", "status": "Absent"},
            headers=auth_headers,
        ).json()

        response = client.patch(
            f"/attendance/{created['id']}",
            json={"status": "Present"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Present"

    def test_delete_attendance_removes_record(self, client, auth_headers):
        student = client.post(
            "/students",
            json={"name": "Alice", "grade_level": "10A"},
            headers=auth_headers,
        ).json()

        created = client.post(
            "/attendance",
            json={"student_id": student["id"], "date": "2026-09-17", "status": "Present"},
            headers=auth_headers,
        ).json()

        response = client.delete(f"/attendance/{created['id']}", headers=auth_headers)
        assert response.status_code == 204

        assert client.get(f"/attendance/{created['id']}").status_code == 404
