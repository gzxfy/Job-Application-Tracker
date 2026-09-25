from datetime import datetime

from backend.models.Interview_model import Interview


def create_application(client):
    response = client.post(
        "/api/applications/create",
        json={
            "company_name": "Interview Company",
            "position": "Backend Developer",
            "status": "Applied",
        },
    )
    assert response.status_code == 201
    return response.get_json()["id"]


def create_interview(client, application_id):
    return client.post(
        f"/api/applications/{application_id}/interviews",
        json={
            "interview_date": "2026-10-15T14:30:00",
            "interview_type": "Technical",
            "notes": "Review API design before the interview.",
            "status": "Scheduled",
        },
    )


def test_interviews_require_login(client):
    response = client.get("/api/applications/1/interviews")

    assert response.status_code == 401
    assert response.get_json()["error"] == "Please log in"


def test_create_interview_persists_and_returns_interview(logged_in_client):
    application_id = create_application(logged_in_client)

    response = create_interview(logged_in_client, application_id)

    assert response.status_code == 201
    data = response.get_json()
    interview = Interview.query.filter_by(id=data["id"]).first()

    assert data["application_id"] == application_id
    assert data["company_id"] == 2
    assert data["interview_type"] == "Technical"
    assert data["notes"] == "Review API design before the interview."
    assert data["status"] == "Scheduled"
    assert interview is not None
    assert interview.interview_date == datetime(2026, 10, 15, 14, 30)


def test_get_interviews_returns_application_interviews(logged_in_client):
    application_id = create_application(logged_in_client)
    create_response = create_interview(logged_in_client, application_id)
    interview_id = create_response.get_json()["id"]

    response = logged_in_client.get(
        f"/api/applications/{application_id}/interviews"
    )

    assert response.status_code == 200
    interviews = response.get_json()
    assert len(interviews) == 1
    assert interviews[0]["id"] == interview_id
    assert interviews[0]["interview_type"] == "Technical"


def test_get_one_interview_returns_requested_interview(logged_in_client):
    application_id = create_application(logged_in_client)
    create_response = create_interview(logged_in_client, application_id)
    interview_id = create_response.get_json()["id"]

    response = logged_in_client.get(
        f"/api/applications/{application_id}/interviews/{interview_id}"
    )

    assert response.status_code == 200
    assert response.get_json()["id"] == interview_id


def test_update_interview_changes_details(logged_in_client):
    application_id = create_application(logged_in_client)
    create_response = create_interview(logged_in_client, application_id)
    interview_id = create_response.get_json()["id"]

    response = logged_in_client.put(
        f"/api/applications/{application_id}/interviews/{interview_id}",
        json={
            "interview_type": "Behavioral",
            "status": "Completed",
            "notes": "Discussed previous projects.",
        },
    )

    assert response.status_code == 200
    data = response.get_json()
    interview = Interview.query.filter_by(id=interview_id).first()
    assert data["interview_type"] == "Behavioral"
    assert data["status"] == "Completed"
    assert interview.notes == "Discussed previous projects."


def test_delete_interview_removes_only_selected_interview(logged_in_client):
    application_id = create_application(logged_in_client)
    first_response = create_interview(logged_in_client, application_id)
    second_response = logged_in_client.post(
        f"/api/applications/{application_id}/interviews",
        json={
            "interview_date": "2026-10-20",
            "interview_type": "Culture",
            "status": "Scheduled",
        },
    )
    first_id = first_response.get_json()["id"]
    second_id = second_response.get_json()["id"]

    response = logged_in_client.delete(
        f"/api/applications/{application_id}/interviews/{first_id}"
    )

    assert response.status_code == 200
    assert Interview.query.filter_by(id=first_id).first() is None
    assert Interview.query.filter_by(id=second_id).first() is not None


def test_create_interview_requires_date_and_type(logged_in_client):
    application_id = create_application(logged_in_client)

    response = logged_in_client.post(
        f"/api/applications/{application_id}/interviews",
        json={"status": "Scheduled"},
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Must provide an interview date"
