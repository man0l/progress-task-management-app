"""
Tests for the tasks API endpoints.
"""
import json
import pytest
from flask_jwt_extended import create_access_token
from models import User, Task, Role
from database import db_session

def get_auth_header(client, user):
    """Helper function"""
    with client.application.app_context():
        token = create_access_token(identity=user)
        return {'Authorization': f'Bearer {token}'}

def create_test_user_with_role(email, password, role_name):
    """Helper function"""
    from werkzeug.security import generate_password_hash
    
    role = db_session.query(Role).filter_by(name=role_name).first()
    if not role:
        role = Role(name=role_name)
        db_session.add(role)
        db_session.commit()
    
    user = User(
        email=email,
        password=generate_password_hash(password)
    )
    user.roles.append(role)
    db_session.add(user)
    db_session.commit()
    
    db_session.refresh(user)
    
    return user

def test_task_api_basics(client, app):
    """Test basic task operations including auth, CRUD and filtering."""
    with app.app_context():
        response = client.get('/tasks')
        assert response.status_code == 401
        
        user = create_test_user_with_role("test_user@example.com", "password", "user")
        user_id = user.id
        headers = get_auth_header(client, user)
        
        task_data = {
            'title': 'Test Task',
            'description': 'Task description',
            'completed': False
        }
        
        response = client.post(
            '/tasks',
            data=json.dumps(task_data),
            content_type='application/json',
            headers=headers
        )
        
        assert response.status_code == 200
        json_data = json.loads(response.data)
        task_id = json_data['id']
        
        response = client.get(f'/tasks/{task_id}', headers=headers)
        assert response.status_code == 200
        
        update_data = {
            'title': 'Updated Task',
            'description': 'Updated description',
            'completed': True
        }
        
        response = client.put(
            f'/tasks/{task_id}',
            data=json.dumps(update_data),
            content_type='application/json',
            headers=headers
        )
        
        assert response.status_code == 200
        
        response = client.get('/tasks?status=true', headers=headers)
        assert response.status_code == 200
        
        response = client.delete(f'/tasks/{task_id}', headers=headers)
        assert response.status_code == 200
        
        response = client.get(f'/tasks/{task_id}', headers=headers)
        assert response.status_code == 404