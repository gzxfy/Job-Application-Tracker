from backend.models.Application_model import Application
from backend.repositories.persistence import save, delete


def get_by_id(application_id, user_id=None):
    query = Application.query.filter_by(id=application_id)
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
    return query.first()


def list_for_user(user_id, **filters):
    return Application.query.filter_by(user_id=user_id, **filters).all()


def create(**fields):
    return save(Application(**fields))
