from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic to handle MongoDB ObjectIds."""
    
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
    

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: str
    quizzes: List[str] = []  # List of quiz IDs created or saved by the user
    created_at: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Quiz(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    questions: List 
    owner_id: Optional [str] = None
    created_at: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UpdateQuiz(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: Optional[List[dict]] = None 

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
