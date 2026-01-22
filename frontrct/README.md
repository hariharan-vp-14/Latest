# 🎯 TalentConnect Pro - React Frontend

A complete, production-ready React frontend for TalentConnect Pro - an accessible platform for talent showcases and virtual conferences.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Update .env
VITE_API_URL=http://localhost:4000

# 4. Start development
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ✨ Features

### 🎨 React & Modern Stack
- React 19.2 with Hooks
- React Router v6 with protected routes
- Context API for state management
- Tailwind CSS for styling
- Vite for fast development
- 6 custom React hooks
- 20+ reusable components

### 📄 Pages
- **Home** - Landing page with featured events
- **Login/Signup** - Authentication system
- **Events** - Browse and manage events
- **Create Event** - Host new events
- **Profile** - User profile management
- **Settings** - Preferences and account settings

### 🔐 Security
- Token-based authentication
- Protected routes
- Form validation
- Error handling
- Session management

### 🎨 UI/UX
- Fully responsive design
- Dark mode support
- Loading states
- Toast notifications
- Error alerts
- Smooth animations

---

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components (20+)
├── context/        # State management (Auth, App)
├── hooks/          # Custom React hooks (6)
├── pages/          # Page components (5)
├── services/       # API integration
├── App.jsx         # Main app with routing
└── main.jsx        # Entry point
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19.2 | Core framework |
| React Router 6 | Client-side routing |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |
| Vite | Build tool |
| Context API | State management |

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[FRONTEND_README.md](./FRONTEND_README.md)** - Comprehensive documentation
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed patterns & usage
- **[FILE_MANIFEST.md](./FILE_MANIFEST.md)** - Complete file listing
- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - Implementation summary

---

## 💻 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔗 API Endpoints

Expected endpoints from backend:

### Authentication
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `GET /api/users/:id` - Get profile
- `PUT /api/users/:id` - Update profile

### Conferences
- `GET /api/conferences` - List all
- `POST /api/conferences` - Create
- `POST /api/conferences/:id/register` - Register
- `GET /api/users/:id/registrations` - User registrations

---

## 🎓 Key Features

### Custom Hooks
```javascript
useForm()          // Form handling with validation
useFetch()         // Data fetching
useAPI()           // API calls
useLocalStorage()  // Persistent state
useDebounce()      // Debounced values
useToggle()        // Boolean toggle
```

### State Management
```javascript
// Authentication
const { user, login, logout } = useAuth();

// App state
const { conferences, addNotification } = useApp();
```

### Protected Routes
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI
- Adaptive layouts

---

## 🎨 Tailwind CSS

Custom configuration includes:
- Primary, Secondary, Accent colors
- Extended spacing
- Custom animations
- Dark mode support
- Accessibility features

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static host

---

## 📝 Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=TalentConnect Pro
```

---

## 🔍 Demo Credentials

- **Email**: demo@example.com
- **Password**: demo123

---

## 📊 Statistics

- **Components**: 20+
- **Custom Hooks**: 6
- **Pages**: 5
- **Lines of Code**: ~3500+
- **Files**: 20+

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure backend URL in `.env`
3. ✅ Start server: `npm run dev`
4. ✅ Open `http://localhost:5173`
5. ✅ Start building!

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vite.dev)

---

## 🎉 Created With

- ❤️ React
- 🎨 Tailwind CSS
- 🚀 Vite
- 🧠 Modern JavaScript
- 📚 Best Practices

---

**Ready for development and deployment! 🚀**
