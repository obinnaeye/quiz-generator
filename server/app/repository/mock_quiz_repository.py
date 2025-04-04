from typing import List

class QuizRepository:
    def get_questions(self, topic: str, count: int) -> List[dict]:
        raise NotImplementedError


class MockQuizRepository(QuizRepository):
    def __init__(self):
        self.data = [
            {"topic": "Math", "question": "What is 2 + 2?", "options": ["3", "4", "5"], "answer": "4"},
            {"topic": "Math", "question": "What is 3 x 3?", "options": ["6", "7", "9"], "answer": "9"},
            {"topic": "Science", "question": "What planet is closest to the sun?", "options": ["Mars", "Venus", "Mercury"], "answer": "Mercury"},
        ]

    def get_questions(self, topic: str, count: int) -> List[dict]:
        return [q for q in self.data if q["topic"] == topic][:count]
