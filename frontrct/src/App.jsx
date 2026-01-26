import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { NotificationCenter } from './components/Utilities';
import { Home } from './pages/Home';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { About } from './pages/About';
import { Login, Signup } from './pages/Auth';
import { Events, CreateEvent } from './pages/Events';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AdminEvents } from './pages/AdminEvents';
import { HostEventManagement } from './pages/HostEventManagement';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import './App.css';

/* ================= PROTECTED ROUTE WITH ROLE CHECK ================= */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />

          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />

          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:role/:token" element={<ResetPassword />} />

          {/* User Routes */}
          <Route
            path="/events"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Events />
              </ProtectedRoute>
            }
          />

          {/* Host Routes */}
          <Route
            path="/host/events"
            element={
              <ProtectedRoute allowedRoles={['host']}>
                <HostEventManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/create-event"
            element={
              <ProtectedRoute allowedRoles={['host']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEvents />
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Legacy Routes (backward compatibility) */}
          <Route
            path="/create-event"
            element={
              <ProtectedRoute allowedRoles={['host', 'admin']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      <NotificationCenter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
