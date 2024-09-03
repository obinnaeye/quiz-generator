# Quiz App Server

This directory contains the backend code for the Quiz App, built using Python FastAPI. The backend handles the API endpoints, including health checks, and serves as the core engine for the application's logic.

## Requirements

- **Python**: 3.12
- **pipenv**: For managing Python dependencies.
- **direnv**: For managing environment variables with the `.env` file.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app/backend
```

### 2. Install Dependencies

Ensure you have Python 3.12 installed. Then, install the required dependencies using `pipenv`.

```bash
pipenv install
```

### 3. Setup Environment Variables

The project uses `direnv` to manage environment variables from the `.env` file. Ensure you have `direnv` installed and then run:

```bash
direnv allow
```

Make sure the `.env` file contains the following variable:

```plaintext
PORT=8000
```

You can change the port number as needed.

### 4. Run the Application

Start the FastAPI server with the following command:

```bash
pipenv run uvicorn main:app --reload
```

The API will be accessible at `http://localhost:8000/api`.

### 5. Access Healthcheck

Verify the API is running correctly by visiting the health check endpoint:

```bash
http://localhost:8000/api/healthcheck
```

You should receive a JSON response confirming the server is up and running.

## Code Quality

- Type annotations are used throughout the codebase to ensure type safety and clarity.
- The use of `any` is avoided to maintain code integrity and predictability.
