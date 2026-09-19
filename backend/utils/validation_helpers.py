from functools import wraps
from zxcvbn import zxcvbn
import re

def validate_email(email):
    email = email.strip()  # Remove leading and trailing whitespace
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise ValueError("Invalid email format")

    return True

def validate_password(password):
    password = password.strip()  # Remove leading and trailing whitespace

    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")

    password_strength = zxcvbn(password)
    if password_strength['score'] < 3:
        raise ValueError("Password is too weak")

    if not re.search(r'[A-Z]', password):
        raise ValueError("Password must contain at least one uppercase letter")

    if not re.search(r'[a-z]', password):
        raise ValueError("Password must contain at least one lowercase letter")

    if not re.search(r'[0-9]', password):
        raise ValueError("Password must contain at least one digit")

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValueError("Password must contain at least one special character")

    return True

