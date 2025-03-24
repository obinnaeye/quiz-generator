# Database (db) Folder

This folder contains all components related to the database integration for the quiz-generation app. Below is an overview of the structure and purpose of each subfolder and file.

## Folder Structure

```
.
├── core/
│   └── connection.py   # Handles MongoDB connection database indexing.
├── crud/
│   ├── user_crud.py    # User CRUD operations.
│   └── quiz_crud.py    # Quiz CRUD operations.
├── models/
│   ├── user_models.py  # User-specific models.
│   ├── quiz_models.py  # Quiz-specific models.
│   └── validator.py    # Data validation functions.
├── schemas/
│   ├── user_schemas.py # User request/response schemas.
│   └── quiz_schemas.py # Quiz request/response schemas.
├── routes/
│   ├── health.py       # Health check endpoint.
│   ├── users.py        # User-related API routes.
│   └── quizzes.py      # Quiz-related API routes.
├── utils.py            # Database utility functions.
├── README.md           # Database overview.
└── database_integration.md  # MongoDB integration guide.
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
- **Folder:** `models/`
- **Files:**
  - `quiz_models`: contains the pydantic quiz models.
  - `user_models`: contains the pydantic user models.
  - `validators`: contains the pyobjectId validator.
- **Purpose:**
  - Defines Pydantic models for validation and serialization of database documents.

  ### 4. **Routes**
- **Files:**
  - `__init__`: assembles all routes associated with the database.
  - `health`: contains the Health check endpoint.
  - `quizzes`: contains routes associated with quizzes.
  - `users`: contains routes associated with users.
- **Purpose:**
  - Defines endpoints for interacting with the database.

### 5. **Schemas**
- **Folder:** `schema/`
- **Files:**
  - `quiz_schemas`: contains the pydantic quiz models
  - `user_schemas`: contains the pydantic user models
- **Purpose:**
  - Defines Pydantic schemas for validation and serialization of database documents.
  - Ensures consistent data structures across the application.

### 6. **Utils**
- **File:** `db/utils.py`
- **Purpose:**
  - Handles the utility functions like password hashing and validation etc.


## Documentation
- Detailed documentation for the MongoDB integration can be found in [`database_integration.md`](./database_integration.md).

## Usage

### Setting Up the Database Connection
The database connection is established in the `core/connection.py`. Here the connection to the MongoDB server is initialized with access to the necessary collections.

### Seeding Data
To seed the database with default data:
1. Ensure MongoDB is running locally.
2. Navigate to the app folder and run the seed script:
   ```bash
   PYTHONPATH=path-to-file python seed.py
   ```
   replace `path-to-file` with your actual path to the seed.py file.
   
3. The script will clear the database and populate it with default quizzes.

4. Inserted quiz with their IDs can be accessed using mongoDB compass or mongoDB shell. 


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
- Follow the Pydantic models defined in `models/` and `schemas` folders for consistent data structure.
- Check the `routes` folder for database healthcheck and CRUD operations Endpoints.

For further details, refer to the full documentation in [`database_integration.md`](./database_integration.md).
