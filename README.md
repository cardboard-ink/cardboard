# How to run (dev)

Welcome to CardBoard! This readme will guide you on how to set up and run the project in a development environment. Follow the instructions below to get started.

## Prerequisites

Before you begin, make sure you have the following:

- Ports ```5555``` and ```5173``` are free.

## Installation

1. Install Docker on your machine with compose.

2. Navigate to the project directory.

3. Run the following command, depending on your Docker + Compose installation:

`docker-compose up` or `docker compose up`


## Running the Application

1. Open your web browser and go to the following URL: [http://localhost:5555](http://localhost:5555) (Prisma Studio).

2. In Prisma Studio, navigate to the "Roles" model and add the roles "USER" and "ADMIN".

3. Now, open [http://localhost:5173](http://localhost:5173) in your web browser. This will open the Svelte app.

4. Create a user account and assign it the "ADMIN" role from Prisma Studio.

## Congratulations!

Congratulations! The setup is complete, and you are ready to start developing. Happy coding!
