from __future__ import annotations
from typing import List
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, Boolean, Index
from sqlalchemy.orm import Mapped, relationship, mapped_column 
from sqlalchemy.sql import func

from database import Base

user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    tasks: Mapped[List['Task']] = relationship(back_populates='user')
    roles: Mapped[List['Role']] = relationship(secondary=user_roles, back_populates='users')

Index('idx_users_email_password', User.email, User.password)

class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=True)
    user: Mapped['User'] = relationship(back_populates='tasks')
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

Index('idx_tasks_user_id', Task.user_id)
Index('idx_tasks_completed_user_id', Task.completed, Task.user_id)

class Role(Base):
    __tablename__ = 'roles'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    users: Mapped[List['User']] = relationship(secondary=user_roles, back_populates='roles')
