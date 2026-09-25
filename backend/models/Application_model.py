from datetime import datetime
from backend.extensions import db
from backend.models.Company_model import Company

class Application(db.Model):
    # An application belongs to one user and one company.
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    
    position = db.Column(db.String(120), nullable=False)
    job_url = db.Column(db.String(255), nullable=True)
    job_description = db.Column(db.Text, nullable=True)
    salary = db.Column(db.Integer, nullable=True)
    location = db.Column(db.String(150), nullable=True)
    work_type = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), nullable=False)

    # This relationship lets response serializers access application.company.
    company = db.relationship("Company", back_populates="applications")

    date_applied = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Application {self.position} - {self.status}>'