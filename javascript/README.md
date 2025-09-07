# JavaScript Express Application

This directory contains the JavaScript Express application that connects to PostgreSQL using the `pg` package.

## Requirements

- Node.js 16+
- npm

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure PostgreSQL is running (from the root directory):
   ```bash
   cd ..
   docker compose up -d
   ```

3. Run the application:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## Endpoints

- `GET /` - Welcome message
- `GET /users` - Get all users
- `GET /users-test` - Get first 3 users
- `GET /health` - Health check

The application will be available at `http://localhost:3000`
