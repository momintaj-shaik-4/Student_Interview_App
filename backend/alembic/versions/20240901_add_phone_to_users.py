"""Add phone column to users table

Revision ID: d4a5c6b7e810
Revises: c2e4a1b8f930
Create Date: 2025-08-28 00:40:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4a5c6b7e810'
down_revision = 'c2e4a1b8f930'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('phone', sa.String(length=20), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('phone')


