from datetime import datetime

from backend.repositories import application_repository as applications
from backend.services import Company_services as company_services

def get_application_by_id(application_id, user_id=None):
    return applications.get_by_id(application_id, user_id)


def get_all_applications(user_id):
    return applications.list_for_user(user_id)

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

    application = applications.create(
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

    applications.save(application)
    return application

def delete_application(application_id, user_id):
    # Look up through the owner-aware helper before deleting anything.
    application = get_application_by_id(application_id, user_id)
    if not application:
        return False
    applications.delete(application)
    return True

def get_applications_by_status(status, user_id):
    return applications.list_for_user(user_id, status=status)

def get_applications_by_company(company_id, user_id):
    return applications.list_for_user(user_id, company_id=company_id)

def get_applications_by_position(position, user_id):
    return applications.list_for_user(user_id, position=position)

def get_applications_by_applied_date(applied_date, user_id):
    return applications.list_for_user(user_id, date_applied=applied_date)

# Additional functions for filtering by salary, deadline, job_link, and contact_name will be implemented in the future as needed.

class CompanyNotFoundError(LookupError):
    pass


def create_application_for_user(user_id, data):
    """Validate the application and resolve its company outside the HTTP layer."""
    position = data.get("position", "").strip()
    company_name = data.get("company_name", "").strip()
    if not position:
        raise ValueError("position is required")
    if company_name:
        company = company_services.create_company_with_only_name(user_id, company_name)
    else:
        company = company_services.get_company_by_id(data.get("company_id"), user_id)
    if not company:
        raise CompanyNotFoundError("Company not found")

    return create_application(
        user_id=user_id,
        company_id=company.id,
        position=position,
        job_url=data.get("job_url"),
        job_description=data.get("job_description"),
        salary=data.get("salary"),
        location=data.get("location"),
        work_type=data.get("work_type"),
        status=data.get("status", "Applied"),
        date_applied=data.get("date_applied"),
    )
