from fastapi import APIRouter, HTTPException, Depends, Request, status
from server.schemas.model.password_reset_model import PasswordResetRequest, PasswordResetResponse, RequestPasswordReset, MessageResponse
#from server.schemas.model import UserModel, LoginRequestModel, LoginResponseModel
from ..auth.services import (
    register_user_service,
    verify_otp_service,
    verify_link_service,
    login_service,
    request_password_reset_service,
    reset_password_service,
    #get_current_user,
    logout_service
)
from server.app.auth.utils import generate_otp, generate_verification_token, create_jwt_token
from fastapi.security import OAuth2PasswordBearer
from server.app.db.schemas.user_schemas import  UserRegisterSchema, UserResponseSchema, LoginRequestModel, LoginResponse

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
TOKEN_BLACKLIST_PREFIX = "blacklist:"

@router.get("/ping")
async def ping():
    return {"message": "Auth route is active"}

@router.post("/register/", response_model=UserResponseSchema)
async def register_user(user: UserRegisterSchema):
    return await register_user_service(user)

@router.post("/verify-otp/")
async def verify_otp(email: str, otp: str, request: Request):
    users_collection = request.app.state.users_collection
    redis_client = request.app.state.redis

    return await verify_otp_service(email, otp, users_collection, redis_client)

@router.get("/verify-link/")
async def verify_link(token: str, request: Request):
    users_collection = request.app.state.users_collection
    redis_client = request.app.state.redis
    return await verify_link_service(token, users_collection, redis_client)

@router.post("/login/", response_model=LoginResponse)
async def login(
    request_data: LoginRequestModel,
    request: Request
):
    users_collection = request.app.state.users_collection
    return await login_service(
        identifier=request_data.identifier,
        password=request_data.password,
        users_collection=users_collection
    )

@router.post("/request-password-reset", response_model=MessageResponse)
async def request_password_reset(request: RequestPasswordReset):
    return await request_password_reset_service(request)

@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(request: PasswordResetRequest):
    return await reset_password_service(request)

# @router.get("/me")
# def get_me(current_user: dict = Depends(get_current_user)):
#     return {"message": "Access granted", "user": current_user}

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(token: str = Depends(oauth2_scheme)):
    return logout_service(token)