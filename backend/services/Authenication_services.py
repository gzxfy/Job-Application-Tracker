from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.User_model import User
from backend.extensions import db
from backend.utils.validation_helpers import validate_email, validate_password

def register_user(name, email, password, confirm_password):
    # Validation stays in the service so every caller gets the same rules.
    validate_email(email)
    validate_password(password)
    confirm_password = confirm_password.strip()  # Remove leading/trailing whitespace from confirm_password
    if password != confirm_password:
        raise ValueError("Passwords do not match")

    if User.query.filter_by(email=email).first():
        raise ValueError("Email already exists")

    if not name:
        raise ValueError("Must put a name")
    
    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return new_user

def authenticate_user(email, password):
    # Return the user only after checking both account existence and password hash.
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise ValueError("Invalid email or password")
    return user