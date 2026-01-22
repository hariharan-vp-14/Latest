# 🚀 Quick Start Guide - TalentConnect Frontend

## What's New? ✨

Your frontend has been completely revamped with:
- ✅ **Multi-role authentication** (User, Administrator, Host)
- ✅ **Role-specific registration forms** with all backend fields
- ✅ **Forgot password feature** for all user types
- ✅ **Profile page** showing user details (without password)
- ✅ **Logout button** with redirect to login
- ✅ **Protected routes** for authenticated users only
- ✅ **Light gray color scheme** throughout
- ✅ **Fully responsive design** for mobile, tablet, desktop
- ✅ **Easy-to-use navigation** with role-based menus

---

## 🎯 Getting Started

### Step 1: Install Dependencies
```bash
cd Talent/frontrct
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Step 3: Ensure Backend is Running
Make sure your backend is running on `http://localhost:4000`

---

## 📝 User Flows

### Registration Flow
1. Click **"Sign Up"** button
2. Choose registration type:
   - **User**: For participants (requires: first name, last name, email, age, education, institution, disability type, password)
   - **Administrator**: For admins (requires: first name, email, password)
   - **Host**: For event hosts (requires: first name, email, password + optional: institution, address, designation, contact, capacity)
3. Fill in required fields (marked with *)
4. Click **"Create Account"**
5. ✅ Redirected to home page

### Login Flow
1. Click **"Login"** button
2. Select user type: **User / Admin / Host**
3. Enter email and password
4. Click **"Sign In"**
5. ✅ Redirected to home page
6. Access profile by clicking user avatar in top-right corner

### Forgot Password Flow
1. On login page, click **"Forgot Password?"**
2. Enter your email address
3. Check your email for reset link
4. Click link and set new password
5. Return to login and sign in

### Profile Access
1. After login, click **user avatar** in top-right corner
2. Click **"Profile"** from dropdown
3. View all your information (no password shown)
4. Click **"Logout"** to exit

---

## 🎨 Color Scheme

