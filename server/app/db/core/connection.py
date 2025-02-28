from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
import os



MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)

database = client["quiz_db"]

quizzes_collection = database["quizzes"]
users_collection = database["users"]

async def ensure_user_indexes(users_collection: AsyncIOMotorCollection):
    await users_collection.create_index("email", unique=True) 
    await users_collection.create_index("username", unique=True) 
    await users_collection.create_index("created_at") 
    await users_collection.create_index("is_active") 



async def startUp():
    await ensure_user_indexes(users_collection)