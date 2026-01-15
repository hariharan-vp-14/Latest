# Quick Reference Card - Frontend-Backend Integration

## 🚀 Getting Started (5 minutes)

### Step 1: Start Backend
```bash
cd backend
npm start
```
✅ Backend running on: **http://localhost:4000**

### Step 2: Open Frontend
```bash
# Open fetalent/index.html in browser
# or use local server:
python -m http.server 8000
```
✅ Frontend running on: **http://localhost:8000**

### Step 3: Test in Browser Console
```javascript
// Check API is ready
console.log(api.baseURL);  // http://localhost:4000

// Try registering a user
await api.registerUser({
  fullname: { firstname: "John", lastname: "Doe" },
  age: 21,
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
  educationLevel: "Bachelor's",
  institution: "University",
  disabilityType: "None"
});
```

---

## 📚 Essential API Methods

### Authentication
```javascript
// Register
await api.registerUser(userData);

// Login
await api.loginUser(email, password);

// Logout
await api.userLogout();

// Check if logged in
api.isAuthenticated();

// Get current user
api.getCurrentUser();
```

### Events
```javascript
// Get all events
await api.getAllEvents();

// Get single event
await api.getEventById(eventId);

// Register for event
await api.registerForEvent(eventId);

// Create event (Host only)
await api.createEvent(eventData);
```

### User Profile
```javascript
// Get profile
await api.getUserProfile();

// Forgot password
await api.userForgotPassword(email);

// Reset password
await api.userResetPassword(token, password, confirmPassword);
```

---

## 🔧 Common Integration Snippets

### Connect Form to Registration
```javascript
const form = document.getElementById('signupForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userData = {
    fullname: {
      firstname: form.firstName.value,
      lastname: form.lastName.value
    },
    age: parseInt(form.age.value),
    email: form.email.value,
    password: form.password.value,
    confirmPassword: form.confirmPassword.value,
    educationLevel: form.educationLevel.value,
    institution: form.institution.value,
    disabilityType: form.disabilityType.value || 'None'
  };

  try {
    await api.registerUser(userData);
    alert('Registration successful! Check your email.');
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
```

### Show/Hide Content Based on Login
```javascript
function updateUI() {
  const authSection = document.getElementById('authSection');
  const dashboardSection = document.getElementById('dashboardSection');
  
  if (api.isAuthenticated()) {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    
    const user = api.getCurrentUser();
    document.getElementById('userName').textContent = 
      `${user.fullname.firstname} ${user.fullname.lastname}`;
  } else {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
  }
}

// Call on page load
updateUI();
```

### Load and Display Events
```javascript
async function displayEvents() {
  try {
    const events = await api.getAllEvents();
    
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event-card';
      eventDiv.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p>📅 ${event.date} at ${event.time}</p>
        <button onclick="joinEvent('${event._id}')">Register</button>
      `;
      eventsList.appendChild(eventDiv);
    });
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

// Call on page load
displayEvents();
```

### Handle Login
```javascript
async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await api.loginUser(email, password);
    console.log('✅ Logged in as:', response.user.fullname.firstname);
    updateUI();
    window.location.href = '#dashboard';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}
