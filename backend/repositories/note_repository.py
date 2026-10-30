from backend.models.Application_notes_model import ApplicationNotes
from backend.repositories.persistence import save, delete


def get_by_id(application_id, record_id):
    return ApplicationNotes.query.filter_by(id=record_id, application_id=application_id).first()


def list_for_application(application_id):
    return ApplicationNotes.query.filter_by(application_id=application_id).all()


def create(**fields):
    return save(ApplicationNotes(**fields))
