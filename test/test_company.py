from backend.models.Company_model import Company


def create_company(client, name="Acme Labs"):
    return client.post(
        "/api/companies",
        json={
            "name": name,
            "website": "https://acme.example.com",
            "headquarters": "New York",
        },
    )


def test_companies_require_login(client):
    response = client.get("/api/companies")

    assert response.status_code == 401
    assert response.get_json()["error"] == "Please log in"


def test_create_company_persists_and_returns_company(logged_in_client):
    response = create_company(logged_in_client)

    assert response.status_code == 201
    data = response.get_json()
    company = Company.query.filter_by(id=data["id"]).first()

    assert data["name"] == "Acme Labs"
    assert data["website"] == "https://acme.example.com"
    assert data["headquarters"] == "New York"
    assert company is not None
    assert company.name == "Acme Labs"
    assert company.user_id == 1


def test_get_companies_returns_created_company(logged_in_client):
    created_response = create_company(logged_in_client)
    company_id = created_response.get_json()["id"]

    response = logged_in_client.get("/api/companies")

    assert response.status_code == 200
    companies = response.get_json()
    returned_company = next(
        company for company in companies if company["id"] == company_id
    )

    assert returned_company["name"] == "Acme Labs"
    assert returned_company["headquarters"] == "New York"


def test_get_company_returns_requested_company(logged_in_client):
    created_response = create_company(logged_in_client)
    company_id = created_response.get_json()["id"]

    response = logged_in_client.get(f"/api/companies/{company_id}")

    assert response.status_code == 200
    data = response.get_json()
    assert data["id"] == company_id
    assert data["name"] == "Acme Labs"


def test_create_company_requires_required_fields(logged_in_client):
    response = logged_in_client.post(
        "/api/companies",
        json={"name": "Incomplete Company"},
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Must enter a headquarters location"


def test_update_company_changes_only_requested_fields(logged_in_client):
    created_response = create_company(logged_in_client)
    company_id = created_response.get_json()["id"]

    response = logged_in_client.put(
        f"/api/companies/{company_id}",
        json={"headquarters": "Boston"},
    )

    assert response.status_code == 200
    data = response.get_json()
    company = Company.query.filter_by(id=company_id).first()

    assert data["headquarters"] == "Boston"
    assert data["name"] == "Acme Labs"
    assert company.headquarters == "Boston"
    assert company.website == "https://acme.example.com"


def test_delete_company_removes_company(logged_in_client):
    created_response = create_company(logged_in_client)
    company_id = created_response.get_json()["id"]

    response = logged_in_client.delete(f"/api/companies/{company_id}")

    assert response.status_code == 200
    assert response.get_json()["message"] == "Company deleted successfully"
    assert Company.query.filter_by(id=company_id).first() is None


def test_user_cannot_update_another_users_company(logged_in_client, client):
    created_response = create_company(logged_in_client, name="Private Company")
    company_id = created_response.get_json()["id"]

    client.post(
        "/api/register",
        json={
            "name": "Second User",
            "email": "second@example.com",
            "password": "AnotherPassword123!",
            "confirm_password": "AnotherPassword123!",
        },
    )
    client.post(
        "/api/login",
        json={
            "email": "second@example.com",
            "password": "AnotherPassword123!",
        },
    )

    response = client.put(
        f"/api/companies/{company_id}",
        json={"name": "Changed Company"},
    )

    assert response.status_code == 404
    assert response.get_json()["error"] == "Company not found"
