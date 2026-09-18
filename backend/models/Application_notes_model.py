from datetime import datetime
from backend.extensions import db

class ApplicationNotes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('application.id'), nullable=False)

    # The content of the note, which can be a long text will probably be changed to a json field in the future to allow for more structured data, but for now, we will keep it as a text field.
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ApplicationNotes {self.content}>'