# Frontend Integration Testing Guide

## Overview
The frontend has been successfully connected to the backend API. All forms now communicate with the Node.js/Express backend instead of using mock data.

## What Was Updated

### 1. **Form Handlers Connected to Backend**
- **Registration Forms** → `api.registerUser()` / `api.registerHost()`
- **Login Form** → `api.loginUser()`
- **Event Registration** → `api.registerForEvent()`
- **Create Event** → `api.createEvent()`
- **Logout** → `api.userLogout()`

### 2. **Data Loading**
- Events now load from `api.getAllEvents()` instead of mock data
- User profile loads from `api.getUserProfile()` on session restore
- JWT tokens stored in localStorage for session persistence

### 3. **Authentication Flow**
- Automatic token restoration on page load
- Session maintained across browser refreshes
- Token blacklisting on logout

## Testing the Integration

### Prerequisites
1. **Backend Server Running**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend should be running on `http://localhost:4000`

2. **MongoDB Running**
   - Make sure MongoDB is running locally or update the connection string in `backend/db/db.js`

3. **Frontend Server Running**
   - Open `fetalent/index.html` in a browser or serve it via a local server

### Step-by-Step Testing

#### Test 1: User Registration
1. Click "Sign Up" button
2. Select "Participant" from the sign-up role selector
3. Fill in the registration form:
   - First Name: `John`
   - Last Name: `Doe`
   - Age: `25`
   - Education Level: `undergraduate`
   - Institution: `Tech University`
   - Email: `john@example.com`
   - Disability Type: `none`
   - Password: `Password123!`
   - Confirm Password: `Password123!`
4. Click "Create Account"
5. **Expected Result**: Success notification, automatic redirect to profile modal

#### Test 2: User Login
1. Click "Sign In" button
2. Enter the email and password from the registration
3. Click "Sign In"
4. **Expected Result**: Success notification, profile modal opens with user data

#### Test 3: Get All Events
1. Login successfully (Test 2)
2. Scroll to the "Conferences" section
3. **Expected Result**: Events load from backend (initially empty, or events created by hosts)

#### Test 4: Host Registration
1. Click "Sign Up" button
2. Select "Host" from the sign-up role selector
3. Fill in the host registration form:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane@example.com`
   - Institution: `Tech Institute`
   - Designation: `Professor`
   - Contact: `9876543210`
   - Address: `123 Tech Street`
   - Password: `Password123!`
   - Confirm Password: `Password123!`
4. Click "Create Account"
5. **Expected Result**: Host account created successfully

#### Test 5: Create Event (As Host)
1. Login as a host (Test 4)
2. Look for "Create Event" button or option
3. Fill in event details:
   - Title: `Tech Summit 2024`
   - Description: `A summit about latest tech trends`
   - Date: A future date
   - Time: `14:00`
   - Duration: `120` (minutes)
   - Max Participants: `200`
   - Conference Link: `https://zoom.us/j/example`
   - Accessibility Features: Select relevant options
4. Click "Create Event"
5. **Expected Result**: Event created and marked as pending approval

#### Test 6: Register for Event (As Participant)
1. Login as a participant
2. View available events
3. Click "Register Now" on an approved event
4. **Expected Result**: Registration successful, button changes to "Already Registered"

#### Test 7: Session Persistence
1. Login as a participant
2. Refresh the page
3. **Expected Result**: User should still be logged in (session restored)

#### Test 8: Logout
1. Login as any user
2. Click the profile button and then "Logout"
3. Click "Sign In" again
4. **Expected Result**: Previously saved session is cleared

## API Endpoints Being Used

### User Management
- `POST /user/register` - Register new participant
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `GET /user/profile` - Get user profile
- `POST /user/verify-email/:token` - Email verification

### Host Management
- `POST /host/register` - Register new host
- `POST /host/profile` - Get host profile

### Events
- `GET /event` - Get all events
- `GET /event/:id` - Get event details
- `POST /event` - Create new event (host only)
- `POST /event/:id/register` - Register for event

### Administration
- `GET /administrator` - Get pending approvals

## Error Handling

The frontend now includes proper error handling:
- **Network Errors**: Displays error notification
- **Validation Errors**: Shows specific field errors
- **Authentication Errors**: Redirects to login
- **Loading States**: Shows loading spinner during API calls

## Features Implemented

✅ **Registration Flow**
- Email validation
- Password strength checking
- Duplicate email prevention
- Email verification (backend)

✅ **Login Flow**
- Email/password validation
- Token storage
- Session persistence
- Remember me functionality

✅ **Event Management**
- Load events from backend
- Create new events
- Register for events
- View event details
- Status tracking (upcoming, live, ended)

✅ **User Profile**
- Display user information
- Show registered events
- Logout functionality
- Session restoration

## Troubleshooting

### Events Not Loading
- Check if backend is running on `http://localhost:4000`
- Check browser console for errors
- Verify database connection

### Login Failing
- Verify user exists in database
- Check password is correct
- Look for validation error messages in console

### Registration Failing
- Check email is not already registered
- Verify all required fields are filled
- Check password meets requirements (8+ characters)

### API Calls Timing Out
- Verify backend server is running
- Check network connectivity
- Look for CORS errors in console

## Next Steps

1. **Deploy Backend**: Deploy the backend to a cloud service
2. **Update API URL**: Update the backend URL in `api.js` if deploying
3. **Email Configuration**: Configure email service for verification emails
4. **Admin Panel**: Test admin approval workflow for pending events
5. **User Profiles**: Implement user profile editing
6. **Event Filters**: Implement category and status filters

## Contact

For issues or questions, please check:
- Backend logs on console
- Browser developer console (F12)
- Network tab to see API requests/responses
