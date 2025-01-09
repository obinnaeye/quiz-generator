# Database Folder

This folder contains all components related to the database integration for the quiz-generation app. Below is an overview of the structure and purpose of each subfolder and file.

## Folder Structure

```
.
├── core/
│   └── connection.py   # Contains the database connection logic.
├── crud/
│   ├── user_crud.py    # CRUD operations related to users.
│   └── quiz_crud.py    # CRUD operations related to quizzes.
├── models/
│   └── models.py       # Pydantic models and schemas for the database.
└── README.md           # This README file.
```

## Components

### 1. **Core**
- **File:** `core/connection.py`
- **Purpose:**
  - Handles the connection setup to the MongoDB database using the `motor` library.
  - Ensures a single, reusable connection instance is available across the application.

### 2. **CRUD Operations**
- **Folder:** `crud/`
- **Files:**
  - `user_crud.py`: Contains functions to create, read, update, and delete user data in the database.
  - `quiz_crud.py`: Contains functions to manage quiz data, including inserting, updating, and retrieving quizzes.
- **Purpose:**
  - Encapsulates database queries for better modularity and maintainability.

### 3. **Models**
- **File:** `models/models.py`
- **Purpose:**
  - Defines Pydantic models for validation and serialization of database documents.
  - Ensures consistent data structures across the application.

## Documentation
- Detailed documentation for the MongoDB integration can be found in [`database_integration.md`](./database_integration.md).

## Usage

### Setting Up the Database Connection
The database connection is established using the `connect_to_mongo` function in `core/connection.py`. This function initializes the connection to the MongoDB server and provides access to the necessary collections.

### Seeding Data
To seed the database with default data:
1. Ensure MongoDB is running locally.
2. Run the seed script from the project root:
   ```bash
   PYTHONPATH=path-to-file python seed.py
   ```
   replace `path-to-file` with your actual path to the seed.py file.
   
3. The script will clear the database and populate it with default quizzes.

### CRUD Operations
CRUD operations are implemented in `crud/` and can be imported and used throughout the application. For example:

```python
from app.db.crud.quiz_crud import create_quiz

quiz_data = {
    "title": "Sample Quiz",
    "description": "A sample quiz for testing purposes",
    "quiz_type": "multichoice",
    "questions": [
        {
            "question": "What is 2+2?",
            "options": ["1", "2", "3", "4"],
            "correct_answer": "4"
        }
    ]
}
await create_quiz(quizzes_collection, quiz_data)
```

## Notes
- Ensure the MongoDB server is running before executing any scripts.
- Follow the Pydantic models defined in `models/models.py` for consistent data structure.

For further details, refer to the full documentation in [`database_integration.md`](./database_integration.md).
