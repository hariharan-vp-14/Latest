# Talent Backend API

This is the backend API for the Talent application, built with Node.js, Express, and MongoDB. It provides user authentication and management features.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Token blacklisting for logout
- User profile retrieval

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Talent/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   DB_CONNECT=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```
   npm start
   ```

## User Model

The User model is defined using Mongoose and includes the following fields:

### Schema

```javascript
const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false, // Password is not selected by default for security
  },
  institution: {
    type: String,
  },
  address: {
    type: String,
  },
  designation: {
    type: String,
  },
  contact: {
    type: String,
  },
  totalNumberPhysical: {
    type: Number,
  },
  socketId: {
    type: String, // Used to track live location
  },
});
```

### Methods

- `generateAuthToken()`: Generates a JWT token for the user, valid for 24 hours.
- `comparePassword(password)`: Compares the provided password with the hashed password.
- `hashPassword(password)` (static): Hashes the password using bcrypt.

## API Endpoints

### POST /register

Registers a new user.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "institution": "Example University",
  "address": "123 Main St",
  "designation": "Student",
  "contact": "123-456-7890",
  "totalNumberPhysical": 10
}
```

**Validation:**
- Email must be valid
- First name must be at least 3 characters
- Password must be at least 6 characters
- totalNumberPhysical must be a number (if provided)

**Responses:**

- **201 Created:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "institution": "Example University",
      "address": "123 Main St",
      "designation": "Student",
      "contact": "123-456-7890",
      "totalNumberPhysical": 10
    }
  }
  ```

- **400 Bad Request (Validation Errors):**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

- **400 Bad Request (User Exists):**
  ```json
  {
    "message": "User already exists"
  }
  ```

### POST /login

Logs in an existing user.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation:**
- Email must be valid
- Password must be at least 6 characters

**Responses:**

- **200 OK:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "institution": "Example University",
      "address": "123 Main St",
      "designation": "Student",
      "contact": "123-456-7890",
      "totalNumberPhysical": 10
    }
  }
  ```

- **400 Bad Request (Validation Errors):**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

- **401 Unauthorized:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### GET /profile

Retrieves the authenticated user's profile.

**Headers:**
- Authorization: Bearer <token> (or token in cookies)

**Responses:**

- **200 OK:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "institution": "Example University",
      "address": "123 Main St",
      "designation": "Student",
      "contact": "123-456-7890",
      "totalNumberPhysical": 10
    }
  }
  ```

- **401 Unauthorized:**
  ```json
  {
    "message": "unauthorized"
  }
  ```

### GET /logout

Logs out the authenticated user by clearing the token cookie and blacklisting the token.

**Headers:**
- Authorization: Bearer <token> (or token in cookies)

**Responses:**

- **200 OK:**
  ```json
  {
    "message": "Logged out"
  }
  ```

- **401 Unauthorized:**
  ```json
  {
    "message": "unauthorized"
  }
  ```

## Authentication

The API uses JWT for authentication. Tokens are sent in cookies or via Authorization header. Tokens are valid for 24 hours and are blacklisted upon logout.

## Database

Uses MongoDB with Mongoose for data modeling. Connection string is set via `DB_CONNECT` environment variable.

## Dependencies

- express
- mongoose
- bcrypt
- jsonwebtoken
- express-validator
- dotenv (for environment variables)

## License

[Add your license here]