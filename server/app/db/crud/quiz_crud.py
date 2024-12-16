from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from app.db.models.models import PyObjectId, Quiz

async def create_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_data: dict):
    try:
        new_quiz = await quizzes_collection.insert_one(quiz_data)
        print("new quiz successfully created with id: ", str(new_quiz.inserted_id))
        return str(new_quiz.inserted_id)  
    except Exception as e:
        print(f"Error occurred while creating quiz: {e}")
        return None 


async def get_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str):
    try:
        quiz = await quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        if quiz:
            quiz["_id"] = PyObjectId(quiz["_id"])
            return Quiz(**quiz)  
        return None  
    except Exception as e:
        print(f"Error occurred while retrieving quiz: {e}")
        return None 


async def update_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str, update_data: dict):
    try:
        result = await quizzes_collection.update_one(
            {"_id": ObjectId(quiz_id)}, 
            {"$set": update_data.dict(exclude_unset=True)}
        )
        if result.matched_count == 0:
            return None 
        
        updated_quiz = await quizzes_collection.find_one(ObjectId(quiz_id)) #retrieve the updated quiz to confirm the update
        updated_quiz["_id"] = PyObjectId(updated_quiz["_id"]) #confirm that the quiz ID is an instance of PyObjectId to pass the Quiz model structure
        return {"message": "quiz updated successfully", "updated_quiz": Quiz(**updated_quiz), "modified_count": str(result.modified_count)}
    except Exception as e:
        print(f"Error occurred while updating or retrieving quiz: {e}")
        return None 


async def delete_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str):
    try:
        result = await quizzes_collection.delete_one({"_id": ObjectId(quiz_id)})
        return result.deleted_count  # Return the number of deleted documents
    except Exception as e:
        print(f"Error occurred while deleting quiz: {e}")
        return None  


