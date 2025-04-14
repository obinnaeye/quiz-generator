from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
import re

class ResetMethod(str, Enum):
    OTP = "otp"
    TOKEN = "token"

class PasswordResetRequest(BaseModel):
    email: EmailStr
    reset_method: ResetMethod
    otp: str | None = None
    token: str | None = None
    new_password: str

    @field_validator('new_password')
    def validate_password(cls, value):
        if not re.search(r'[A-Z]', value):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not re.search(r'[a-z]', value):
            raise ValueError('Password must contain at least one lowercase letter.')
        if not re.search(r'[0-9]', value):
            raise ValueError('Password must contain at least one number.')
        if not re.search(r'[!@\$%\^&\*\(\)\-_,\.\?":\{\}\|<>]', value):
            raise ValueError('Password must contain at least one special character.')
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long.')
        return value

class PasswordResetResponse(BaseModel):
    message: str
    success: bool
