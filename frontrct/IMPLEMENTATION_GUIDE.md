# Frontend Implementation Guide

## Overview
This document provides a comprehensive guide to the updated TalentConnect frontend that now supports multi-role authentication (User, Administrator, Host) with full backend integration.

## ✅ Completed Features

### 1. **Multi-Role Authentication System**
- **Three User Roles**: User (Participant), Administrator, Host
- **Separate Registration Forms** for each role with role-specific fields
- **Separate Login Pages** for each role
- **Role-based Navigation** - different options for different roles

### 2. **Registration Pages**

#### User Registration
Required Fields:
- First Name *
- Last Name *
- Email Address *
- Age *
- Education Level * (High School, Bachelor's, Master's, PhD, Diploma, Other)
- Institution *
- Disability Type (Physical, Visual, Hearing, Neurological, Multiple, Other, None)
- Password * (min 8 characters)
- Confirm Password *

#### Administrator Registration
Required Fields:
- First Name *
- Last Name (Optional)
- Email Address *
- Password * (min 6 characters)
- Confirm Password *

#### Host Registration
Required Fields:
- First Name *
- Last Name (Optional)
- Email Address *
- Institution/Organization (Optional)
- Address (Optional)
- Designation (Optional)
- Contact Number (Optional)
- Total Physical Capacity (Optional - numeric)
- Password * (min 6 characters)
- Confirm Password *

### 3. **Login Features**
- **Role Selection**: Toggle between User, Admin, and Host
- **Forgot Password**: Each role has forgotten password functionality
- **Already have an account**: Links to login from signup pages
- **Responsive Design**: Works on all screen sizes
- **Password Visibility Toggle**: Eye icon to show/hide password

### 4. **Profile Features**
- **Display User Information** (without password)
  - First Name & Last Name
  - Email Address
  - Age (Users only)
  - Education Level (Users only)
  - Institution (Users & Hosts)
  - Contact (Hosts only)
  - Designation (Hosts only)
- **Logout Button**: Easy logout with redirect to login page
- **Edit Profile**: Ready for future implementation
- **Protected Route**: Profile only accessible when authenticated

