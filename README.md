# WTWR (What to Wear?): Back End

## Dominios de la Aplicación

- **Backend:** https://api.wtwrle.ignorelist.com
- **Frontend:** (https://www.wtwrle.ignorelist.com)

The back-end project is focused on creating a server for the WTWR application. This server provides functionality for managing users, clothing items, and likes. The goal is to create a secure and scalable API with proper authorization and data validation. Through this project, you'll gain a deeper understanding of working with MongoDB, Express.js, middleware, error handling, and deployment.

## Features

- RESTful API with full CRUD operations for clothing items
- User registration and login with hashed passwords
- JWT-based authentication
- Like/unlike functionality for clothing items
- Request validation using celebrate/Joi
- Centralized error handling
- MongoDB as the database
- Ready for deployment

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Celebrate & Joi for input validation
- ESLint for code quality
- Postman for API testing

## Development Tools & Dependencies

### Dependencies

- `express` — Web framework for Node.js
- `mongoose` — MongoDB object modeling
- `validator` — String validation and sanitization

### DevDependencies

- `eslint` — JavaScript linter for identifying and fixing problems
- `eslint-config-airbnb-base` — Airbnb's base JS style guide
- `eslint-config-prettier` — Turns off rules that conflict with Prettier
- `eslint-plugin-import` — Support for ES6+ `import/export` syntax
- `nodemon` — Automatically restarts the server on file changes
- `prettier` — Code formatter

## Running the Project

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/wtwr-backend.git
cd wtwr-backend
npm install
npm run start
npm run dev

```

**API Endpoints**

1. Authentication

- POST /signup — Register a new user

- POST /signin — Login a user

2. Users

- GET /users — Get all users

- GET /users/:userId — Get user by ID

- PATCH /users/me — Update profile info

- PATCH /users/me/avatar — Update profile avatar

3. Clothing Items

- GET /items — Get all items

- POST /items — Create a new item

- DELETE /items/:itemId — Delete an item by ID

- PUT /items/:itemId/likes — Like an item

- DELETE /items/:itemId/likes — Unlike an item
