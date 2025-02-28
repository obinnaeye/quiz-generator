from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone


class UserBaseSchema(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
     


class NewUserSchema(UserBaseSchema):
    id: str


class UserSchema(UserBaseSchema):
    id: str
    quizzes: Optional[List[str]] = [] 
    is_active: bool 
    role: str
    created_at: datetime
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class UpdateUserSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    quizzes: Optional[List[str]] = [] 
    password: Optional[str] = None 
    is_active: Optional[bool] = None
    role:  Optional[str] = None 
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class CreateUserRequest(UserBaseSchema):
    password: str
    

class LoginRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class DeleteUserResponse(BaseModel):
    message: str
    delete_count: int


class LoginResponse(BaseModel):
    message: str
    user_id: str
    username: str
    fullname: Optional[str]
    email: str
    role: Optional[str] = "user"


class SeedUserSchema(UserBaseSchema):
    quizzes: Optional[List[str]] = [] 
    hashed_password: str
    is_active: bool 
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
