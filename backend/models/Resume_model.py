from datetime import datetime
from backend.extensions import db

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.Foreign_key("user.id"), nullable=False)
    application = db.Column(db.Integer, db.Foreign_key("application.id"), unique=True, nullable=False)

    template_name = db.Column(db.String(50), nullable=False, default="default")
    title = db.Column(db.String(50), nullable=False)

    resume_data = db.Column(db.JSON)

    pdf_path = db.Column(db.String(255))

    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

# going to allow the user to either create resume or import. Setting up the model for this