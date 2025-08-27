# from pydantic import BaseModel, EmailStr, constr
# from typing import Optional

# class CreateUser(BaseModel):
#     name: constr(min_length=3, max_length=50)
#     email: EmailStr
#     password: constr(min_length=8, max_length=128)
#     city: Optional[constr(max_length=50)] = None

# class LoginUser(BaseModel):
#     email: EmailStr
#     password: str

# class Token(BaseModel):
#     access_token: str
#     token_type: str


from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
import uuid

class CreateUser(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    city: str = Field(..., min_length=2, max_length=50)
    years_experience: int = Field(..., ge=0, le=50, description="Years of experience")

class UpdateUserProfile(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    years_experience: Optional[int] = Field(None, ge=0, le=50)

class UserResponse(BaseModel):
    id: int  # Changed from uuid.UUID to int
    name: str
    email: str
    city: str
    years_experience: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int  # seconds

class TokenPayload(BaseModel):
    sub: str
    user_id: str
    exp: datetime