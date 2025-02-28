from pydantic import BaseModel, Field, model_validator, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId



class PyObjectId(ObjectId):    
    def __get_pydantic_json_schema__(self, *args, **kwargs):
        return {
            "type": "string",
            "description": "MongoDB ObjectId",
        }

    @classmethod
    @model_validator(mode='before')
    def check_valid_objectid(cls, values):
        value = values.get('value')
        if value is not None and not isinstance(value, ObjectId):
            raise ValueError("Invalid ObjectId")
        return values
    

# class User(BaseModel):
#     id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
#     username: str
#     email: str
#     quizzes: List[str] = []  # List of quiz IDs created or saved by the user
#     created_at: Optional[str] = None

#     class Config:
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}

class UserBase(BaseModel):
    """Common fields for user models"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    quizzes: Optional[List[str]] = []  # List of quiz IDs associated with the user

class UserCreate(UserBase):
    """Used for user registration"""
    password: str  # Plaintext password (to be hashed before storage)

class UserDB(BaseModel):
    """Represents the user as stored in MongoDB"""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    quizzes: Optional[List[str]] = []  # List of quiz IDs associated with the user
    is_active: bool 
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())

    class Config:
        populate_by_name = True
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Update_UserDB(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    quizzes: Optional[List[str]] = [] 
    hashed_password: Optional[str] = None 
    is_active: Optional[bool] = None
    role:  Optional[str] = None 
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())

    class Config:
        populate_by_name = True
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class SeedUser(UserBase):
    """Represents the user as stored in MongoDB"""
    hashed_password: str
    is_active: bool 
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())

    class Config:
        populate_by_name = True
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    




class Quiz(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    quiz_type: str
    owner_id: Optional [str] = None
    created_at: Optional[datetime]  = Field(default_factory=lambda: datetime.now())
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())
    questions: List 
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UpdateQuiz(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quiz_type: Optional[str] = None
    questions: Optional[List[dict]] = None 

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class SeedQuiz(BaseModel):
    title: str
    description: str
    quiz_type: str
    owner_id: Optional [str] = None
    created_at: Optional[datetime]  = Field(default_factory=lambda: datetime.now())
    questions: List

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

