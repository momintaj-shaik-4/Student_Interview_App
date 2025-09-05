"""Updated User and Role models

Revision ID: 33530fcee3dd
Revises: 32fab51f9537
Create Date: 2025-08-30 11:23:35.072842

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '33530fcee3dd'
down_revision: Union[str, Sequence[str], None] = '32fab51f9537'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # Drop the id columns
    op.drop_column('roles', 'id')
    op.drop_column('users', 'id')

    # Add new UUID columns with default generation
    op.add_column('roles', sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")))
    op.add_column('users', sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")))

def downgrade() -> None:
    """Downgrade schema."""
    # Remove defaults and convert back to integers
    op.alter_column(
        'roles',
        'id',
        type_=sa.INTEGER(),
        existing_type=sa.UUID(),
        existing_nullable=False,
        server_default=None
    )
    op.alter_column(
        'users',
        'id',
        type_=sa.INTEGER(),
        existing_type=sa.UUID(),
        existing_nullable=False,
        server_default=None
    )
