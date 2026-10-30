from backend.extensions import db
from backend.models.User_model import User
from backend.repositories.persistence import save


def get_by_id(user_id):
    return db.session.get(User, user_id)


def get_by_email(email):
    return User.query.filter_by(email=email).first()


def create(**fields):
    return save(User(**fields))
