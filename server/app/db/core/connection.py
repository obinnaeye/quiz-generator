from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)

database = client["quiz_db"]

# here we initialize collections for different data group
quizzes_collection = database["quizzes"]
users_collection = database["users"]
