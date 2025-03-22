from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import os
from werkzeug.security import generate_password_hash, check_password_hash

from database import init_db, db_session
from models import User, Task
from decorators import role_required
from dotenv import load_dotenv
load_dotenv()

init_db()
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

@jwt.user_identity_loader
def user_identity_lookup(user):
    return str(user.id)

@jwt.additional_claims_loader
def add_claims_to_access_token(user):
    return {
        "roles": [role.name for role in user.roles]
    }

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    return db_session.query(User).filter_by(id=int(jwt_data["sub"])).first()

@app.route('/')
def hello():
    return 'hello'

@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    if db_session.query(User).filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db_session.add(new_user)
    db_session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = db_session.query(User).filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)

@app.route("/tasks", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def tasks():
    current_user = get_jwt_identity()
    user_tasks = db_session.query(Task).filter_by(user_id=current_user).all()
    return jsonify(tasks=[{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    } for task in user_tasks])

@app.route("/tasks", methods=["POST"])
@jwt_required()
@role_required(["admin", "user"])
def create_task():
    current_user = get_jwt_identity()
    data = request.json

    if not data or 'title' not in data or 'description' not in data:
        return jsonify({"msg": "Title and description are required"}), 400

    task = Task(
        user_id=current_user,
        title=data['title'],
        description=data['description'],
        completed=data.get('completed', False)
    )
    
    db_session.add(task)
    db_session.commit()

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    }), 200

@app.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def get_task(task_id):
    current_user = get_jwt_identity()
    task = db_session.query(Task).filter_by(id=task_id, user_id=current_user).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@app.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
@role_required(["admin", "user"])
def update_task(task_id):
    current_user = get_jwt_identity()
    task = db_session.query(Task).filter_by(id=task_id, user_id=current_user).first()
    
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

    db_session.commit()

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
@role_required(["admin", "user"])
def delete_task(task_id):
    current_user = get_jwt_identity()
    task = db_session.query(Task).filter_by(id=task_id, user_id=current_user).first()
    
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    db_session.delete(task)
    db_session.commit()

    return '', 200

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
