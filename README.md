# Node.js Express Application

This is a Node.js application using the Express framework. It includes user authentication, task management, and validation middleware.

## Prerequisites

- Node.js @ v20.18.0
- Yarn or npm

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    yarn install
    # or
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```dotenv
    DB_USERNAME=
    DB_PASSWORD=
    DB_DATABASE=
    DB_HOST=
    DB_PORT=
    JWT_TOKEN_SECRET=
    ```

## Database Setup

1. Install Sequelize CLI:
    ```sh
    yarn add sequelize-cli --dev
    # or
    npm install sequelize-cli --save-dev
    ```

2. Create the database:
    ```sh
    yarn db:create
    # or
    npm run db:create
    ```

3. Run migrations:
    ```sh
    yarn db:migrate
    # or
    npm run db:migrate
    ```

## Running the Application

1. Start the server:
    ```sh
    yarn start
    # or
    npm start
    ```

2. The application will be running at `http://localhost:3000`.

## API Endpoints

### User Routes

- `POST /users/signup` - Create a new user
- `POST /users/login` - Login a user

### Task Routes

- `POST /tasks` - Create a new task (requires authentication)
- `PUT /tasks/:id` - Update a task (requires authentication)
- `GET /tasks` - Get all tasks (requires authentication)
- `GET /tasks/counts` - Get task counts (requires authentication)
- `DELETE /tasks/:id` - Delete a task (requires authentication)

## Middleware

- `validateTask` - Validation rules for creating and updating tasks
- `validationHandler` - Handles validation errors
- `authMiddleware` - Middleware for authenticating JWT tokens

## License

This project is licensed under the MIT License.
