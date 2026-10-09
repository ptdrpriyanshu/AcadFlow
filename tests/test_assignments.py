"""
Tests for assignments: CRUD logic and API routes.
"""
import crud
import schemas


# ---- CRUD Unit Tests --------------------------------------------------------

class TestAssignmentsCRUD:
    def test_list_assignments_starts_empty(self, db_session):
        assert crud.list_assignments(db_session) == []

    def test_create_assignment_returns_record_with_id(self, db_session):
        subject = crud.create_subject(db_session, schemas.SubjectCreate(name="Science"))
        record = crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="Lab Report 1",
                subject_id=subject.id,
                description="Write 2 pages on photosynthesis",
                due_date="2026-09-25",
                status="Pending",
            ),
        )
        assert record.id is not None
        assert record.title == "Lab Report 1"
        assert record.subject_id == subject.id
        assert record.status == "Pending"

    def test_list_assignments_filtered_by_subject(self, db_session):
        s1 = crud.create_subject(db_session, schemas.SubjectCreate(name="Math"))
        s2 = crud.create_subject(db_session, schemas.SubjectCreate(name="English"))
        crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="Algebra Homework", subject_id=s1.id, due_date="2026-09-22"
            ),
        )
        crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="Essay Draft", subject_id=s2.id, due_date="2026-09-24"
            ),
        )

        math_assignments = crud.list_assignments(db_session, subject_id=s1.id)
        assert len(math_assignments) == 1
        assert math_assignments[0].title == "Algebra Homework"

    def test_list_assignments_filtered_by_status(self, db_session):
        subject = crud.create_subject(db_session, schemas.SubjectCreate(name="Math"))
        crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="HW 1", subject_id=subject.id, due_date="2026-09-22", status="Completed"
            ),
        )
        crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="HW 2", subject_id=subject.id, due_date="2026-09-24", status="Pending"
            ),
        )

        pending = crud.list_assignments(db_session, status="Pending")
        assert len(pending) == 1
        assert pending[0].title == "HW 2"

    def test_update_assignment(self, db_session):
        subject = crud.create_subject(db_session, schemas.SubjectCreate(name="Math"))
        record = crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="HW 1", subject_id=subject.id, due_date="2026-09-22", status="Pending"
            ),
        )
        updated = crud.update_assignment(
            db_session,
            record.id,
            schemas.AssignmentUpdate(status="Completed", title="HW 1 (Revised)"),
        )
        assert updated is not None
        assert updated.status == "Completed"
        assert updated.title == "HW 1 (Revised)"

    def test_delete_assignment(self, db_session):
        subject = crud.create_subject(db_session, schemas.SubjectCreate(name="Math"))
        record = crud.create_assignment(
            db_session,
            schemas.AssignmentCreate(
                title="HW 1", subject_id=subject.id, due_date="2026-09-22"
            ),
        )
        assert crud.delete_assignment(db_session, record.id) is True
        assert crud.get_assignment(db_session, record.id) is None
        assert crud.delete_assignment(db_session, 9999) is False


# ---- API Route Integration Tests --------------------------------------------

class TestAssignmentsRoutes:
    def test_get_assignments_public(self, client):
        response = client.get("/assignments")
        assert response.status_code == 200
        assert response.json() == []

    def test_post_assignment_without_token_returns_401(self, client):
        response = client.post(
            "/assignments",
            json={
                "title": "History Quiz",
                "subject_id": 1,
                "due_date": "2026-09-25",
                "status": "Pending",
            },
        )
        assert response.status_code == 401

    def test_post_assignment_creates_record(self, client, auth_headers):
        subject = client.post(
            "/subjects",
            json={"name": "History"},
            headers=auth_headers,
        ).json()

        response = client.post(
            "/assignments",
            json={
                "title": "WWII Essay",
                "subject_id": subject["id"],
                "description": "500-word essay",
                "due_date": "2026-09-30",
                "status": "Pending",
            },
            headers=auth_headers,
        )
        assert response.status_code == 201
        body = response.json()
        assert body["title"] == "WWII Essay"
        assert body["subject_id"] == subject["id"]
        assert body["status"] == "Pending"
        assert "id" in body

    def test_post_assignment_with_nonexistent_subject_returns_404(self, client, auth_headers):
        response = client.post(
            "/assignments",
            json={
                "title": "Ghost Assignment",
                "subject_id": 9999,
                "due_date": "2026-09-30",
                "status": "Pending",
            },
            headers=auth_headers,
        )
        assert response.status_code == 404

    def test_post_assignment_rejects_empty_title(self, client, auth_headers):
        subject = client.post(
            "/subjects",
            json={"name": "Art"},
            headers=auth_headers,
        ).json()

        response = client.post(
            "/assignments",
            json={
                "title": "",
                "subject_id": subject["id"],
                "due_date": "2026-09-30",
            },
            headers=auth_headers,
        )
        assert response.status_code == 422

    def test_patch_assignment_updates_status(self, client, auth_headers):
        subject = client.post(
            "/subjects",
            json={"name": "Music"},
            headers=auth_headers,
        ).json()

        created = client.post(
            "/assignments",
            json={
                "title": "Violin Practice",
                "subject_id": subject["id"],
                "due_date": "2026-09-28",
                "status": "Pending",
            },
            headers=auth_headers,
        ).json()

        response = client.patch(
            f"/assignments/{created['id']}",
            json={"status": "Completed"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Completed"

    def test_delete_assignment_removes_record(self, client, auth_headers):
        subject = client.post(
            "/subjects",
            json={"name": "Drama"},
            headers=auth_headers,
        ).json()

        created = client.post(
            "/assignments",
            json={
                "title": "Monologue",
                "subject_id": subject["id"],
                "due_date": "2026-09-28",
                "status": "Pending",
            },
            headers=auth_headers,
        ).json()

        response = client.delete(f"/assignments/{created['id']}", headers=auth_headers)
        assert response.status_code == 204

        assert client.get(f"/assignments/{created['id']}").status_code == 404
