# Frontend-Backend Integration Guide

## Overview
This document explains how the frontend (fetalent) is integrated with the backend API.

## Architecture

```
Frontend (fetalent/)
├── index.html          # Main HTML file
├── script.js           # Frontend logic
├── styles.css          # Styling
├── api.js              # NEW: API Service Layer (handles all backend communication)
└── Integration Guide   # This file

Backend (backend/)
├── models/             # Database schemas
├── controllers/        # Business logic
├── routes/             # API endpoints
├── services/           # Helper functions
└── middleware/         # Authentication & validation
```

## API Service (api.js)

The `api.js` file provides a centralized API service class that handles all communication with the backend.

### Features:
- ✅ Automatic token management
- ✅ Error handling and logging
- ✅ Session management (localStorage)
- ✅ Type safety with JSDoc comments
- ✅ Support for all user types (User, Host, Administrator)
- ✅ Event management endpoints

### Usage Example:

```javascript
// Register a new user
const userData = {
  fullname: {
    firstname: "John",
    lastname: "Doe"
  },
  age: 21,
  email: "john@example.com",
  password: "password123",
  confirmPassword: "password123",
  educationLevel: "Bachelor's",
  institution: "University Name",
  disabilityType: "None"
};

try {
  const response = await api.registerUser(userData);
  console.log('User registered:', response);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

## Available API Methods

### User Management

#### Registration & Authentication
```javascript
// User Register
await api.registerUser(userData);

// User Login
await api.loginUser(email, password);

// Verify Email
await api.verifyUserEmail(token);

// Forgot Password
await api.userForgotPassword(email);

// Reset Password
await api.userResetPassword(token, password, confirmPassword);

// Get Profile
await api.getUserProfile();

// Logout
await api.userLogout();
```

### Host Management

```javascript
// Host Register
await api.registerHost(hostData);

// Host Login
await api.loginHost(email, password);

// Verify Email
await api.verifyHostEmail(token);

// Forgot Password
await api.hostForgotPassword(email);

// Reset Password
await api.hostResetPassword(token, password, confirmPassword);

// Get Profile
await api.getHostProfile();

// Logout
await api.hostLogout();
```

### Administrator Management

```javascript
// Admin Register
await api.registerAdmin(adminData);

// Admin Login
await api.loginAdmin(email, password);

// Verify Email
await api.verifyAdminEmail(token);

// Forgot Password
await api.adminForgotPassword(email);

// Reset Password
await api.adminResetPassword(token, password, confirmPassword);

// Get Profile
await api.getAdminProfile();

// Logout
await api.adminLogout();
```

### Event Management

```javascript
// Create Event
await api.createEvent(eventData);

// Get All Events
await api.getAllEvents(filters);

// Get Event by ID
await api.getEventById(eventId);

// Update Event
await api.updateEvent(eventId, eventData);

// Delete Event
await api.deleteEvent(eventId);

// Register for Event
await api.registerForEvent(eventId);

// Unregister from Event
await api.unregisterFromEvent(eventId);

