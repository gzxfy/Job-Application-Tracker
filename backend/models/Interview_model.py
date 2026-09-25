from datetime import datetime
from backend.extensions import db

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('application.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    
    interview_date = db.Column(db.DateTime, nullable=True)
    interview_type = db.Column(db.String(50), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Interview {self.interview_type} on {self.interview_date}>'