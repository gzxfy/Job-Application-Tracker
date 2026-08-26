from datetime import datetime
from backend.extensions import db

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.Float, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='Applied')
    notes = db.Column(db.Text, nullable=True)
    job_link = db.Column(db.String(200), nullable=True)
    days_until_deadline = db.Column(db.Integer, nullable=True)
    contact_name = db.Column(db.String(100), nullable=True)
    contact_email = db.Column(db.String(100), nullable=True)

    applied_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f"<Application {self.company} - {self.position}>"