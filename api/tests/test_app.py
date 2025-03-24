"""
Tests for the main Flask application.
"""
import pytest
from flask import url_for
from flask_jwt_extended import create_access_token
from models import User

def test_hello_endpoint(client):
    """Test the root endpoint returns 'hello'."""
    response = client.get('/')
    assert response.status_code == 200
    assert response.data == b'hello'

def test_blueprint_registration(app):
    """Test that blueprints are registered correctly."""
    blueprints = app.blueprints

    assert 'auth' in blueprints
    assert 'users' in blueprints
    assert 'tasks' in blueprints

def test_jwt_configuration(app):
    """Test that JWT is configured correctly."""
    assert app.config['JWT_SECRET_KEY'] is not None