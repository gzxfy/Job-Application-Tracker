import os
from flask import Flask
from backend.extensions import db
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    from backend.routes.application_route import application_bp
    app.register_blueprint(application_bp)

    with app.app_context():
        from backend.models.Application_model import Application  # noqa: F401 registers model before create_all
        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)