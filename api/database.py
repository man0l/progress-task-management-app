from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import time
import logging
import mysql.connector

load_dotenv()

def create_database_if_not_exists():
    try:
        # Connect without database specified
        conn = mysql.connector.connect(
            host='db',
            user='root'
        )
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS tasksapp")
        
        cursor.close()
        conn.close()
    except Exception as e:
        logging.error(f"Failed to create database: {str(e)}")
        raise

engine = create_engine(os.getenv('DATABASE_URL'))
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    import models
    Base.metadata.create_all(bind=engine)
