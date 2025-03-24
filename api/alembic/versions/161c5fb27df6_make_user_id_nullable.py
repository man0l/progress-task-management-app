"""make user_id nullable

Revision ID: 161c5fb27df6
Revises: e7452e28658a
Create Date: 2025-03-24 15:35:58.928499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '161c5fb27df6'
down_revision: Union[str, None] = 'e7452e28658a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Alter the tasks table to make user_id nullable
    op.alter_column('tasks', 'user_id',
               existing_type=sa.Integer(),
               nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    # Revert the change, making user_id not nullable again
    op.alter_column('tasks', 'user_id',
               existing_type=sa.Integer(),
               nullable=False)
