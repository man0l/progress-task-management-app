"""
Pytest configuration for API tests.
"""

import pytest
import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import app as flask_app
from database import Base, db_session as app_db_session
from models import User, Role, Task
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    db_fd, db_path = tempfile.mkstemp()
    db_uri = f"sqlite:///{db_path}"
    
    db_uri = "sqlite:///:memory:"
    
    os.environ['DATABASE_URL'] = db_uri

    engine = create_engine(
        db_uri, 
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    Base.metadata.create_all(bind=engine)
    
    app_db_session.remove()
    app_db_session.configure(bind=engine, autoflush=False, autocommit=False)
    
    flask_app.config.update({
        'TESTING': True,
        'JWT_SECRET_KEY': 'test_secret_key',
        'SQLALCHEMY_DATABASE_URI': db_uri,
    })
    
    with flask_app.app_context():
        yield flask_app
    
    os.close(db_fd)
    os.unlink(db_path)
    
    app_db_session.remove()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def init_database(app):
    for table in reversed(Base.metadata.sorted_tables):
        app_db_session.execute(table.delete())
    
    admin_role = Role(name="admin")
    user_role = Role(name="user")
    
    app_db_session.add_all([admin_role, user_role])
    app_db_session.commit()
    
    admin_user = User(
        email="admin@example.com", 
        password=generate_password_hash("adminpass")
    )
    admin_user.roles.append(admin_role)
    
    regular_user = User(
        email="user@example.com", 
        password=generate_password_hash("userpass")
    )
    regular_user.roles.append(user_role)
    
    app_db_session.add_all([admin_user, regular_user])
    app_db_session.commit()
    
    task1 = Task(
        title="Test Task 1",
        description="This is test task 1",
        completed=False,
        user=regular_user
    )
    
    task2 = Task(
        title="Test Task 2",
        description="This is test task 2",
        completed=True,
        user=regular_user
    )
    
    app_db_session.add_all([task1, task2])
    app_db_session.commit()
    
    yield app_db_session
        
    app_db_session.remove() 