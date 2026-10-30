from backend.extensions import db
from backend.models.Company_model import Company
from backend.repositories.persistence import save, delete


def accessible_query(user_id):
    query = Company.query
    if user_id is not None:
        query = query.filter(db.or_(Company.user_id == user_id, Company.user_id.is_(None)))
    return query


def get_accessible(company_id, user_id=None):
    return accessible_query(user_id).filter_by(id=company_id).first()


def list_accessible(user_id=None, search=None):
    query = accessible_query(user_id)
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    return query.order_by(Company.name).all()


def get_owned(company_id, user_id):
    return Company.query.filter_by(id=company_id, user_id=user_id).first()


def create(**fields):
    return save(Company(**fields))
