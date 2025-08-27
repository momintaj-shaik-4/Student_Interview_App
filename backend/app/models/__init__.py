# Import all models here to make them available from app.models
from .user_model import User
from .activity_model import Activity
from .cv_model import CV
from .interview_model import Interview
from .payment_model import Payment
from .persona_model import Persona
from .role_model import Role
from .screening_model import Screening
from .transaction_model import Transaction
from .user_profiles_model import UserProfile
from .user_role_selection_model import UserRoleSelection
from .wallet_model import Wallet


# Export all models for easy importing
__all__ = [
    "User",
    "Activity",
    "CV",
    "Interview",
    "Payment",
    "Persona",
    "Role",
    "Screening",
    "Transaction",
    "UserProfile",
    "UserRoleSelection",
    "Wallet",
]