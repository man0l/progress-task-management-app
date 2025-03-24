# Task Management App

## How to run the app
### ENV Variables
Copy .env.example to .env

### Build

`docker compose build`

### run

`docker compose up -d`

### run migrations

`docker compose exec api alembic upgrade head` 

### Create an admin user
`docker compose exec api python seed.py`
### Nagivigate to the admin

`localhost:8000`

### Navigate to the frontend app

`localhost:5173`

### Login 
You might login in the backend and frontend app with the following credentials from seed.py:

`admin1@example.com`

`adminpassword`

### rest api endpoint

`localhost:5000`

### run tests
`docker compose exec api bash -c ./run_tests.sh`