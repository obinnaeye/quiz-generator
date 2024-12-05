from typing import List
from app.repository.mock_quiz_repository import QuizRepository  
import uuid

class Quiz:
    def __init__(self, repository: QuizRepository):
        self.repository = repository
        self.sessions = {}

    def start_session(self, topic: str, count: int = 5) -> str:
        questions = self.repository.get_questions(topic, count)
        if not questions:
            raise ValueError("No questions found for the given topic.")
        
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "current_index": 0,
            "questions": questions,
            "answers": []
        }
        return session_id

    def get_question(self, session_id: str) -> dict:
        if session_id not in self.sessions:
            return None
        session = self.sessions[session_id]
        index = session["current_index"]
        if index < len(session["questions"]):
            session["current_index"] += 1
            return session["questions"][index]
        return None

    def record_answer(self, session_id: str, answer: str):
        if session_id in self.sessions:
            self.sessions[session_id]["answers"].append(answer)
            return True
        return False

    def get_results(self, session_id: str):
        return self.sessions.get(session_id, {}).get("answers", [])
