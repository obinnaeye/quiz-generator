from fastapi import Query
from pydantic import BaseModel, Field
from .query_patterns import QueryPattern

class DownloadQuizQuery(BaseModel):
    pattern: str = Field(QueryPattern.DOWNLOAD_QUIZ)
    user_id: str = Query(..., description="User's id")
    format: str = Query("txt", description="File format for the quiz data (txt, csv, pdf, etc.)")
    question_type: str = Query("multichoice", description="Type of questions requested (multichoice, true-false, open-ended)")
    num_question: int = Query(..., description="Number of questions to include in the download", ge=1)
    