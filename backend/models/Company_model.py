from datetime import datetime
from backend.extensions import db

class Company(db.Model):
    # Companies are shared reference records applications point to by company_id.
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    website = db.Column(db.String(255), nullable=False)
    headquarters = db.Column(db.String(120), nullable=False)
    industry = db.Column(db.String(150), nullable=False)
    logo_url = db.Column(db.String(255), nullable=False)


    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f'<Company {self.name} - {self.website} - {self.location}>'