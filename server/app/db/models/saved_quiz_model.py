from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class SavedQuizQuestionModel(BaseModel):
    question: str
    options: Optional[List[str]] = None
    answer: str
    question_type: str

class SavedQuizModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    quiz_name: str
    question_type: str
    questions: List[SavedQuizQuestionModel]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
