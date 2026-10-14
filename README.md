# Blog Application API

A RESTful blog API built with **Node.js**, **Express** and **PostgreSQL**. It supports user registration and login, JWT-based authentication, role-based authorization, and centralized error handling.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- Authentication using JSON Web Tokens (JWT)
- Authorization with two roles: `user` and `admin`
  - Anyone can read posts
  - Only logged-in users can create posts
  - Only the post owner or an admin can delete a post
- Centralized error handling with a consistent JSON response
- SQL injection protection through parameterized queries

## Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Runtime        | Node.js               |
| Framework      | Express               |
| Database       | PostgreSQL (`pg`)     |
| Authentication | JWT (`jsonwebtoken`)  |
| Hashing        | `bcryptjs`            |
| Config         | `dotenv`              |

## Project Structure

```
blog-app/
├── src/
│   ├── config/
│   │   ├── db.js            # PostgreSQL connection pool
│   │   └── schema.sql       # Database tables
│   ├── middleware/
│   │   ├── auth.js          # protect (authentication) and restrictTo (authorization)
│   │   └── errorHandler.js  # Centralized error handler
│   ├── routes/
│   │   ├── auth.js          # Register and login
│   │   └── posts.js         # Posts CRUD
│   └── app.js               # Application entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [PostgreSQL](https://www.postgresql.org/) v13 or later

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone <your-repository-url>
cd blog-app
npm install
```

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE blog;"
```

### 3. Create the tables

```bash
psql -U postgres -d blog -f src/config/schema.sql
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/blog
JWT_SECRET=replace_this_with_a_long_random_secret
PORT=3000
```

### 5. Run the server

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## Database Schema

**users**

| Column     | Type         | Notes                              |
| ---------- | ------------ | ---------------------------------- |
| id         | SERIAL       | Primary key                        |
| name       | VARCHAR(100) | Required                           |
| email      | VARCHAR(255) | Required, unique                   |
| password   | VARCHAR(255) | Hashed with bcrypt                 |
| role       | VARCHAR(10)  | `user` (default) or `admin`        |
| created_at | TIMESTAMP    | Defaults to the current time       |

**posts**

| Column     | Type         | Notes                                   |
| ---------- | ------------ | --------------------------------------- |
| id         | SERIAL       | Primary key                             |
| title      | VARCHAR(255) | Required                                |
| content    | TEXT         | Required                                |
| author_id  | INTEGER      | Foreign key to `users.id` (cascade)     |
| created_at | TIMESTAMP    | Defaults to the current time            |

## API Endpoints

### Authentication

| Method | Endpoint             | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| POST   | `/api/auth/register` | No   | Create a new account |
| POST   | `/api/auth/login`    | No   | Log in and get a JWT |

### Posts

| Method | Endpoint          | Auth             | Description                        |
| ------ | ----------------- | ---------------- | ---------------------------------- |
| GET    | `/api/posts`      | No               | List all posts                     |
| POST   | `/api/posts`      | Yes              | Create a post                      |
| DELETE | `/api/posts/:id`  | Yes (owner/admin)| Delete a post                      |

Protected endpoints require this header:

```
Authorization: Bearer <token>
```

## Usage Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","email":"ahmed@example.com","password":"123456"}'
```

Response `201`:

```json
{ "id": 1, "email": "ahmed@example.com" }
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"123456"}'
```

Response `200`:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Create a post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My first post","content":"Hello world!"}'
```

### Get all posts

```bash
curl http://localhost:3000/api/posts
```

### Delete a post

```bash
curl -X DELETE http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer <token>"
```

## Error Handling

All errors are returned in the same format:

```json
{ "success": false, "message": "Description of the error" }
```

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 400    | Missing or invalid input                          |
| 401    | Missing, invalid or expired token / wrong login   |
| 403    | Authenticated but not allowed to perform the action |
| 404    | Resource not found                                |
| 409    | Email already exists                              |
| 500    | Unexpected server error                           |

## Creating an Admin

Registration always creates a regular `user`. To promote an account to admin, run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Security Notes

- Passwords are never stored in plain text.
- Never commit your `.env` file. It is listed in `.gitignore`.
- Use a long, random `JWT_SECRET` in production.
- All SQL queries are parameterized.

## License

This project is for educational purposes.