// Get User's Events
await api.getUserEvents();
```

## Authentication Flow

1. **User Registration/Login**: 
   - Frontend calls `api.registerUser()` or `api.loginUser()`
   - Backend returns token and user data
   - API service stores token in localStorage and sets Authorization header

2. **Authenticated Requests**:
   - All subsequent requests automatically include the Authorization header
   - Token is sent in `Authorization: Bearer <token>` format

3. **Logout**:
   - Frontend calls `api.userLogout()`
   - Token is cleared from localStorage
   - User is redirected to login page

4. **Session Persistence**:
   - Token and user data are persisted in localStorage
   - User stays logged in even after page refresh
   - Token is validated on each request

## Configuration

### Backend URL
Update the baseURL in `api.js` if your backend is running on a different port:

```javascript
// Default: http://localhost:4000
// Change this line if needed:
this.baseURL = 'http://localhost:4000';
```

### Environment Variables (Optional)
You can add an `.env` file in the frontend root:
```
VITE_API_URL=http://localhost:4000
```

Then update api.js:
```javascript
this.baseURL = process.env.VITE_API_URL || 'http://localhost:4000';
```

## Error Handling

The API service handles various error scenarios:

```javascript
try {
  await api.loginUser(email, password);
} catch (error) {
  if (error.message.includes('Invalid email')) {
    // Handle invalid email
  } else if (error.message.includes('Invalid password')) {
    // Handle invalid password
  } else if (error.status === 401) {
    // Handle authentication error
  } else {
    // Handle other errors
  }
}
```

## Response Format

### Success Response
```javascript
{
  message: "User registered. Please verify your email before login.",
  user: {
    _id: "ObjectId",
    fullname: { firstname: "John", lastname: "Doe" },
    email: "john@example.com",
    age: 21,
    educationLevel: "Bachelor's",
    institution: "University Name",
    createdAt: "2024-01-15T10:30:00Z"
  },
  token: "jwt-token-here"
}
```

### Error Response
```javascript
{
  message: "Invalid email or password",
  errors: [
    {
      msg: "First name must be at least 3 characters long",
      param: "fullname.firstname",
      location: "body"
    }
  ]
}
```

## Integration with Script.js

Update `script.js` to use the API service instead of mock data:

```javascript
// Instead of loading mock data
// Replace this:
// const conferences = defaultData.approvedConferences;

// With this:
async function loadConferences() {
  try {
    const response = await api.getAllEvents();
    this.state.conferences = response.events || [];
    this.updateUI();
  } catch (error) {
    console.error('Failed to load conferences:', error);
  }
}

// For user registration
async function registerUser(userData) {
  try {
    const response = await api.registerUser(userData);
    showNotification('Registration successful! Please verify your email.');
    // Redirect to login or verification page
  } catch (error) {
    showNotification('Registration failed: ' + error.message, 'error');
  }
}
```

## Testing the Integration

1. **Start the Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Open Frontend in Browser**:
   ```bash
   # Open fetalent/index.html in your browser
   ```

3. **Test Registration**:
   - Open browser console (F12)
   - Try registering a user
   - Check console for API requests and responses
   - Check backend console for incoming requests

4. **Monitor API Calls**:
   - Open DevTools Network tab
   - Perform actions like login, registration
   - Verify requests go to `http://localhost:4000`

## Debugging

### Check API Connection
```javascript
// In browser console:
console.log(api.baseURL);  // Should show http://localhost:4000
console.log(api.isAuthenticated());  // Shows if user is logged in
console.log(api.getCurrentUser());  // Shows current user data
```

### View Stored Token
```javascript
// In browser console:
localStorage.getItem('token');
localStorage.getItem('user');
```

### Clear Local Storage (Logout)
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

## Next Steps

1. **Update HTML Forms**: Connect registration and login forms to API methods
2. **Create Form Validation**: Validate user input before sending to API
3. **Add Error Messages**: Display user-friendly error messages
4. **Implement Loading States**: Show loading indicators during API calls
5. **Add Success Notifications**: Notify users of successful operations
6. **Implement Role-Based UI**: Show different UI based on user role
7. **Add Protected Routes**: Restrict access to pages based on authentication
8. **Implement Refresh Token Logic**: For better security with token rotation

## CORS Configuration

The backend is configured with CORS enabled. If you get CORS errors:

1. Check backend `app.js` has CORS enabled:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

2. Ensure correct API URL in `api.js`

3. Check browser console for specific CORS error messages

## Support

For issues or questions:
1. Check the browser console (F12) for error messages
2. Check the backend console for request errors
3. Verify backend is running on http://localhost:4000
4. Check database connection in backend

---

**Last Updated**: January 15, 2026
**Version**: 1.0
**Status**: ✅ Active and Integrated
