import asyncio
from db.core.connection import quizzes_collection
from seed_data import seed_quizzes
from db.models.quiz_models import SeedQuiz


async def seed_quizzes_collection():
    await quizzes_collection.delete_many({})
    for quiz_data in seed_quizzes:
        try:
            quiz = SeedQuiz(**quiz_data)
            await quizzes_collection.insert_one(quiz.model_dump())
            print(f"Quiz '{quiz.title}' inserted successfully.")
        except Exception as e:
            print(f"Error inserting quiz: {e}")

    print("Database seeding completed!")



if __name__ == "__main__":
    asyncio.run(seed_quizzes_collection())

