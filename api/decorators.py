from functools import wraps
from flask_jwt_extended import get_jwt
from flask import jsonify

def role_required(roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            for role in roles:
                if role in claims.get("roles", []):
                    return f(*args, **kwargs)
            return jsonify({"msg": "Unauthorized"}), 403
        return wrapper
    return decorator

