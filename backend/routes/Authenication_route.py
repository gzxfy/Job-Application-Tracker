import backend.services.Authenication_services as auth_service
from flask import Blueprint, request, jsonify


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()  # Remove leading/trailing whitespace from email
    password = data.get('password', '').strip()  # Remove leading/trailing whitespace from password
    confirm_password = data.get('confirm_password', '').strip()  # Remove leading/trailing whitespace from confirm_password

    try:
        user = auth_service.register_user(email, password, confirm_password)
        return jsonify({'message': 'User registered successfully', 'user': {'id': user.id, 'email': user.email}}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()  # Remove leading/trailing whitespace from email
    password = data.get('password', '').strip()  # Remove leading/trailing whitespace from password

    try:
        user = auth_service.authenticate_user(email, password)
        return jsonify({'message': 'User logged in successfully', 'user': {'id': user.id, 'email': user.email}}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 401