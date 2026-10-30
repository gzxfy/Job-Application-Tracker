"""Shared persistence operations with rollback on failed writes."""
from backend.extensions import db


def save(record):
    try:
        db.session.add(record)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    return record


def delete(record):
    try:
        db.session.delete(record)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
