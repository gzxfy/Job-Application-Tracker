from datetime import datetime

from backend.repositories import application_repository as applications
from backend.repositories import interview_repository as interviews


def get_owned_application(application_id, user_id):
    return applications.get_by_id(application_id, user_id)


def parse_interview_date(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError) as error:
        raise ValueError(
            "interview_date must be a valid ISO date or datetime"
        ) from error


def get_interview_by_id(application_id, interview_id, user_id):
    application = get_owned_application(application_id, user_id)
    if not application:
        return None

    return interviews.get_by_id(application_id, interview_id)


def get_all_interviews(application_id, user_id):
    application = get_owned_application(application_id, user_id)
    if not application:
        return None

    return interviews.list_for_application(application_id)


def create_interview(
    application_id,
    user_id,
    interview_date,
    interview_type,
    notes=None,
    status="Scheduled",
):
    application = get_owned_application(application_id, user_id)
    if not application:
        return None
    if not interview_date:
        raise ValueError("Must provide an interview date")
    if not interview_type or not interview_type.strip():
        raise ValueError("Must provide an interview type")
    if not status or not status.strip():
        raise ValueError("Must provide an interview status")

    interview = interviews.create(
        application_id=application.id,
        company_id=application.company_id,
        interview_date=parse_interview_date(interview_date),
        interview_type=interview_type.strip(),
        notes=notes.strip() if isinstance(notes, str) else notes,
        status=status.strip(),
    )
    return interview


def update_interview(
    application_id,
    interview_id,
    user_id,
    interview_date=None,
    interview_type=None,
    notes=None,
    status=None,
):
    interview = get_interview_by_id(application_id, interview_id, user_id)
    if not interview:
        return None

    if interview_date is not None:
        interview.interview_date = parse_interview_date(interview_date)
    if interview_type is not None:
        if not interview_type.strip():
            raise ValueError("Interview type cannot be empty")
        interview.interview_type = interview_type.strip()
    if notes is not None:
        interview.notes = notes.strip() if isinstance(notes, str) else notes
    if status is not None:
        if not status.strip():
            raise ValueError("Interview status cannot be empty")
        interview.status = status.strip()

    interviews.save(interview)
    return interview


def delete_interview(application_id, interview_id, user_id):
    interview = get_interview_by_id(application_id, interview_id, user_id)
    if not interview:
        return False

    interviews.delete(interview)
    return True
