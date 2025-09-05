"""Change ref_id type in activities from Integer to String

Revision ID: b1f3d2c9aa01
Revises: 523aaea02776
Create Date: 2025-08-28 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b1f3d2c9aa01'
down_revision = '523aaea02776'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Alter column type to String(255)
    with op.batch_alter_table('activities') as batch_op:
        batch_op.alter_column(
            'ref_id',
            existing_type=sa.Integer(),
            type_=sa.String(length=255),
            existing_nullable=True
        )


def downgrade() -> None:
    # Convert back to Integer where possible; this may fail if non-numeric data exists
    with op.batch_alter_table('activities') as batch_op:
        batch_op.alter_column(
            'ref_id',
            existing_type=sa.String(length=255),
            type_=sa.Integer(),
            existing_nullable=True
        )


