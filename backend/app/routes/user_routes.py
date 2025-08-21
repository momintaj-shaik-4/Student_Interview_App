from fastapi import Depends, HTTPException, APIRouter, Request
from typing import Annotated
from sqlmodel import select
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from app.models.user_model import User
from app.auth import create_access_token, hash_password, verify_password
from app.schemas.user_schemas import CreateUser, Token
from app.dependencies import SessionDep, get_curr_user
from datetime import timedelta
from authlib.integrations.starlette_client import OAuth
import os
import httpx
import secrets
import string

router = APIRouter()

# Get environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")

MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
MICROSOFT_REDIRECT_URI = os.getenv("MICROSOFT_REDIRECT_URI")
MICROSOFT_TENANT_ID = os.getenv("MICROSOFT_TENANT_ID", "common")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Setup OAuth
oauth = OAuth()

oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='linkedin',
    client_id=LINKEDIN_CLIENT_ID,
    client_secret=LINKEDIN_CLIENT_SECRET,
    access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
    authorize_url='https://www.linkedin.com/oauth/v2/authorization',
    api_base_url='https://api.linkedin.com/v2/',
    client_kwargs={
        'scope': 'openid profile email',
        'token_endpoint_auth_method': 'client_secret_post'
    }
)

oauth.register(
    name='microsoft',
    client_id=MICROSOFT_CLIENT_ID,
    client_secret=MICROSOFT_CLIENT_SECRET,
    access_token_url=f'https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/oauth2/v2.0/token',
    authorize_url=f'https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize',
    api_base_url='https://graph.microsoft.com/v1.0/',
    client_kwargs={
        'scope': 'openid email profile User.Read',
        'response_type': 'code'
    }
)

@router.get("/google")
async def login_google(request: Request):
    return await oauth.google.authorize_redirect(request, redirect_uri=GOOGLE_REDIRECT_URI)

@router.get("/google-login")
async def google_login(request: Request, session: SessionDep):
    try:
        # Authlib handles the token exchange
        token = await oauth.google.authorize_access_token(request)
        user_data = await oauth.google.parse_id_token(request, token)

        user_email = user_data["email"]
        user_name = user_data.get("name", "Google User")

        existing_user = session.exec(select(User).where(User.email == user_email)).first()
        user_to_authenticate = existing_user

        if not existing_user:
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            hashed_password = hash_password(random_password)
            new_user = User(
                name=user_name,
                email=user_email,
                password=hashed_password,
                city=None
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            user_to_authenticate = new_user

        expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_to_authenticate.email},
            expires_delta=expire
        )
        return RedirectResponse(f"{FRONTEND_URL}/google-login?token={access_token}", status_code=303)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")

@router.get("/linkedin")
async def login_linkedin(request: Request):
    return await oauth.linkedin.authorize_redirect(request, redirect_uri=LINKEDIN_REDIRECT_URI)


@router.get("/linkedin-login")
async def linkedin_login(request: Request, session: SessionDep):
    try:
        token = await oauth.linkedin.authorize_access_token(request)

        headers = {"Authorization": f"Bearer {token['access_token']}"}
        user_data = None

        async with httpx.AsyncClient() as client:
            user_response = await client.get("https://api.linkedin.com/v2/userinfo", headers=headers)
            user_response.raise_for_status()
            user_data = user_response.json()

        if not user_data or not user_data.get("email"):
            raise HTTPException(status_code=400, detail="Could not retrieve user data from LinkedIn")

        existing_user = session.exec(select(User).where(User.email == user_data["email"])).first()
        user_to_authenticate = existing_user

        if not existing_user:
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            hashed_password = hash_password(random_password)
            
            user_name = user_data.get("name") or "LinkedIn User"
            
            new_user = User(
                name=user_name,
                email=user_data["email"],
                password=hashed_password,
                city=None
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            user_to_authenticate = new_user
        
        expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_to_authenticate.email},
            expires_delta=expire
        )
        return RedirectResponse(f"{FRONTEND_URL}/linkedin-login?token={access_token}", status_code=303)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")

@router.get("/microsoft")
async def login_microsoft(request: Request):
    return await oauth.microsoft.authorize_redirect(request, redirect_uri=MICROSOFT_REDIRECT_URI)


@router.get("/microsoft-login")
async def microsoft_login(request: Request, session: SessionDep):
    try:
        token = await oauth.microsoft.authorize_access_token(request)
        
        async with httpx.AsyncClient() as client:
            user_info_url = "https://graph.microsoft.com/v1.0/me"
            headers = {"Authorization": f"Bearer {token['access_token']}"}
            user_response = await client.get(user_info_url, headers=headers)
            user_response.raise_for_status()
            user_data = user_response.json()

        user_email = user_data.get("mail") or user_data.get("userPrincipalName")
        user_name = user_data.get("displayName", "Microsoft User")
        
        if not user_email:
            raise HTTPException(status_code=400, detail="Could not retrieve email from Microsoft")

        existing_user = session.exec(select(User).where(User.email == user_email)).first()
        user_to_authenticate = existing_user
        
        if not existing_user:
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            hashed_password = hash_password(random_password)
            new_user = User(
                name=user_name,
                email=user_email,
                password=hashed_password,
                city=None
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            user_to_authenticate = new_user
        
        expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_to_authenticate.email},
            expires_delta=expire
        )
        return RedirectResponse(f"{FRONTEND_URL}/microsoft-login?token={access_token}", status_code=303)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")


# The rest of your code for local login and registration
@router.post("/register")
def register(session: SessionDep, user_data: CreateUser):
    if session.exec(select(User).where(User.email == user_data.email)).first():
        raise HTTPException(status_code=400, detail="Email is already registered")
    hash_pwd = hash_password(user_data.password)

    user = User(name=user_data.name, email=user_data.email, password=hash_pwd, city=user_data.city)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Credentials")

    pwd = verify_password(form_data.password, user.password)
    if not pwd:
        raise HTTPException(status_code=404, detail="Invalid Credentials")

    expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.email}, expires_delta=expire)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile")
def profile(current_user: Annotated[User, Depends(get_curr_user)]):
    return {"name": current_user.name, "email": current_user.email}