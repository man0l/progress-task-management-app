"""
Tests for the authentication endpoints.
"""
import json
import pytest
from werkzeug.security import check_password_hash
from models import User
from database import db_session

def test_register_endpoint_success(client):
    response = client.post(
        '/register',
        data=json.dumps({
            'email': 'newuser@example.com',
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 201
    json_data = json.loads(response.data)
    assert json_data['msg'] == 'User created successfully'

def test_register_endpoint_missing_data(client):
    response = client.post(
        '/register',
        data=json.dumps({
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert json_data['msg'] == 'Email and password are required'    

def test_login_endpoint_success(client, init_database, app):
    client.post(
        '/register',
        data=json.dumps({
            'email': 'logintest@example.com',
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    response = client.post(
        '/login',
        data=json.dumps({
            'email': 'logintest@example.com',
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    json_data = json.loads(response.data)
    assert 'access_token' in json_data
    assert 'user' in json_data
    assert json_data['user']['email'] == 'logintest@example.com'
    assert 'password' not in json_data['user']

def test_login_endpoint_missing_data(client):
    response = client.post(
        '/login',
        data=json.dumps({
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert json_data['msg'] == 'Email and password are required'
    
    response = client.post(
        '/login',
        data=json.dumps({
            'email': 'test@example.com'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert json_data['msg'] == 'Email and password are required'

def test_login_endpoint_invalid_credentials(client, init_database):
    response = client.post(
        '/login',
        data=json.dumps({
            'email': 'nonexistent@example.com',
            'password': 'password123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 401
    json_data = json.loads(response.data)
    assert json_data['msg'] == 'Bad email or password'