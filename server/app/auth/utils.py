import random
import jwt
import os
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

def generate_otp():
    return str(random.randint(100000, 999999))

def generate_verification_token(email: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=5)  
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_verification_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")
