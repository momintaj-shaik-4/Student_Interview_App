from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth_router, profile_router, roles_router, cv_router, payment_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Interview App API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/api/v1", tags=["Profile"])
app.include_router(roles_router, prefix="/api/v1", tags=["Roles"])
app.include_router(cv_router, prefix="/api/v1/cvs", tags=["CV Management"])
app.include_router(payment_router, prefix="/api/v1", tags=["Payments & Wallet"])

@app.get("/")
def read_root():
    return {"message": "Student Interview App API"}