### 5. **Color Theme**
- **Light Gray Theme**:
  - Primary: Blue (#2563eb)
  - Backgrounds: Light Gray (#f5f5f5, #f0f0f0)
  - Cards: White (#ffffff)
  - Text: Dark Gray (#333333, #1a1a1a)
  - Borders: Light Gray (#e5e7eb)

### 6. **Responsive Design**
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Responsive Grid Layouts**: Adapts to all screen sizes
- **Responsive Forms**: Stack on mobile, side-by-side on desktop
- **Touch-friendly Buttons**: Proper padding and sizing
- **Flexible Cards**: Responsive card grids

### 7. **Protected Routes**
- `/profile` - Protected route requiring authentication
- `/events` - Protected route requiring authentication
- `/create-event` - Protected route requiring authentication (Host role)
- Authentication status checked on app load
- Automatic redirect to login for unauthenticated users

## 📁 File Structure

```
src/
├── pages/
│   ├── Auth.jsx              # New comprehensive auth system
│   ├── AuthNew.jsx           # Backup of new auth component
│   ├── Profile.jsx           # Updated with logout and profile details
│   └── ...
├── context/
│   ├── AuthContext.jsx       # Updated for multi-role support
│   └── ...
├── services/
│   └── api.js                # Updated with all role endpoints
├── components/
│   └── Layout.jsx            # Updated responsive layout
├── App.jsx                   # Updated with protected routes
├── App.css                   # Light gray theme styles
├── index.css                 # Global responsive styles
└── tailwind.config.js        # Updated color configuration
```

## 🔑 API Endpoints Used

### User Endpoints
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password/:token`
- `GET /api/users/verify/:token`
- `GET /api/users/logout`
- `GET /api/users/profile`

### Administrator Endpoints
- `POST /api/administrators/register`
- `POST /api/administrators/login`
- `POST /api/administrators/forgot-password`
- `POST /api/administrators/reset-password/:token`
- `GET /api/administrators/profile`
- `GET /api/administrators/logout`

### Host Endpoints
- `POST /api/hosts/register`
- `POST /api/hosts/login`
- `POST /api/hosts/forgot-password`
- `POST /api/hosts/reset-password/:token`
- `GET /api/hosts/profile`
- `GET /api/hosts/logout`

## 🚀 Usage Instructions

### 1. Running the Application
```bash
cd Talent/frontrct
npm install
npm run dev
```

### 2. Registration Flow
1. Click "Sign Up" button
2. Select registration type (User, Admin, or Host)
3. Fill in required fields (marked with *)
4. Click "Create Account"
5. Redirected to home page after successful registration

### 3. Login Flow
1. Click "Login" button
2. Select user role (User, Admin, or Host)
3. Enter email and password
4. Click "Sign In"
5. Redirected to home page after successful login

### 4. Forgot Password Flow
1. On login page, click "Forgot Password?"
2. Enter email address
3. Check email for reset link
4. Click link and reset password
5. Return to login page

### 5. Profile Access
1. After login, click user avatar/name in top-right
2. Click "Profile" from dropdown menu
3. View profile information
4. Click "Logout" to exit

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
primary: {
  600: '#your-color', // Main primary color
  700: '#your-darker-color',
  // ...
}
```

### Add More Registration Fields
Edit `src/pages/Auth.jsx` in the respective SignUp component:
1. Add field to form state
2. Add validation
3. Add to API request payload

### Modify Theme Colors
Edit `src/App.css` and `index.css` for global color changes

## 🔒 Security Features

- ✅ Password hashing in backend (bcrypt)
- ✅ JWT token authentication
- ✅ Protected routes on frontend
- ✅ Token stored in localStorage
- ✅ Email validation
- ✅ Password confirmation matching
- ✅ Automatic logout on session expiration (401 response)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Tailwind `md:`)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚠️ Important Notes

1. **Backend Integration**: Ensure backend is running on `http://localhost:4000`
2. **CORS**: Backend should have CORS enabled for `http://localhost:5173` (Vite dev server)
3. **Environment Variables**: Update `VITE_API_URL` in `.env` if backend URL changes
4. **Password Requirements**:
   - Users: minimum 8 characters
   - Admin & Host: minimum 6 characters

## 📋 Testing Checklist

- [ ] Registration works for all three roles
- [ ] Login works for all three roles
- [ ] Forgot password sends email
- [ ] Profile page displays correct information
- [ ] Logout button works
- [ ] Protected routes redirect to login
- [ ] Mobile navigation works
- [ ] Forms are responsive
- [ ] Color scheme is light gray throughout
- [ ] Buttons and links are accessible
- [ ] Form validation works correctly
- [ ] Error messages display properly

## 🐛 Troubleshooting

### Login not working
- Check backend is running on port 4000
- Verify email and password are correct
- Check CORS settings in backend

### Profile shows no data
- Ensure you're logged in (check localStorage: `token` and `user`)
- Check backend profile endpoint
- Verify user data is returned from login

### Forgot password not working
- Check email configuration in backend
- Verify email service is running
- Check spam folder for reset email

### Styles not loading
- Run `npm run build` to rebuild Tailwind CSS
- Clear browser cache
- Check `tailwind.config.js` is correct

## 📞 Support

For issues or questions:
1. Check backend logs
2. Check browser console for errors
3. Verify API endpoints are correct
4. Check network tab for failed requests

## 🔄 Future Enhancements

- [ ] Email verification on signup
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Profile picture upload
- [ ] Edit profile functionality
- [ ] Account deactivation
- [ ] Password change functionality
- [ ] User preferences/settings
- [ ] Account recovery options
- [ ] Login history

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: ✅ Complete and Ready for Testing
