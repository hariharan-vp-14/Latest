# Frontend-Backend Integration Setup

## Quick Start Guide

### Prerequisites
- Node.js installed
- MongoDB running locally
- Backend running on http://localhost:4000

### Step 1: Start the Backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Server is running on port 4000
✅ Database connected
```

### Step 2: Open Frontend

```bash
# Open fetalent/index.html in your browser
# Or use a local server:
python -m http.server 8000  # Python 3
http-server                 # Node.js (npm install -g http-server)
```

Then navigate to:
```
http://localhost:8000/fetalent/
```

### Step 3: Test the Integration

1. **Check API Connection** (in browser console):
   ```javascript
   console.log(api.baseURL);  // Should output: http://localhost:4000
   ```

2. **Try Registration**:
   - Click "Sign Up" button
   - Fill in the registration form with test data:
     ```
     First Name: John
     Last Name: Doe
     Age: 21
     Email: john@example.com
     Password: password123 (minimum 8 characters)
     Education Level: Bachelor's
     Institution: Test University
     Disability Type: None
     ```
   - Submit the form
   - Check browser console and backend console for requests/responses

3. **Check Backend Request** (Backend console should show):
   ```
   POST /user/register - 201 Created
   ```

4. **Verify Email Storage**:
   - Open MongoDB and check if user was created in database
   - Check browser localStorage for token storage

## File Structure

```
Talent/
├── backend/                          # Backend API
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── hostmodel.js
│   │   ├── administratormodel.js
│   │   └── event.model.js
│   ├── controllers/                 # Business logic
│   ├── routes/                      # API endpoints
│   ├── services/                    # Email & helpers
│   ├── middleware/                  # Auth & validation
│   ├── app.js                       # Express setup
│   ├── server.js                    # Entry point
│   └── package.json
│
└── fetalent/                         # Frontend
    ├── index.html                   # Main HTML
    ├── script.js                    # Frontend logic
    ├── styles.css                   # Styling
    ├── api.js                       # NEW: API Service
    ├── api-integration-examples.js  # NEW: Example functions
    └── README.md
```

## Key Features Implemented

### ✅ User Management
- [x] User registration with email verification
- [x] User login/logout
- [x] Password reset functionality
- [x] Profile management
- [x] Age, education level, institution, disability type tracking

### ✅ Host Management
- [x] Host registration
- [x] Host login/logout
- [x] Host profile
- [x] Password reset

### ✅ Administrator Management
- [x] Admin registration (limited to 5)
- [x] Admin login/logout
- [x] Admin profile
- [x] Password reset

### ✅ Event Management
- [x] Create events
- [x] List all events
- [x] Get event details
- [x] Register for events
- [x] Unregister from events
- [x] User's events list

### ✅ Security
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Token blacklisting on logout
- [x] Email verification
- [x] Password reset tokens

## API Endpoints Available

### User Endpoints
```
POST   /user/register          - Register new user
POST   /user/login             - Login user
GET    /user/verify/:token     - Verify email
POST   /user/forgot-password   - Request password reset
POST   /user/reset-password/:token - Reset password
GET    /user/profile           - Get user profile (auth required)
GET    /user/logout            - Logout (auth required)
```

### Host Endpoints
```
POST   /host/register          - Register new host
POST   /host/login             - Login host
GET    /host/verify/:token     - Verify email
POST   /host/forgot-password   - Request password reset
POST   /host/reset-password/:token - Reset password
GET    /host/profile           - Get host profile (auth required)
GET    /host/logout            - Logout (auth required)
```

### Administrator Endpoints
```
POST   /administrator/register  - Register new admin (max 5)
POST   /administrator/login     - Login admin
GET    /administrator/verify/:token - Verify email
POST   /administrator/forgot-password - Request password reset
POST   /administrator/reset-password/:token - Reset password
GET    /administrator/profile    - Get admin profile (auth required)
GET    /administrator/logout     - Logout (auth required)
```

### Event Endpoints
```
POST   /event/create           - Create new event
GET    /event/all              - Get all events
GET    /event/:id              - Get event details
PUT    /event/:id              - Update event
DELETE /event/:id              - Delete event
POST   /event/:id/register     - Register for event
POST   /event/:id/unregister   - Unregister from event
GET    /event/my-events        - Get user's events (auth required)
```

## Testing with Example Data

### Test User Registration
```javascript
const testUser = {
  fullname: {
    firstname: "Jane",
    lastname: "Smith"
  },
  age: 22,
  email: "jane.smith@example.com",
  password: "testpass123",
  confirmPassword: "testpass123",
  educationLevel: "Bachelor's",
  institution: "Harvard University",
  disabilityType: "Hearing"
};

