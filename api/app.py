from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import os
from werkzeug.security import generate_password_hash, check_password_hash

from database import init_db, db_session
from models import User
from dotenv import load_dotenv
load_dotenv()

init_db()
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

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

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token)

@app.route("/tasks", methods=["GET"])
@jwt_required()
def tasks():
    current_user_id = int(get_jwt_identity())
    user = db_session.query(User).get(current_user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify(tasks=[])

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
