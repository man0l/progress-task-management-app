from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from decorators import role_required
from database import db_session
from models import Task, User

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route("/tasks", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def tasks():    
    data = request.args

    if not data:
        user_tasks = db_session.query(Task).all()
    else:
        query = db_session.query(Task)
        if 'status' in data:
            query = query.filter_by(completed=data['status'] == 'true')
        if 'user' in data:
            query = query.filter_by(user_id=data['user'])
        user_tasks = query.all()

    return jsonify(tasks=[{
        'id': task.id,
        'user_id': task.user_id if task.user_id else None,
        'user': task.user.email if task.user else None,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    } for task in user_tasks])

@tasks_bp.route("/tasks", methods=["POST"])
@jwt_required()
@role_required(["admin", "user"])
def create_task():
    current_user = get_jwt_identity()
    data = request.json

    if not data or 'title' not in data or 'description' not in data:
        return jsonify({"msg": "Title and description are required"}), 400

    task = Task(
        user_id=data['user_id'] if 'user_id' in data else None,
        title=data['title'],
        description=data['description'],
        completed=data.get('completed', False)
    )
    
    db_session.add(task)
    db_session.commit()

    return jsonify({
        'id': task.id,
        'user_id': task.user_id if task.user_id else None,
        'user': task.user.email if task.user else None,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    }), 200

@tasks_bp.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def get_task(task_id):    
    task = db_session.query(Task).filter_by(id=task_id).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    return jsonify({
        'id': task.id,
        'user_id': task.user_id if task.user_id else None,
        'user': task.user.email if task.user else None,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
@role_required(["admin", "user"])
def update_task(task_id):
    current_user = get_jwt_identity()
    task = db_session.query(Task).filter_by(id=task_id).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    data = request.json
    if not data:
        return jsonify({"msg": "No update data provided"}), 400

    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'completed' in data:
        task.completed = data['completed']
    if 'user_id' in data:
        task.user_id = data['user_id']
        task.user = db_session.query(User).filter_by(id=data['user_id']).first()

    db_session.commit()

    return jsonify({
        'id': task.id,
        'user_id': task.user_id if task.user_id else None,
        'user': task.user.email if task.user else None,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
@role_required(["admin", "user"])
def delete_task(task_id):    
    task = db_session.query(Task).filter_by(id=task_id).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    db_session.delete(task)
    db_session.commit()

    return '', 200

@tasks_bp.route("/tasks/<int:task_id>/assign", methods=["POST"])
@jwt_required()
@role_required(["admin", "user"])
def assign_task(task_id):    
    task = db_session.query(Task).filter_by(id=task_id).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    data = request.json
    if not data or 'user_id' not in data:
        return jsonify({"msg": "User ID is required"}), 400

    user = db_session.query(User).filter_by(id=data['user_id']).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    task.user_id = user.id
    task.user = user
    db_session.commit()

    return jsonify({
        'id': task.id,
        'user_id': task.user_id,
        'user': task.user.email,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })