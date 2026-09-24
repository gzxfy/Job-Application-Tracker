from backend.models.Application_notes_model import ApplicationNotes
from backend.models.Application_model import Application
from backend.extensions import db
from datetime import datetime

def create_application_notes(application_id, user_id, content=""):
    # Notes must be non-empty and must belong to an application owned by the user.
    if not content.strip():
        raise ValueError("Note cannot be empty")

    # Grabbing the application
    application = Application.query.filter_by(
        id=application_id,
        user_id=user_id
    ).first()

    if not application:
        raise ValueError("Application not found")

    # Applying notes to the database
    note = ApplicationNotes(
        application_id=application_id,
        content=content.strip()
    )

    db.session.add(note)
    db.session.commit()

    return note

def get_application_notes(application_id, user_id):
    # Validate application ownership before exposing any related notes.
    application = Application.query.filter_by(
        id=application_id,
        user_id=user_id
    ).first()

    if not application:
        return None

    return ApplicationNotes.query.filter_by(
        application_id=application_id
    ).all()

def delete_application_notes(application_id, user_id, application_note_id):
    # Scope the note lookup to the application so IDs cannot cross application boundaries.
    application = Application.query.filter_by(
        id=application_id,
        user_id=user_id
    ).first()

    if not application:
        return None
    
    application_note = ApplicationNotes.query.filter_by(
        id=application_note_id,
        application_id=application_id).first()

    if not application_note:
        return False

    db.session.delete(application_note)
    db.session.commit();

    return True

def update_application_note_content(application_id, user_id, application_note_id, content=""):
    # Validate content and ownership before changing the existing note row.
    if not content.strip():
            raise ValueError("Note cannot be empty")
    
    application = Application.query.filter_by(
            id=application_id,
            user_id=user_id
        ).first()
    
    if not application:
        return None

    application_note = ApplicationNotes.query.filter_by(
        id=application_note_id,
        application_id=application_id,
    ).first()

    if not application_note:
        return False

    
    application_note.content = content.strip()

    db.session.commit()

    return application_note