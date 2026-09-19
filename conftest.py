import os
import tempfile
import pytest

from app import create_app, db

@pytest.fixture
def app_context():
    db_fd, db_path = tempfile.mkstemp(prefix="job_tracker_test_", suffix=".db")
    os.close(db_fd)

    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

    os.remove(db_path)