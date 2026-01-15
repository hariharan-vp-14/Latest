# Talent Backend API

This is the backend API for the Talent application, built with Node.js, Express, and MongoDB. It provides comprehensive user authentication and management for different user roles.

## Features

- **User Management**: Individual user registration with education details (age, education level, institution)
- **Host Management**: Host registration and profile management
- **Administrator Management**: Limited to maximum 5 administrators with full system control
- **Event Management**: Event creation and management system
- **Email Verification**: Secure email verification for all user types
- **Password Reset**: Forgot password and password reset functionality
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Password Security**: Bcrypt hashing for all passwords
- **Token Blacklisting**: Logout with token invalidation
- **Role-Based Access**: Middleware support for role-based access control

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hariharan-vp-14/Talent.git
   cd Talent/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   DB_CONNECT=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=4000
   BASE_URL=http://localhost:4000
   FRONTEND_URL=http://localhost:3000
   EMAIL_USER=<your-gmail-address>
   EMAIL_PASS=<your-gmail-app-password>
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── controllers/          # Route controllers (business logic)
│   ├── user.controller.js
│   ├── host.controllers.js
│   ├── administrator.controller.js
│   └── event.controller.js
├── models/              # Mongoose schemas
│   ├── user.model.js
│   ├── hostmodel.js
│   ├── administratormodel.js
│   ├── event.model.js
│   └── blacklistToken.model.js
├── routes/              # API routes
│   ├── user.routes.js
│   ├── host.routes.js
│   ├── administrator.routes.js
│   └── event.routes.js
├── services/            # Business logic services
│   ├── user.services.js
│   ├── host.services.js
│   ├── administrator.services.js
│   ├── event.services.js
│   └── email.services.js
├── middleware/          # Express middleware
│   ├── auth.middleware.js
│   └── role.middleware.js
├── db/                  # Database connection
│   └── db.js
├── app.js               # Express app configuration
├── server.js            # Server entry point
└── package.json         # Dependencies
```

## User Model

Individual user registration with education and disability information.

### Schema Fields
- `fullname.firstname` - First name (required, min 3 characters)
- `fullname.lastname` - Last name (required)
- `age` - Age (required, numeric)
- `email` - Email address (required, unique)
- `password` - Password (required, min 8 characters, hashed)
- `educationLevel` - Education level (required, enum: High School, Bachelor's, Master's, PhD, Diploma, Other)
- `institution` - University/College name (required)
- `disabilityType` - Disability type (optional, enum: None, Physical, Visual, Hearing, Neurological, Multiple, Other)
- `isVerified` - Email verification status
- `verificationToken` - Token for email verification
- `resetPasswordToken` - Token for password reset
- `timestamps` - Created and updated timestamps

### User Endpoints

#### POST /user/register
Register a new individual user with email verification.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "age": 21,
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "educationLevel": "Bachelor's",
  "institution": "University Name",
  "disabilityType": "None"
}
```

**Response:** 201 Created
```json
{
  "message": "User registered. Please verify your email before login."
}
```

#### POST /user/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "token": "jwt-token-here",
  "user": { /* user object */ }
}
```

#### GET /user/verify/:token
Verify user email address.

#### POST /user/forgot-password
Request password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST /user/reset-password/:token
Reset password with verification token.

**Request Body:**
```json
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### GET /user/profile
Get authenticated user profile (requires auth token).

#### GET /user/logout
Logout user and blacklist token (requires auth token).

---

## Administrator Model

System administrators with maximum limit of 5 administrators.

### Key Features
- **Registration Limit**: Maximum 5 administrators can be registered
- **Email Verification**: Required before login
- **Password Reset**: Full password reset functionality

### Administrator Endpoints

#### POST /administrator/register
Register a new administrator (only if less than 5 exist).

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Admin",
    "lastname": "User"
  },
  "email": "admin@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:** 201 Created
```json
{
  "message": "Administrator registered. Please verify your email before login."
}
```

**Response:** 400 Bad Request (if 5 admins exist)
```json
{
  "message": "Maximum of 5 administrators allowed. Cannot register more administrators."
}
```

#### POST /administrator/login
Login administrator.

#### GET /administrator/verify/:token
Verify administrator email.

#### POST /administrator/forgot-password
Request administrator password reset.

#### POST /administrator/reset-password/:token
Reset administrator password.

#### GET /administrator/profile
Get authenticated administrator profile (requires auth token).

#### GET /administrator/logout
Logout administrator (requires auth token).

---

## Host Model

Host registration for event hosting and management.

### Host Endpoints

#### POST /host/register
Register a new host.

#### POST /host/login
Login host.

#### GET /host/verify/:token
Verify host email.

#### POST /host/forgot-password
Request password reset.

#### POST /host/reset-password/:token
Reset password.

#### GET /host/profile
Get authenticated host profile (requires auth token).

#### GET /host/logout
Logout host (requires auth token).

---

## Event Model

Event creation and management system.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- Tokens are valid for 24 hours
- Tokens can be sent via Authorization header: `Authorization: Bearer <token>`
- Tokens are also stored in httpOnly cookies for security
- Tokens are blacklisted upon logout to prevent reuse
- Password hashing uses bcrypt with salt rounds of 10

## Database

Uses MongoDB with Mongoose for data modeling:
- Connection string configured via `DB_CONNECT` environment variable
- Automatic schema validation and type checking
- Indexes on email fields for unique constraints
- Timestamps (createdAt, updatedAt) on all models

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation
- **nodemailer** - Email sending
- **dotenv** - Environment variables
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing

## Recent Updates (v2.0)

### New Features
✅ Individual User model with education details
✅ User registration with email verification
✅ User profile with age, education level, institution, and disability type
✅ Administrator registration with maximum 5 limit
✅ Complete user authentication system with password reset
✅ Email verification and password reset functionality for all user types
✅ Comprehensive error handling and validation

### Files Added
- `backend/models/user.model.js` - Individual user schema
- `backend/controllers/user.controller.js` - User authentication logic
- `backend/services/user.services.js` - User service layer
- `backend/routes/user.routes.js` - User API endpoints
- `backend/models/administratormodel.js` - Administrator schema
- `backend/controllers/administrator.controller.js` - Admin logic
- `backend/models/hostmodel.js` - Host schema
- `backend/models/event.model.js` - Event schema
- `backend/services/email.services.js` - Email functionality
- `backend/middleware/role.middleware.js` - Role-based access control

### Administrator Limit
- Maximum 5 administrators can be registered in the system
- Registration attempt beyond 5 admins returns error: "Maximum of 5 administrators allowed"

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support or questions, please create an issue on GitHub: https://github.com/hariharan-vp-14/Talent/issues