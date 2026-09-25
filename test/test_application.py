from backend.models.Application_model import Application


def test_create_application(logged_in_client):
    response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Test Position",
        "job_url": "https://example.com/job",
        "salary": 95000,
        "location": "Remote",
        "work_type": "Full-time",
        "status": "Applied",
    })

    assert response.status_code == 201

    data = response.get_json()
    application = Application.query.filter_by(id=data["id"]).first()

    assert data["company_id"] == 1
    assert data["position"] == "Test Position"
    assert data["job_url"] == "https://example.com/job"
    assert data["salary"] == 95000
    assert data["location"] == "Remote"
    assert data["work_type"] == "Full-time"
    assert data["status"] == "Applied"
    assert application is not None
    assert application.user_id == 1
    assert application.company_id == 1
    assert application.position == "Test Position"
    assert application.salary == 95000
    assert application.location == "Remote"
    assert application.work_type == "Full-time"


def test_get_application_by_id(logged_in_client):
    create_response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Test Position",
        "salary": 105000,
        "location": "New York",
        "work_type": "Hybrid",
        "status": "Applied",
    })
    application_id = create_response.get_json()["id"]

    response = logged_in_client.get(f"/api/applications/{application_id}")

    assert response.status_code == 200
    data = response.get_json()
    assert data["id"] == application_id
    assert data["company_id"] == 1
    assert data["position"] == "Test Position"
    assert data["status"] == "Applied"
    assert data["salary"] == 105000
    assert data["location"] == "New York"
    assert data["work_type"] == "Hybrid"


def test_get_applications_returns_logged_in_users_applications(logged_in_client):
    logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Test Position",
        "status": "Applied",
    })

    response = logged_in_client.get("/api/applications")

    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]["position"] == "Test Position"


def test_update_application_updates_database(logged_in_client):
    create_response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Old Position",
        "status": "Applied",
    })
    application_id = create_response.get_json()["id"]

    response = logged_in_client.put(
        f"/api/applications/update/{application_id}",
        json={
            "position": "Updated Position",
            "status": "Interview",
            "job_url": "https://example.com/updated-job",
            "salary": 110000,
            "location": "Austin, TX",
            "work_type": "On-site",
        },
    )

    assert response.status_code == 200
    data = response.get_json()
    application = Application.query.get(application_id)
    assert data["position"] == "Updated Position"
    assert data["status"] == "Interview"
    assert data["salary"] == 110000
    assert data["location"] == "Austin, TX"
    assert data["work_type"] == "On-site"
    assert application.position == "Updated Position"
    assert application.status == "Interview"
    assert application.job_url == "https://example.com/updated-job"
    assert application.salary == 110000
    assert application.location == "Austin, TX"
    assert application.work_type == "On-site"


def test_update_application_saves_job_description(logged_in_client):
    create_response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Backend Developer",
        "status": "Applied",
    })
    application_id = create_response.get_json()["id"]

    update_response = logged_in_client.put(
        f"/api/applications/update/{application_id}",
        json={
            "job_description": "Build APIs and maintain data services.",
        },
    )

    assert update_response.status_code == 200
    assert update_response.get_json()["job_description"] == (
        "Build APIs and maintain data services."
    )

    read_response = logged_in_client.get(
        f"/api/applications/{application_id}"
    )

    assert read_response.status_code == 200
    assert read_response.get_json()["job_description"] == (
        "Build APIs and maintain data services."
    )


def test_delete_application_removes_it_from_database(logged_in_client):
    create_response = logged_in_client.post("/api/applications/create", json={
        "company_id": 1,
        "position": "Test Position",
        "status": "Applied",
    })
    application_id = create_response.get_json()["id"]

    response = logged_in_client.delete(
        f"/api/applications/delete/{application_id}"
    )

    assert response.status_code == 200
    assert response.get_json()["message"] == "Application deleted successfully"
    assert Application.query.get(application_id) is None


def test_applications_require_login(client):
    response = client.get("/api/applications")

    assert response.status_code == 401
    assert response.get_json()["error"] == "Please log in"