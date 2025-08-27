from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes
from starlette.middleware.sessions import SessionMiddleware
import os


app = FastAPI(
    title="Student/Startup Interviews API",
    description="API for interview and CV screening platform",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # Alternative React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use specific origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "supersecret"),
)

# Include routers
app.include_router(user_routes.router, prefix="/api/v1/auth")

@app.get("/")
async def root():
    return {"message": "Student/Startup Interviews API", "version": "1.0.0"}

