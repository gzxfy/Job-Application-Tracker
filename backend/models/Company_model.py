from datetime import datetime
from backend.extensions import db

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    website = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(120), nullable=False)


    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f'<Company {self.name} - {self.website} - {self.location}>'