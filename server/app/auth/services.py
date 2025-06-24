from fastapi import Request, HTTPException, Depends, status
from ..auth.utils import generate_otp, generate_verification_token, decode_verification_token, decode_access_token
from redis import Redis
import random
from datetime import datetime, timezone, timedelta
import jwt
from jwt import PyJWTError, ExpiredSignatureError
import os
from server.email_utils import send_otp_email
from fastapi.security import OAuth2PasswordBearer
import redis
from server.app.db.core.connection import users_collection
from motor.motor_asyncio import AsyncIOMotorCollection
from server.app.db.crud.user_crud import create_user, get_user_by_email
from server.app.db.schemas.user_schemas import  UserRegisterSchema, UserResponseSchema, CreateUserRequest, PasswordResetRequest, PasswordResetResponse, RequestPasswordReset, MessageResponse
from server.app.db.utils import is_valid_password
from server.app.auth.utils import create_jwt_token
from server.app.db.core.redis import get_redis_client
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

#mock_db: list[UserModel] = []  

async def register_user_service(user: UserRegisterSchema) -> UserResponseSchema:
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = CreateUserRequest(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password=user.password
    )
    
    created_user = await create_user(users_collection, user_data)
    if not created_user:
        raise HTTPException(status_code=500, detail="User registration failed")
   
    redis_client = get_redis_client()
    otp = generate_otp()
    token = generate_verification_token(user.email)
    

    redis_client.setex(f"otp:{user.email}", timedelta(minutes=10), otp)
    redis_client.setex(f"token:{user.email}", timedelta(minutes=30), token)

    send_otp_email(user.email, otp, token, mode="register")

    return UserResponseSchema(
        id=created_user.id,
        username=created_user.username,
        email=created_user.email,
        full_name=created_user.full_name,
        created_at=created_user.created_at, 
        updated_at=created_user.updated_at,
        is_active=created_user.is_active,
        is_verified=created_user.is_verified,
        role=created_user.role
    )

async def verify_otp_service(email: str,
    otp: str,
    users_collection: AsyncIOMotorCollection,
    redis_client: Redis):
    stored_otp = redis_client.get(f"otp:{email}")
    attempts = int(redis_client.get(f"attempts:{email}") or 0)

    if attempts >= 4:
        raise HTTPException(status_code=403, detail="Too many attempts. Request a new OTP.")

    if stored_otp is None:
        raise HTTPException(status_code=400, detail="OTP expired or not requested.")

    if otp != stored_otp:
        redis_client.incr(f"attempts:{email}")
        raise HTTPException(status_code=401, detail="Invalid OTP. Try again.")

    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )

    redis_client.delete(f"otp:{email}")
    redis_client.delete(f"token:{email}")
    redis_client.delete(f"attempts:{email}")

    return {"message": "OTP verified successfully!"}

async def verify_link_service(
    token: str,
    users_collection: AsyncIOMotorCollection,
    redis_client
):
    try:
        email = decode_verification_token(token)
    except HTTPException as e:
        raise e  # You could also raise your own custom exception here

    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user.get("is_verified"):
        return {"message": "Email already verified."}

    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )

    redis_client.delete(f"token:{email}")
    redis_client.delete(f"otp:{email}")

    return {"message": "Email verified successfully!"}

async def login_service(
    identifier: str,
    password: str,
    users_collection: AsyncIOMotorCollection
):
    user = await users_collection.find_one({
        "$or": [
            {"email": identifier},
            {"username": identifier}
        ]
    })

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified")

    if not is_valid_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    token = create_jwt_token({"sub": user["email"]}, expire_minutes=60)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }

async def request_password_reset_service(request: RequestPasswordReset):
    user = await users_collection.find_one({"email": request.email})
    message = {"message": "If this email exists, reset instructions have been sent."}
    if not user:
        return message
    
    otp = generate_otp()
    token = generate_verification_token(request.email)
    
    redis_client = get_redis_client()
    redis_client.setex(f"otp:{request.email}", 300, otp)
    redis_client.setex(f"token:{request.email}", 1800, token)

    send_otp_email(request.email, otp, token, mode="reset")
    return message

async def reset_password_service(request: PasswordResetRequest):
    redis_client = get_redis_client()
    user = await users_collection.find_one({"email": request.email})
    
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

    hashed_password = pwd_context.hash(request.new_password)

    
    result = await users_collection.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_password}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Password reset failed")

   
    redis_client.delete(f"otp:{request.email}")
    redis_client.delete(f"token:{request.email}")

    return PasswordResetResponse(message="Password reset successful", success=True)

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     if redis_client.get(f"blacklist:{token}"):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token has been blacklisted. Please log in again.",
#         )

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id = payload.get("sub")

#         if user_id is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Token payload invalid: missing user ID",
#             )

#         return {"user_id": user_id}

#     except jwt.ExpiredSignatureError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
#         )
#     except PyJWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
#         )

def logout_service(token: str = Depends(oauth2_scheme)):
    redis_client = get_redis_client()
    try:
        payload = decode_access_token(token)
        jti = payload.get("jti")
        exp = payload.get("exp")
        if not jti or not exp:
            raise HTTPException(status_code=400, detail="Invalid token payload")

        # Calcul du TTL restant
        ttl = int(exp - datetime.now(timezone.utc).timestamp())
        if ttl > 0:
            redis_client.setex(f"blacklist:{jti}", ttl, "true")

        return {"message": "Logout successful."}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
