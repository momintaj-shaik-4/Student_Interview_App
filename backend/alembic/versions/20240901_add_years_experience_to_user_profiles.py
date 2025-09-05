"""Remove years_experience attempt (noop since field removed)"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c2e4a1b8f930'
down_revision = 'b1f3d2c9aa01'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # No operation needed; model no longer uses years_experience
    pass


def downgrade() -> None:
    # No operation
    pass


