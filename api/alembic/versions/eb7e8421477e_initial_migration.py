"""Initial migration

Revision ID: eb7e8421477e
Revises: 
Create Date: 2025-03-20 20:55:09.660821

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'eb7e8421477e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create users table with email and password
    op.create_table('users',
        sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('email', mysql.VARCHAR(255), nullable=False, unique=True),
        sa.Column('password', mysql.VARCHAR(255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        mysql_collate='utf8mb4_0900_ai_ci',
        mysql_default_charset='utf8mb4',
        mysql_engine='InnoDB'
    )
    
    # Create tasks table
    op.create_table('tasks',
        sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', mysql.INTEGER(), nullable=False),
        sa.Column('created_at', mysql.DATETIME(), server_default=sa.text('(now())'), nullable=False),
        sa.Column('updated_at', mysql.DATETIME(), server_default=sa.text('(now())'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='tasks_ibfk_1'),
        sa.PrimaryKeyConstraint('id'),
        mysql_collate='utf8mb4_0900_ai_ci',
        mysql_default_charset='utf8mb4',
        mysql_engine='InnoDB'
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('tasks')
    op.drop_table('users')
