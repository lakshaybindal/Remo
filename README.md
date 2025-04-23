# README Generator

This project provides a web application that generates README files for GitHub repositories using the Gemini API.  Users can sign up, sign in, and then submit a GitHub repository URL to generate a README.md file.


## Installation Steps

**Backend:**

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up Prisma: `npx prisma generate`
4. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    JWT_SECRET=<your_jwt_secret> 
    DATABASE_URL=<your_database_url>
    ```

**Frontend:**

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`


## API Routes and Dummy JSON Responses

**`/user/signup` (POST)**

* **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "apiKey": "YOUR_API_KEY"
}
```

* **Response (200 OK):**
```json
{
  "token": "generated_jwt_token"
}
```

**`/user/signin` (POST)**

* **Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

* **Response (200 OK):**
```json
{
  "msg": "Signin Success",
  "token": "generated_jwt_token"
}
```

**`/user/repo` (POST)**

* **Request Body:**
```json
{
  "repourl": "https://github.com/username/repo.git"
}
```
* **Headers:**
```
Authorization: Bearer <generated_jwt_token>
```

* **Response (200 OK):**
```json
{
  "readme": "# Generated README\nThis is a generated README file." 
}
```


## Run Locally

**Backend:**

1.  Navigate to the `backend` directory: `cd backend`
2.  Start the server: `npm run dev`

**Frontend:**

1. Navigate to the `frontend` directory: `cd frontend`
2. Start the development server: `npm run dev`

The frontend application will be accessible at `http://localhost:5173` by default.  The backend server runs on port 3000.


## Project Description

This full-stack application allows users to generate README files for their GitHub repositories automatically. It leverages the Gemini API for generating the README content. The backend is built with Node.js and Express.js and Prisma ORM, while the frontend uses React, Tailwind CSS, and Vite.  The application uses JWT for authentication.  A user needs to sign up with their Google Gemini API key to use the service.  The application clones the GitHub repository temporarily to a local directory, analyzes the TypeScript files within the project, sends the code to the Gemini API for generating the README and removes the repository directory, and finally returns the README content to the frontend to be displayed or copied.
