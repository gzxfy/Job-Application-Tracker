import backend.services.Authenication_services as auth_service
from flask import Blueprint, request, jsonify, session
from backend.models.User_model import User


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    # Registration validates credentials, creates the user, and starts a session.
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()  # Remove leading/trailing whitespace from email
    password = data.get('password', '').strip()  # Remove leading/trailing whitespace from password
    confirm_password = data.get('confirm_password', '').strip()  # Remove leading/trailing whitespace from confirm_password

    try:
        user = auth_service.register_user(name, email, password, confirm_password)
        session["user_id"] = user.id
        session["user_email"] = user.email
        return jsonify({'message': 'User registered successfully', 
                        'user': {'id': user.id, 'email': user.email}
                        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    # Login stores the authenticated user's ID for later protected requests.
    data = request.get_json() or {}
    email = data.get('email', '').strip()  # Remove leading/trailing whitespace from email
    password = data.get('password', '').strip()  # Remove leading/trailing whitespace from password

    try:
        user = auth_service.authenticate_user(email, password)
        session["user_id"] = user.id
        session["user_email"] = user.email
        return jsonify({'message': 'User logged in successfully', 'user': {'id': user.id, 'email': user.email}}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 401


@auth_bp.route('/api/me', methods=['GET'])
def current_user():
    # Return the current session user's public account fields.
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user = User.query.get(user_id)

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200


@auth_bp.route('/api/account', methods=['GET'])
def account():
    # Simple protected account endpoint used to verify session authentication.
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    user = User.query.get(user_id)

    return jsonify({
        "message": "This is your account",
        "email": user.email
    })

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    # Clearing the session invalidates the current browser login.
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200