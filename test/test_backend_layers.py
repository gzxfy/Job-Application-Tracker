"""Regression coverage for workflows crossing the three backend layers."""
import pytest
from sqlalchemy.exc import IntegrityError

from backend.repositories import user_repository


def test_repository_session_recovers_after_failed_write(app):
    user_repository.create(name="First", email="first@example.com", password="hash")
    with pytest.raises(IntegrityError):
        user_repository.create(name="Duplicate", email="first@example.com", password="hash")

    saved = user_repository.create(name="Second", email="second@example.com", password="hash")
    assert user_repository.get_by_id(saved.id).email == "second@example.com"
    assert user_repository.get_by_email("first@example.com").name == "First"


def test_account_reads_through_service(logged_in_client):
    response = logged_in_client.get("/api/me")
    assert response.status_code == 200
    assert response.get_json()["user"]["email"] == "testuser@example.com"
    response = logged_in_client.get("/api/account")
    assert response.status_code == 200
    assert response.get_json()["email"] == "testuser@example.com"


def test_application_workflow_creates_company(logged_in_client):
    response = logged_in_client.post("/api/applications/create", json={
        "company_name": "  New Company  ", "position": "  Engineer  "
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["position"] == "Engineer"
    assert data["company_name"] == "New Company"
    company = logged_in_client.get(f"/api/companies/{data['company_id']}").get_json()
    assert company["name"] == "New Company"
    assert company["user_id"] == data["user_id"]


@pytest.mark.parametrize("payload, status, message", [
    ({"company_name": "Unused", "position": "  "}, 400, "position is required"),
    ({"company_id": 999, "position": "Engineer"}, 404, "Company not found"),
])
def test_application_workflow_maps_service_errors(logged_in_client, payload, status, message):
    response = logged_in_client.post("/api/applications/create", json=payload)
    assert response.status_code == status
    assert response.get_json()["error"] == message
    assert logged_in_client.get("/api/applications").get_json() == []
    companies = logged_in_client.get("/api/companies").get_json()
    assert not any(company["name"] == "Unused" for company in companies)
