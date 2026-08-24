from models.Application_model import Application
from extensions import db

def get_application_by_id(application_id):
    return Application.query.get(application_id)

def get_all_applications():
    return Application.query.all()

def create_application(company, position, status='Applied', notes=None):
    application = Application(
        company=company,
        position=position,
        status=status,
        notes=notes
    )
    db.session.add(application)
    db.session.commit()
    return application

def update_application(application_id, company=None, position=None, status=None, notes=None):
    application = get_application_by_id(application_id)
    if not application:
        return None
    if company is not None:
        application.company = company
    if position is not None:
        application.position = position
    if status is not None:
        application.status = status
    if notes is not None:
        application.notes = notes
    db.session.commit()
    return application

def delete_application(application_id):
    application = get_application_by_id(application_id)
    if not application:
        return False
    db.session.delete(application)
    db.session.commit()
    return True

def get_applications_by_status(status):
    return Application.query.filter_by(status=status).all()

def get_applications_by_company(company):
    return Application.query.filter_by(company=company).all()

def get_applications_by_position(position):
    return Application.query.filter_by(position=position).all()

def get_applications_by_applied_date(applied_date):
    return Application.query.filter_by(applied_date=applied_date).all()