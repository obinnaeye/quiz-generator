from pydantic import BaseModel
from .user_model import UserModel

class LoginResponseModel(BaseModel):
    message: str
    user: UserModel
