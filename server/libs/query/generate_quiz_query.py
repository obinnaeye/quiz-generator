from fastapi import Query
from pydantic import BaseModel

class GenerateQuizQuery(BaseModel):
    user_id: str = Query(..., description="User's id")
    question_type: str = Query("multichoice", description="Type of questions requested (multichoice, true-false, open-ended)")
    num_question: int = Query(..., description="Number of questions to include in the download", ge=1)
