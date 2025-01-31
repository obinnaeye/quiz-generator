# Quiz Generator App Server

This directory contains the backend code for the Quiz App, built using Python FastAPI. The backend handles the API endpoints, including health checks, and serves as the core engine for the application's logic.

## Requirements

- **Python**: 3.12
- **pipenv**: For managing Python dependencies.
- **direnv**: For managing environment variables with the `.env` file.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-generator/server
```

### 2. Create virtual enviroment
Ensure you are in the server directory then run the following command

```bash
python -m venv .venv
```
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

Ensure you have Python 3.12 installed. Then, install the required dependencies using `pipenv`.

```bash
pipenv install
```

### 4. Setup Environment Variables

The project uses `direnv` to manage environment variables from the `.env` file. Ensure you have `direnv` installed and then run:

```bash
direnv allow
```

Make sure the `.env` file contains the following variable:

```plaintext
PORT=8000
```

### 5. Run the Application

Start the FastAPI server with the following command:

```bash
pipenv run fastapi dev main.py
```

The API will be accessible at `http://localhost:8000/api`.

### 6. Access Healthcheck

Verify the API is running correctly by visiting the health check endpoint:

```bash
http://localhost:8000/api/healthcheck
```

You should receive a JSON response confirming the server is up and running.


