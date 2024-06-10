# BITESPEED-BACKEND-TASK

- Hello, I am Aniket a Remote Full stack developer, Here is my task, I hope you'll like it, Really excited to get opportunity to work with your team, I tried my best to complete the task as much as possible. Below are the instruction to setup the task locally.

## Installation

- Clone the repo: `git clone https://github.com/aniketmandloi/bitespeed-backend-task.git`.
- Change the directory: `cd bitespeed-backend-task`.
- Install the dependencies: `npm install` or `npm i`.
- Also you can change the version of node with NVM to nodeV20 so you don't have dependency conflicts and issues: `nvm install 20`.
- Use the nodeV20 with: `nvm use 20`.

## Database Setup

- Install Postgres from [here](https://www.postgresql.org/download/).
- run the Postgres server.
- Create a database with the name `bitespeed`.

## Prisma Setup

- Install Prisma CLI from [here](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli/installation).
- run migrations: `npx prisma migrate dev --name init`.

## Run the server Locally

- start the server: `npm run dev`.
- The server will be running at `http://localhost:3000`.

## Live Project URL (Production)

- used render.com to host the web service.
- Copy this url for the live server: `https://bitespeed-backend-task-acjk.onrender.com/identify`. (its not working because my database is not able to connect with the live server for that maybe i have to deploy a database as well) but you can try it locally it will be really easy.

## Testing with Postman

- You can test the endpoints with Postman.
- You can download the postman from [here](https://www.postman.com/downloads/).
- now start postman and create a workspace.
- select the request `POST` and enter the endpoint: `http://localhost:3000`.
- select body tab and enter the body: `{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}`
- hit send button you should see the response.
