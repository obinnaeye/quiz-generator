from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from dotenv import load_dotenv
import os


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)

database = client["quizApp_db"]

quizzes_collection = database["quizzes"]
users_collection = database["users"]

async def ensure_user_indexes(users_collection: AsyncIOMotorCollection):
    await users_collection.create_index("email", unique=True) 
    await users_collection.create_index("username", unique=True) 
    await users_collection.create_index("created_at") 
    await users_collection.create_index("is_active") 



async def startUp():
    await ensure_user_indexes(users_collection)