```

---

## 🐛 Quick Debugging

### Check Status
```javascript
// In browser console:
console.log({
  apiUrl: api.baseURL,
  isLoggedIn: api.isAuthenticated(),
  user: api.getCurrentUser(),
  token: localStorage.getItem('token')
});
```

### Clear Everything (Logout)
```javascript
localStorage.clear();
location.reload();
```

### Check Recent API Calls
```javascript
// Open DevTools → Network tab
// Look for requests to http://localhost:4000
```

### View Database Records
```javascript
// MongoDB Compass or MongoDB Atlas
// Check 'talent' database → 'users' collection
```

---

## 📁 File Locations

| File | Location | Purpose |
|------|----------|---------|
| API Service | `fetalent/api.js` | All backend calls |
| Examples | `fetalent/api-integration-examples.js` | Working code snippets |
| Setup Guide | `SETUP.md` | Quick start (5 min) |
| Full Docs | `INTEGRATION_GUIDE.md` | Complete reference |
| Summary | `INTEGRATION_COMPLETE.md` | Overview & next steps |
| Backend | `backend/` | Node.js/Express API |

---

## ✅ Endpoint Quick Reference

### User (`/user`)
```
POST   /user/register              Create user
POST   /user/login                 Login user
GET    /user/verify/:token         Verify email
POST   /user/forgot-password       Reset request
POST   /user/reset-password/:token Reset password
GET    /user/profile               Get profile
GET    /user/logout                Logout
```

### Host (`/host`)
```
POST   /host/register
POST   /host/login
... (same structure as user)
```

### Admin (`/administrator`)
```
POST   /administrator/register     (Max 5 admins)
POST   /administrator/login
... (same structure as user)
```

### Events (`/event`)
```
POST   /event/create               Create event
GET    /event/all                  List all events
GET    /event/:id                  Get event details
PUT    /event/:id                  Update event
DELETE /event/:id                  Delete event
POST   /event/:id/register         Join event
POST   /event/:id/unregister       Leave event
GET    /event/my-events            My registered events
```

---

## 🔐 Security Notes

✅ **Token Management**: Automatically handled by api.js
✅ **CORS**: Already configured on backend
✅ **Password**: Minimum 8 characters, auto-hashed
✅ **Email**: Verification required before login
✅ **Session**: Persists with localStorage
✅ **Logout**: Blacklists token on backend

---

## 📊 Data Models

### User Registration Data
```javascript
{
  fullname: {
    firstname: string (required, 3+ chars),
    lastname: string (required)
  },
  age: number (required),
  email: string (required, unique),
  password: string (required, 8+ chars),
  confirmPassword: string (must match),
  educationLevel: string (required),
  institution: string (required),
  disabilityType: string (optional)
}
```

### Event Data
```javascript
{
  title: string,
  description: string,
  date: string (YYYY-MM-DD),
  time: string (HH:MM),
  duration: number (minutes),
  link: string (Zoom/Meet URL),
  accessibility: array,
  maxParticipants: number
}
```

---

## 🎯 Integration Checklist

- [ ] Backend running on port 4000
- [ ] Frontend can access api.js
- [ ] Can call api.registerUser() from console
- [ ] Registration form connected to API
- [ ] Login form connected to API
- [ ] Events displaying from API
- [ ] Can register for events
- [ ] Logout works correctly
- [ ] Token persists after refresh
- [ ] Profile loads correctly

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check backend is running on port 4000 |
| CORS error | Backend has CORS enabled by default |
| "Invalid token" | Clear localStorage and log in again |
| Email not received | Check backend console for preview URL |
| Data not saving | Check MongoDB is running |
| 404 errors | Verify endpoint path in api.js |

---

## 📞 Support Resources

1. **Read First**: SETUP.md (5 min read)
2. **Reference**: INTEGRATION_GUIDE.md (when needed)
3. **Examples**: api-integration-examples.js (copy & paste)
4. **Console**: F12 → Console tab (debug & test)
5. **Network**: F12 → Network tab (monitor API calls)

---

## 🎓 Next Steps

1. ✅ Read SETUP.md (5 minutes)
2. ✅ Start backend and frontend
3. ✅ Test API in browser console
4. 📝 Connect registration form
5. 📝 Connect login form
6. 📝 Load events from API
7. 📝 Add user profile display
8. 📝 Test all features
9. 📝 Deploy to production

---

**Status**: ✅ READY TO INTEGRATE
**Backend**: Running ✅
**Frontend**: Ready ✅
**API**: Complete ✅
**Docs**: Comprehensive ✅

🚀 **Happy Coding!**

---

*Last Updated: January 15, 2026*
*Version: 1.0*
*Repository: https://github.com/hariharan-vp-14/Talent*
