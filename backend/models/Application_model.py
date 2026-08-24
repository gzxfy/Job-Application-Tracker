from datetime import datetime
from extensions import db

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Applied')
    notes = db.Column(db.Text, nullable=True)

    applied_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f"<Application {self.company} - {self.position}>"