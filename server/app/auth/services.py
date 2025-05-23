from fastapi import Request, HTTPException, Depends
from server.schemas.model import UserModel, LoginRequestModel, PasswordResetRequest, PasswordResetResponse, RequestPasswordReset, MessageResponse
from ..auth.utils import generate_otp, generate_verification_token, decode_verification_token
from redis import Redis
import random
from datetime import datetime, timezone, timedelta
import jwt
import os
from server.email_utils import send_otp_email
from fastapi.security import OAuth2PasswordBearer
import redis

redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

mock_db: list[UserModel] = []  

async def register_user_service(user: UserModel):
    if any(u["email"] == user.email for u in mock_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    otp = generate_otp()
    token = generate_verification_token(user.email)
    
    redis_client.setex(f"otp:{user.email}", 300, otp)
    redis_client.setex(f"token:{user.email}", 1800, token)
    
    send_otp_email(user.email, otp, token)  # Call the function to send OTP
    
    mock_db.append(user.model_dump())
    return {"message": "User registered. Please check your email for verification."}

async def verify_otp_service(email: str, otp: str):
    stored_otp = redis_client.get(f"otp:{email}")
    attempts = int(redis_client.get(f"attempts:{email}") or 0)
    
    if attempts >= 4:
        raise HTTPException(status_code=403, detail="Too many attempts. Request a new OTP.")
    if stored_otp is None:
        raise HTTPException(status_code=400, detail="OTP expired or not requested.")
    if otp != stored_otp:
        redis_client.incr(f"attempts:{email}")  # Increment failed attempts count
        raise HTTPException(status_code=401, detail="Invalid OTP. Try again.")
    
    for user in mock_db:
        if user["email"] == email:
            user["is_verified"] = True
            break
    
    redis_client.delete(f"otp:{email}")
    redis_client.delete(f"token:{email}")
    return {"message": "OTP verified successfully!"}

async def verify_link_service(token: str):
    try:
        email = decode_verification_token(token)
    except HTTPException as e:
        raise e 
    
    for user in mock_db:
        if user["email"] == email:
            user["is_verified"] = True
            break
    
    redis_client.delete(f"token:{email}")
    redis_client.delete(f"otp:{email}")
    return {"message": "Email verified successfully!"}

def login_service(request: LoginRequestModel):
    user = next(
        (
            u for u in mock_db
            if (u["username"] == request.username_or_email or u["email"] == request.username_or_email)
            and u["password"] == request.password
            and u.get("is_verified", False)  # ✅ check if user is verified
        ),
        None
    )

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials or user not verified")

    token_data = {
        "sub": user["email"],
        "exp": (datetime.now(timezone.utc) + timedelta(hours=1)).replace(tzinfo=None)
    }
    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

async def request_password_reset_service(request: RequestPasswordReset):
    user = next((u for u in mock_db if u["email"] == request.email), None)
    if not user:
        return {"message": "If this email exists, reset instructions have been sent."}
    
    otp = generate_otp()
    token = generate_verification_token(request.email)
    
    redis_client.setex(f"otp:{request.email}", 300, otp)
    redis_client.setex(f"token:{request.email}", 1800, token)
    
    send_otp_email(request.email, otp, token, mode="reset")
    return {"message": "If this email exists, reset instructions have been sent."}

async def reset_password_service(request: PasswordResetRequest):
    user = next((u for u in mock_db if u["email"] == request.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.reset_method == "otp":
        stored_otp = redis_client.get(f"otp:{request.email}")
        if stored_otp is None:
            raise HTTPException(status_code=400, detail="OTP expired or not found")
        if request.otp != stored_otp:
            raise HTTPException(status_code=401, detail="Invalid OTP")
    
    elif request.reset_method == "token":
        if not request.token:
            raise HTTPException(status_code=400, detail="Token is required")
        try:
            email_from_token = decode_verification_token(request.token)
        except HTTPException as e:
            raise e
        if email_from_token != request.email:
            raise HTTPException(status_code=403, detail="Token email mismatch")
    
    user["password"] = request.new_password

    redis_client.delete(f"otp:{request.email}")
    redis_client.delete(f"token:{request.email}")

    return PasswordResetResponse(message="Password reset successful", success=True)

def logout_service(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")

        if exp is None:
            raise HTTPException(status_code=400, detail="Invalid token")

        # Calculate remaining time before expiration
        remaining_time = exp - int(datetime.now(timezone.utc).timestamp())
        if remaining_time <= 0:
            raise HTTPException(status_code=400, detail="Token already expired")

        # Add token to Redis blacklist with TTL until expiration
        redis_client.setex(f"blacklist:{token}", remaining_time, "true")

        return {"message": "Logout successful"}
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has already expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
