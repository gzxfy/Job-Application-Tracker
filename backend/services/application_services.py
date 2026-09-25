from backend.models.Application_model import Application
from backend.extensions import db
from datetime import datetime

def get_application_by_id(application_id, user_id=None):
    # Add the user filter when called from a protected route to enforce ownership.
    query = Application.query.filter_by(id=application_id)
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
    return query.first()

def get_all_applications(user_id):
    return Application.query.filter_by(user_id=user_id).all()

def create_application(
    user_id,
    company_id,
    position,
    job_url=None,
    job_description=None,
    salary=None,
    location=None,
    work_type=None,
    status="Applied",
    date_applied=None,
):
    # Convert the API's YYYY-MM-DD string into the database datetime type.
    if date_applied:
        date_applied = datetime.strptime(date_applied, "%Y-%m-%d")

    application = Application(
        user_id=user_id,
        company_id=company_id,
        position=position,
        status=status,
        job_url=job_url,
        job_description=job_description,
        salary=salary,
        location=location,
        work_type=work_type,
        date_applied=date_applied
    )

    # Persist once all fields have been assembled so callers receive a saved row.
    db.session.add(application)
    db.session.commit()
    return application

def update_application(
    application_id,
    user_id,
    company_id=None,
    position=None,
    job_url=None,
    job_description=None,
    salary=None,
    location=None,
    work_type=None,
    status=None,
):
    # Only supplied fields are changed, allowing partial PUT payloads.
    application = get_application_by_id(application_id, user_id)
    if not application:
        return None
    if company_id is not None:
        application.company_id = company_id
    if position is not None:
        application.position = position
    if job_url is not None:
        application.job_url = job_url
    if job_description is not None:
        application.job_description = job_description
    if salary is not None:
        application.salary = salary
    if location is not None:
        application.location = location
    if work_type is not None:
        application.work_type = work_type
    if status is not None:
        application.status = status

    db.session.commit()
    return application

def delete_application(application_id, user_id):
    # Look up through the owner-aware helper before deleting anything.
    application = get_application_by_id(application_id, user_id)
    if not application:
        return False
    db.session.delete(application)
    db.session.commit()
    return True

def get_applications_by_status(status, user_id):
    return Application.query.filter_by(status=status, user_id=user_id).all()

def get_applications_by_company(company_id, user_id):
    return Application.query.filter_by(company_id=company_id, user_id=user_id).all()

def get_applications_by_position(position, user_id):
    return Application.query.filter_by(position=position, user_id=user_id).all()

def get_applications_by_applied_date(applied_date, user_id):
    return Application.query.filter_by(date_applied=applied_date, user_id=user_id).all()

# Additional functions for filtering by salary, deadline, job_link, and contact_name will be implemented in the future as needed.