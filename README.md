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

`localhost:3000`

### Navigate to the rest api

`localhost:8080/api`