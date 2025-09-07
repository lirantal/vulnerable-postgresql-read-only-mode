# Python FastAPI Application

This directory contains the Python FastAPI application that connects to PostgreSQL.

## Requirements

- Python 3.8+
- FastAPI
- asyncpg
- uvicorn

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # or if using poetry:
   # poetry install
   ```

2. Make sure PostgreSQL is running (from the root directory):
   ```bash
   cd ..
   docker compose up -d
   ```

3. Run the application:
   ```bash
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Endpoints

- `GET /` - Welcome message
- `GET /users` - Get all users
- `GET /users-test` - Get first 3 users
- `GET /health` - Health check

The application will be available at `http://localhost:8000`
