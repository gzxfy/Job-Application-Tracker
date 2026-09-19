from backend.models.Application_notes_model import ApplicationNotes
from backend.models.Application_model import Application
from backend.extensions import db
from datetime import datetime

def create_application_notes(application_id, user_id, content=""):
    if not content.strip():
        raise ValueError("Note cannot be empty")

    application = Application.query.filter_by(
        id=application_id,
        user_id=user_id
    ).first()

    if not application:
        raise ValueError("Application not found")

    note = ApplicationNotes(
        application_id=application_id,
        content=content.strip()
    )

    db.session.add(note)
    db.session.commit()

    return note

def get_application_notes(application_id, user_id):
    application = Application.query.filter_by(
        id=application_id,
        user_id=user_id
    ).first()

    if not application:
        return None

    return ApplicationNotes.query.filter_by(
        application_id=application_id
    ).all()