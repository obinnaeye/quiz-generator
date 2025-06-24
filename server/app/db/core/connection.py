from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
import os



MONGO_URI = os.getenv("mongodb://localhost:27017")

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

def get_users_collection() -> AsyncIOMotorCollection:
    return users_collection

def get_quizzes_collection() -> AsyncIOMotorCollection:
    return quizzes_collection

def get_folders_collection() -> AsyncIOMotorCollection:
    return database["folders"]
