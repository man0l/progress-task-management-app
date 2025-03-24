from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from decorators import role_required
from werkzeug.security import generate_password_hash, check_password_hash
from database import db_session
from models import User

user_bp = Blueprint('users', __name__)

@user_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def get_users():
    return jsonify(users=[{
        'id': user.id,
        'email': user.email
    } for user in db_session.query(User).all()])

@user_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
@role_required(["admin", "user"])
def get_user(user_id):
    user = db_session.query(User).filter_by(id=user_id).first()
    return jsonify({
        'id': user.id,
        'email': user.email
    })

@user_bp.route("/users", methods=["POST"])
@jwt_required()
@role_required(["admin", "user"])
def create_user():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"msg": "Email is required"}), 400

    if not data or 'password' not in data:
        return jsonify({"msg": "Password is required"}), 400

    user = User(email=data['email'], password=data['password'])
    db_session.add(user)
    db_session.commit()

    return jsonify({
        'id': user.id,
        'email': user.email
    })

@user_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
@role_required(["admin", "user"])
def update_user(user_id):
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"msg": "Email is required"}), 400

    user = db_session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.email = data['email']
    db_session.commit()

    return jsonify({
        'id': user.id,
        'email': user.email
    })

@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required(["admin"])
def delete_user(user_id):
    user = db_session.query(User).filter_by(id=user_id).first()
    db_session.delete(user)
    db_session.commit()

    return '', 200