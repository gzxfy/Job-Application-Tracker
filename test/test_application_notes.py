from backend.models.Application_model import Application

def test_create_application(logged_in_client):
    response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Test Position",
        "job_url": "https://example.com/job",
        "status": "Applied",
    })

    assert response.status_code == 201

    data = response.get_json()
    application = Application.query.filter_by(id=data["id"]).first()

    assert data["company_id"] == 1
    assert data["position"] == "Test Position"
    assert data["job_url"] == "https://example.com/job"
    assert data["status"] == "Applied"
    assert application is not None
    assert application.user_id == 1
    assert application.company_id == 1
    assert application.position == "Test Position"