from database import db_session
from models import User
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

def seed_users():
    try:
        existing_user = db_session.query(User).filter_by(email=os.getenv('ADMIN_EMAIL')).first()
        if existing_user:
            print("Admin user already exists, skipping...")
            return

        hashed_password = generate_password_hash(os.getenv('ADMIN_PASSWORD'))
        user = User(email=os.getenv('ADMIN_EMAIL'), password=hashed_password)
        db_session.add(user)
        db_session.commit()
        print("Admin user created successfully!")
    except Exception as e:
        db_session.rollback()
        print(f"Error creating admin user: {str(e)}")
        raise

if __name__ == "__main__":
    seed_users()
