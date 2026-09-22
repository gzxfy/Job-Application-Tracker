from datetime import datetime
from backend.extensions import db

class ApplicationNotes(db.Model):
    # Notes are separate rows so each note can be read, edited, or deleted by ID.
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('application.id'), nullable=False)

    # Text keeps notes flexible without forcing a structured JSON format.
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ApplicationNotes {self.content}>'