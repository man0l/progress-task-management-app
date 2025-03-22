"""Add missing columns to tasks table

Revision ID: add_missing_columns_to_tasks
Revises: eb7e8421477e
Create Date: 2024-03-22 15:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'add_missing_columns_to_tasks'
down_revision: Union[str, None] = 'eb7e8421477e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add missing columns to tasks table."""
    op.add_column('tasks',
        sa.Column('title', mysql.VARCHAR(255), nullable=False)
    )
    op.add_column('tasks',
        sa.Column('description', mysql.VARCHAR(255), nullable=False)
    )
    op.add_column('tasks',
        sa.Column('completed', mysql.BOOLEAN(), nullable=False, default=False)
    )


def downgrade() -> None:
    """Remove added columns from tasks table."""
    op.drop_column('tasks', 'completed')
    op.drop_column('tasks', 'description')
    op.drop_column('tasks', 'title') 