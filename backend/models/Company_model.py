from datetime import datetime
from backend.extensions import db

class Company(db.Model):
    # Companies are shared reference records applications point to by company_id.
    id = db.Column(db.Integer, primary_key=True)
    # User-created companies belong to the creating user; demo records may be global.
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    name = db.Column(db.String(150), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    headquarters = db.Column(db.String(150), nullable=True)


    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = db.relationship("Application", back_populates="company")
    def __repr__(self):
        return f'<Company {self.name} - {self.website} - {self.headquarters}>'