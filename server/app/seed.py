import asyncio
from app.db.core.connection import quizzes_collection
from app.db.models.models import SeedQuiz
from app.seed_data import seed_quizzes 


async def insert_seed_data():
    await quizzes_collection.delete_many({})

    for quiz_data in seed_quizzes:
        try:
            quiz = SeedQuiz(**quiz_data)
            await quizzes_collection.insert_one(quiz.model_dump())
            print(f"Quiz '{quiz.title}' inserted successfully.")
        except Exception as e:
            print(f"Error inserting quiz: {e}")

if __name__ == "__main__":
    asyncio.run(insert_seed_data())
