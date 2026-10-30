from backend.repositories import application_repository as applications
from backend.repositories import note_repository as notes

def create_application_notes(application_id, user_id, content=""):
    # Notes must be non-empty and must belong to an application owned by the user.
    if not content.strip():
        raise ValueError("Note cannot be empty")

    # Grabbing the application
    application = applications.get_by_id(application_id, user_id)

    if not application:
        raise ValueError("Application not found")

    # Applying notes to the database
    note = notes.create(
        application_id=application_id,
        content=content.strip()
    )

    return note

def get_application_notes(application_id, user_id):
    # Validate application ownership before exposing any related notes.
    application = applications.get_by_id(application_id, user_id)

    if not application:
        return None

    return notes.list_for_application(application_id)

def delete_application_notes(application_id, user_id, application_note_id):
    # Scope the note lookup to the application so IDs cannot cross application boundaries.
    application = applications.get_by_id(application_id, user_id)

    if not application:
        return None
    
    application_note = notes.get_by_id(application_id, application_note_id)

    if not application_note:
        return False

    notes.delete(application_note)

    return True

def update_application_note_content(application_id, user_id, application_note_id, content=""):
    # Validate content and ownership before changing the existing note row.
    if not content.strip():
        raise ValueError("Note cannot be empty")
    
    application = applications.get_by_id(application_id, user_id)
    
    if not application:
        return None

    application_note = notes.get_by_id(application_id, application_note_id)

    if not application_note:
        return False

    
    application_note.content = content.strip()

    notes.save(application_note)

    return application_note
