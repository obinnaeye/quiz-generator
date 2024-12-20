from typing import List, Optional

from pydantic import BaseModel

class UpdateQuizHistoryModel(BaseModel):
    question: str
    options: Optional[List[str]] 
    answer: str
