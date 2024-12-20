from fastapi import Query
from pydantic import BaseModel

class GetUserQuizHistoryQuery(BaseModel):
    user_id: str = Query(..., description="User's id")
