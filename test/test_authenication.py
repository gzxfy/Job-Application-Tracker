from app import create_app
from conftest import app_context
from backend.models.User_model import User
from werkzeug.security import check_password_hash

def register_test_user(client):
    return client.post('/api/register', json={
        'email': 'testuser@example.com',
        'password': 'TestPassword123!',
        'confirm_password': 'TestPassword123!'
    })

def login_test_user(client):
    register_test_user(client)  # Ensure the user is registered before login
    return client.post('/api/login', json={
        'email': 'testuser@example.com',
        'password': 'TestPassword123!'
    })

app = create_app()

def test_register_user(app_context):
    client = app_context.test_client()
    response = register_test_user(client)
    user = User.query.filter_by(email='testuser@example.com').first()

    assert response.status_code == 201
    assert response.get_json()['message'] == 'User registered successfully'
    assert response.get_json()['user']['email'] == 'testuser@example.com'

    # Verify that the user is stored in the database with a hashed password
    assert user is not None
    assert user.email == 'testuser@example.com'
    assert check_password_hash(user.password, 'TestPassword123!')
    assert user.password != 'TestPassword123!'  # Ensure the password is hashed


def test_login_user(app_context):
    client = app_context.test_client()
    register_test_user(client)  # Ensure the user is registered before login
    response = login_test_user(client)
    user = User.query.filter_by(email='testuser@example.com').first()

    assert response.status_code == 200
    assert response.get_json()['message'] == 'User logged in successfully'
    assert response.get_json()['user']['email'] == 'testuser@example.com'

    # Verify that the user is stored in the database with a hashed password
    assert user is not None
    assert user.email == 'testuser@example.com'
    assert check_password_hash(user.password, 'TestPassword123!')
    assert user.password != 'TestPassword123!'  # Ensure the password is hashed

def test_duplicate_registration(app_context):
    client = app_context.test_client()
    register_test_user(client)  # First registration
    response = register_test_user(client)  # Attempt duplicate registration
    user = User.query.filter_by(email='testuser@example.com').first()

    assert response.status_code == 400
    assert response.get_json()['error'] == 'Email already exists'

    # Verify that the user is stored in the database with a hashed password
    assert user is not None
    assert user.email == 'testuser@example.com'
    assert check_password_hash(user.password, 'TestPassword123!')
    assert user.password != 'TestPassword123!'  # Ensure the password is hashed

# This test if the password is less than 8 characters
def test_password_length_registration(app_context):
    client = app_context.test_client()

    response = client.post('api/register', json={
        'email': 'testuser@example.com',
        'password': 'aIugn1!',
        'confirm_password': 'aIuGn1!'    
        })

    assert response.status_code == 400
    assert response.get_json()['error'] == 'Password must be at least 8 characters long'
