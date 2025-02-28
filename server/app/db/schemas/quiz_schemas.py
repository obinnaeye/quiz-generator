from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone



class QuizSchema(BaseModel):
    title: str
    description: str
    quiz_type: str
    owner_id: Optional [str] = None
    created_at: Optional[datetime]  = Field(default_factory=lambda: datetime.now(timezone.utc))
    questions: List



class UpdateQuiz(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quiz_type: Optional[str] = None
    questions: Optional[List[dict]] = None 

    


   