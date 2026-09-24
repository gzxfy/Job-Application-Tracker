from flask_sqlalchemy import SQLAlchemy

# The shared SQLAlchemy instance is initialized by the Flask app factory.
db = SQLAlchemy()