from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    title: str
    description: Optional[str]
    questions: List[Question]
