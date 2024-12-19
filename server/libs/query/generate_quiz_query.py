from pydantic import BaseModel

class GenerateQuizQuery(BaseModel):
    question_type: str
    num_question: int
