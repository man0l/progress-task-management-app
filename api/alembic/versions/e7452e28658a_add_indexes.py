"""add_indexes

Revision ID: e7452e28658a
Revises: add_missing_columns_to_tasks
Create Date: 2025-03-23 16:37:04.197713

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e7452e28658a'
down_revision: Union[str, None] = 'add_missing_columns_to_tasks'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index('idx_users_email_password', 'users', ['email', 'password'])
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])    
    op.create_index('idx_tasks_completed_user_id', 'tasks', ['completed', 'user_id'])


def downgrade() -> None:
    """Downgrade schema."""    
    op.drop_index('idx_users_email_password', table_name='users')
    op.drop_index('idx_tasks_user_id', table_name='tasks')
    op.drop_index('idx_tasks_completed_user_id', table_name='tasks')
