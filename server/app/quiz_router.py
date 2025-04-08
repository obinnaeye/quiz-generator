from fastapi import APIRouter, HTTPException
from app.quiz import Quiz
from .repository.mock_quiz_repository import MockQuizRepository  # Import the mock repository

router = APIRouter()

# Use the mock repository for now
repository = MockQuizRepository()
quiz = Quiz(repository)

@router.post("/quiz/start")
async def start_quiz_session(topic: str, count: int = 5):
    try:
        session_id = quiz.start_session(topic, count)
        return {"session_id": session_id}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/quiz/next")
async def get_next_question(session_id: str):
    question = quiz.get_question(session_id)
    if question is None:
        raise HTTPException(status_code=404, detail="No more questions available.")
    return {"question": question}

@router.post("/quiz/answer")
async def submit_answer(session_id: str, answer: str):
    success = quiz.record_answer(session_id, answer)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"message": "Answer recorded."}

@router.get("/quiz/results")
async def get_results(session_id: str):
    results = quiz.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="Session not found or no answers submitted.")
    return {"results": results}