The entire application uses a **light gray theme**:
- **Primary Color**: Blue (#2563eb) - for buttons and links
- **Background**: Light Gray (#f5f5f5, #f0f0f0)
- **Cards**: White (#ffffff)
- **Text**: Dark Gray (#333333)
- **Accents**: Success (green), Warning (amber), Danger (red)

---

## 📱 Responsive Features

### Mobile (< 768px)
- ✅ Hamburger menu navigation
- ✅ Stacked form fields
- ✅ Full-width buttons
- ✅ Touch-friendly spacing

### Tablet (768px - 1024px)
- ✅ Adaptive grid layouts
- ✅ Side-by-side form fields
- ✅ Proper touch targets

### Desktop (> 1024px)
- ✅ Full navigation bar
- ✅ Multi-column layouts
- ✅ Dropdown menus
- ✅ Optimized spacing

---

## 📂 Key Files Modified

| File | Changes |
|------|---------|
| `src/pages/Auth.jsx` | Complete rewrite with multi-role support |
| `src/context/AuthContext.jsx` | Added role-specific login/register methods |
| `src/services/api.js` | Added endpoints for all roles |
| `src/components/Layout.jsx` | Updated responsive navbar |
| `src/pages/Profile.jsx` | Added profile details and logout |
| `src/App.jsx` | Enhanced protected routes |
| `tailwind.config.js` | Light gray color configuration |
| `src/App.css` | Light gray theme styles |
| `src/index.css` | Global responsive styles |

---

## 🔐 Security & Protection

### Protected Routes
These routes require authentication:
- `/profile` - User profile page
- `/events` - Events listing
- `/create-event` - Create new event (Host only)

Unauthenticated users are automatically redirected to `/login`

### Authentication Flow
1. **Sign Up** → Backend creates user → Returns token & user data
2. **Sign In** → Backend validates credentials → Returns token & user data
3. **Token Storage** → Stored in localStorage for persistence
4. **Auto-logout** → 401 response triggers automatic logout

---

## 🧪 Testing Scenarios

### Test User Registration
```
Email: user@example.com
Password: password123 (min 8 chars)
Age: 25
Education: Bachelor's
Institution: Example University
Disability: None
```

### Test Admin Registration
```
Email: admin@example.com
Password: admin123 (min 6 chars)
First Name: John
Last Name: Admin
```

### Test Host Registration
```
Email: host@example.com
Password: host123 (min 6 chars)
Institution: Example Institution
Contact: +1 234 567 8900
```

---

## ⚙️ Configuration

### Environment Variables
Create `.env` file in `frontrct` folder:
```
VITE_API_URL=http://localhost:4000
```

### Backend Requirements
Your backend should have:
- CORS enabled for `http://localhost:5173`
- API endpoints at `/api/users`, `/api/administrators`, `/api/hosts`
- Email service configured for forgot password

---

## 🐛 Common Issues & Fixes

### "Cannot connect to backend"
- Check backend is running on port 4000
- Verify CORS is enabled
- Check `VITE_API_URL` in `.env`

### "Login shows invalid credentials"
- Verify email matches exactly (case-insensitive)
- Check password is correct
- Ensure backend database has the user

### "Forms look weird on mobile"
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check Tailwind CSS is compiled

### "Logout not working"
- Check browser console for errors
- Verify localStorage is not blocked
- Check network request in DevTools

---

## 📋 Checklist for Deployment

- [ ] Backend running and tested
- [ ] All registration forms working
- [ ] Login for all roles working
- [ ] Forgot password email sending
- [ ] Profile page displaying correctly
- [ ] Logout working properly
- [ ] Mobile responsive design verified
- [ ] All links and buttons functioning
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Color scheme consistent
- [ ] No console errors

---

## 💡 Tips & Tricks

### Clear Session
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Debug Auth State
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
localStorage.getItem('token')
localStorage.getItem('userRole')
```

---

## 🎉 You're All Set!

Your TalentConnect frontend is ready to use!

**See IMPLEMENTATION_GUIDE.md for detailed documentation.**
- ⚙️ **Settings** - Preferences

### Authentication
```jsx
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### API Calls
```jsx
import apiService from './services/api';

const conferences = await apiService.getConferences();
const user = await apiService.loginUser(email, password);
```

### Forms
```jsx
import { useForm } from './hooks/useCustom';

const { values, errors, handleChange, handleSubmit } = useForm(
  initialValues,
  onSubmit
);
```

---

## 🎨 Tailwind CSS Classes

Common classes used:
- **Spacing**: `p-4`, `m-2`, `gap-3`
- **Colors**: `bg-primary-500`, `text-gray-700`, `text-danger`
- **Layout**: `flex`, `grid`, `gap-4`
- **Responsive**: `md:grid-cols-2`, `lg:flex`, `hidden md:block`
- **Effects**: `hover:bg-gray-100`, `transition`, `rounded-lg`

---

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Add a New Component
1. Create file in `src/components/NewComponent.jsx`
2. Export from component file
3. Import where needed:
```jsx
import { NewComponent } from './components/NewComponent';
```

### Make an API Call
```jsx
import apiService from './services/api';

const data = await apiService.getConferences();
// Check api.js for all available methods
```

### Handle Form Submission
```jsx
const { values, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  async (values) => {
    const response = await apiService.loginUser(values.email, values.password);
  }
);
```

---

## 🧪 Testing

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📋 Demo Credentials

**Email:** demo@example.com  
**Password:** demo123

(Available after backend is seeded with demo data)

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API calls fail | Check backend is running on port 4000 |
| Tailwind styles not applied | Run `npm install` and restart dev server |
| Routes not working | Ensure route is in App.jsx Routes |
| Component not showing | Check component is exported and imported |

---

## 📚 Component Library

### Buttons
```jsx
<Button variant="primary" size="md">Click</Button>
<Button variant="outline" disabled>Disabled</Button>
<Button variant="danger" loading={true}>Loading</Button>
```

### Form Elements
```jsx
<Input label="Email" type="email" required />
<TextArea label="Description" rows="4" />
<Select label="Category" options={options} />
```

### Layout
```jsx
<Card hover>Content</Card>
<Modal isOpen={true} title="Title">Content</Modal>
<Alert type="success" message="Success!" />
```

### Feedback
```jsx
<Loading size="md" />
<Badge variant="primary">Label</Badge>
<Tabs tabs={tabs} activeTab={active} />
```

---

## 🔐 Protected Routes

Only authenticated users can access:
- `/events`
- `/create-event`
- `/profile`
- `/settings`

Unauthenticated users are redirected to `/login`

---

## 🌐 Environment Variables

Required variables in `.env`:
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

---

## 📞 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Install dependencies
npm install

# Update dependencies
npm update
```

---

## 🎓 Learning Resources

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Vite: https://vite.dev
- JavaScript: https://developer.mozilla.org

---

## ✅ What's Included

- ✅ Full authentication system
- ✅ Event management (create, browse, register)
- ✅ User profiles
- ✅ Settings panel
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Notifications system

---

## 🎉 You're All Set!

Start building amazing features with TalentConnect Pro!

```bash
npm run dev
```

Happy coding! 🚀
