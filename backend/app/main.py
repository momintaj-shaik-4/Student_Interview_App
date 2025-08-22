from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from contextlib import asynccontextmanager
from app.routes import user_routes
from starlette.middleware.sessions import SessionMiddleware
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:5173", # Your frontend's development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "supersecret"),
)

app.include_router(user_routes.router, prefix="/api/v1/auth")