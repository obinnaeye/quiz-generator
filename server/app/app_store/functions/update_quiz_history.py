from typing import List
import logging

from libs.model import QuizQuestionsModel

logger = logging.getLogger(__name__)

def update_quiz_history (user_id: str, update: List[QuizQuestionsModel]):
    #should update the quiz history object in the database with the userId and the update
    logger.info("Quiz history update: %s" %{ 'message': "quiz history updated", "user_id": user_id,"update": update })

    return { 'message': "quiz history updated", "update": update }
