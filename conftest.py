import pytest

from app import create_app, db
from backend.models.Company_model import Company


@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "SECRET_KEY": "test-secret",
    })

    with app.app_context():
        db.create_all()

        company = Company(
            name="Test Company",
            website="https://example.com",
            location="Remote",
        )
        db.session.add(company)
        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def logged_in_client(client):
    register_response = client.post("/api/register", json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "TestPassword123!",
        "confirm_password": "TestPassword123!",
    })

    assert register_response.status_code == 200

    login_response = client.post("/api/login", json={
        "email": "testuser@example.com",
        "password": "TestPassword123!",
    })

    assert login_response.status_code == 200
    return client