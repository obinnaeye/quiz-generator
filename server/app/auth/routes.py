from fastapi import APIRouter, HTTPException, Depends
from server.schemas.model.password_reset_model import PasswordResetRequest, PasswordResetResponse, RequestPasswordReset, MessageResponse
from server.schemas.model import UserModel, LoginRequestModel, LoginResponseModel
from ..auth.services import (
    register_user_service,
    verify_otp_service,
    verify_link_service,
    login_service,
    request_password_reset_service,
    reset_password_service,
    logout_service
)
from server.app.auth.utils import generate_otp, generate_verification_token, decode_verification_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
TOKEN_BLACKLIST_PREFIX = "blacklist:"

@router.get("/ping")
async def ping():
    return {"message": "Auth route is active"}

@router.post("/register/")
async def register_user(user: UserModel):
    return await register_user_service(user)

@router.post("/verify-otp/")
async def verify_otp(email: str, otp: str):
    return await verify_otp_service(email, otp)

@router.get("/verify-link/")
async def verify_link(token: str):
    return await verify_link_service(token)

@router.post("/login/", response_model=LoginResponseModel)
def login(request: LoginRequestModel):
    return login_service(request)

@router.post("/request-password-reset", response_model=MessageResponse)
async def request_password_reset(request: RequestPasswordReset):
    return await request_password_reset_service(request)

@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(request: PasswordResetRequest):
    return await reset_password_service(request)

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    return logout_service(token)