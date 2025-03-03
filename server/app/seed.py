import asyncio
from db.core.connection import quizzes_collection, users_collection
from seed_data import seed_quizzes, seed_user_data 
from datetime import datetime, timezone
from db.utils import hash_password
from db.models.user_models import SeedUser
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


async def seed_users_collection():
    await users_collection.delete_many({})
    for user_data in seed_user_data:
        try:
            user_data["hashed_password"] = hash_password(user_data.pop("password"))  
            user_data["is_active"] = True
            user_data["role"] = "user"
            user_data["created_at"] = datetime.now(timezone.utc)
            user_data["updated_at"] = None
            user = SeedUser(**user_data)
            await users_collection.insert_one(user.model_dump())
            print(f"User '{user.email}' inserted successfully.")
        except Exception as e:
            print(f"Error inserting user: {e}")


async def seed_database():
    await asyncio.gather(seed_quizzes_collection(), seed_users_collection())
    print("Database seeding completed!")


if __name__ == "__main__":
    asyncio.run(seed_database())

