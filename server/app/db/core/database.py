from pymongo import MongoClient
import os

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self, is_test=True):
        """
        Establishes the database connection.
        :param is_test: Boolean flag to connect to the test database.
        """
        mongo_uri = os.getenv("MONGO_URI", "mongodb://root:example@localhost:27017/?directConnection=true&ssl=false")
        mongo_db_name = "quiz_generator_test" if is_test else os.getenv("MONGO_DB_NAME", "quiz_generator")

        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client[mongo_db_name]
            print(f"Connected to database: {mongo_db_name}")
        except Exception as e:
            raise Exception(f"Failed to connect to MongoDB: {e}")

    def get_collection(self, collection_name):
        """
        Retrieves a collection from the database.
        :param collection_name: Name of the collection
        :return: Collection object
        """
        if self.db is None:  # Explicitly check for None instead of a truthy check
            raise Exception("Database not connected. Call connect() first.")
        return self.db[collection_name]


# Create a global database instance
db_instance = Database()
