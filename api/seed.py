from database import db_session
from models import User, Role
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

def seed_roles():
    try:
        admin_role = db_session.query(Role).filter_by(name='admin').first()
        user_role = db_session.query(Role).filter_by(name='user').first()

        if admin_role and user_role:
            print("Roles already exist, skipping...")
            return

        if not admin_role:
            admin_role = Role(name='admin')
            db_session.add(admin_role)
            print("Admin role created successfully!")

        if not user_role:
            user_role = Role(name='user')
            db_session.add(user_role)
            print("User role created successfully!")

        db_session.commit()
    except Exception as e:
        db_session.rollback()
        print(f"Error creating roles: {str(e)}")
        raise

def seed_users():
    try:
        admin_role = db_session.query(Role).filter_by(name='admin').first()
        if not admin_role:
            print("Admin role not found. Please run seed_roles first.")
            return

        existing_user = db_session.query(User).filter_by(email=os.getenv('ADMIN_EMAIL')).first()
        if existing_user:
            print("Admin user already exists, skipping...")
            return

        hashed_password = generate_password_hash(os.getenv('ADMIN_PASSWORD'))
        user = User(email=os.getenv('ADMIN_EMAIL'), password=hashed_password)
        user.roles.append(admin_role)
        db_session.add(user)
        db_session.commit()
        print("Admin user created successfully!")
    except Exception as e:
        db_session.rollback()
        print(f"Error creating admin user: {str(e)}")
        raise

if __name__ == "__main__":
    seed_roles()
    seed_users()
