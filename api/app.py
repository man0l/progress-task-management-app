from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from database import init_db, db_session
from models import User
from dotenv import load_dotenv

load_dotenv()

init_db()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

# register blueprints
from api.auth import auth_bp
from api.users import user_bp
from api.tasks import tasks_bp
app.register_blueprint(auth_bp, url_prefix='/')
app.register_blueprint(user_bp, url_prefix='/')
app.register_blueprint(tasks_bp, url_prefix='/')

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



@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