await api.registerUser(testUser);
```

### Test Event Creation
```javascript
const testEvent = {
  title: "Tech Conference 2024",
  description: "Annual tech conference",
  date: "2024-12-01",
  time: "14:00",
  duration: 120,
  link: "https://zoom.us/meeting/123",
  accessibility: ["captioning", "screen-reader"],
  maxParticipants: 100
};

await api.createEvent(testEvent);
```

## Environment Variables

Create a `.env` file in the backend directory:

```
DB_CONNECT=mongodb://localhost:27017/talent
JWT_SECRET=your_jwt_secret_key_here
PORT=4000
BASE_URL=http://localhost:4000
FRONTEND_URL=http://localhost:8000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Troubleshooting

### Backend not connecting
```
❌ Error: Failed to fetch
```
**Solution**: 
- Ensure backend is running on port 4000
- Check CORS is enabled in backend (app.js)
- Verify API_BASE_URL in api.js is correct

### CORS Error
```
❌ Cross-Origin Request Blocked
```
**Solution**:
- Backend has CORS enabled by default
- Check browser console for specific error
- Verify Content-Type header is set to 'application/json'

### Authentication Failed
```
❌ Invalid email or password
```
**Solution**:
- Verify credentials are correct
- Check user exists in MongoDB
- Ensure password meets requirements (min 8 characters)

### Email Verification Not Working
```
⚠️ Email not received
```
**Solution**:
- For development, use Ethereal (test email service) - already configured
- Check backend console for email preview URL
- For production, configure real Gmail or email service

### Database Connection Failed
```
❌ Cannot connect to MongoDB
```
**Solution**:
- Ensure MongoDB is running locally
- Check connection string in .env
- Default: mongodb://localhost:27017/talent

## Common Integration Tasks

### 1. Connect Login Form to Backend
```javascript
// In your form submit handler:
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

try {
  await handleUserLogin(email, password);
} catch (error) {
  console.error('Login failed:', error);
}
```

### 2. Display User Profile
```javascript
async function displayProfile() {
  const user = api.getCurrentUser();
  if (user) {
    document.getElementById('userName').textContent = 
      `${user.fullname.firstname} ${user.fullname.lastname}`;
    document.getElementById('userAge').textContent = user.age;
    document.getElementById('userInstitution').textContent = user.institution;
  }
}
```

### 3. Load and Display Events
```javascript
async function showEvents() {
  const events = await api.getAllEvents();
  events.forEach(event => {
    // Create HTML element for each event
    const eventDiv = document.createElement('div');
    eventDiv.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <button onclick="registerForEvent('${event._id}')">Register</button>
    `;
    document.getElementById('eventsContainer').appendChild(eventDiv);
  });
}
```

## Next Steps

1. ✅ API Service created (api.js)
2. ✅ Integration examples provided (api-integration-examples.js)
3. ⏭️ **TODO**: Update script.js to use API instead of mock data
4. ⏭️ **TODO**: Connect all forms to API endpoints
5. ⏭️ **TODO**: Implement error handling and validation
6. ⏭️ **TODO**: Add loading states and notifications
7. ⏭️ **TODO**: Test all user flows
8. ⏭️ **TODO**: Deploy to production

## Support & Debugging

### Enable Debug Mode
```javascript
// In browser console:
localStorage.setItem('debug', 'true');
```

### View All API Calls
```javascript
// In browser console:
// DevTools Network tab shows all HTTP requests
```

### Check Authentication Status
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Authenticated:', api.isAuthenticated());
```

## Additional Resources

- [Backend README](../backend/README.md) - Backend documentation
- [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) - Detailed integration guide
- [API Integration Examples](./api-integration-examples.js) - Code examples

---

**Status**: ✅ Ready for Integration
**Last Updated**: January 15, 2026
**Version**: 1.0.0
