from .auth_routes import router as auth_router
from .profile_routes import router as profile_router
from .roles_routes import router as roles_router
from .cv_routes import router as cv_router
from .payment_routes import router as payment_router

__all__ = [
    "auth_router",
    "profile_router", 
    "roles_router",
    "cv_router",
    "payment_router"
]


