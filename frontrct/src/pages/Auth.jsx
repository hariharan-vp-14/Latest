import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useForm } from '../hooks/useCustom';
import { Input, Button, Alert, Card } from '../components/UI';
import { Mail, Lock, Eye, EyeOff, User, Building, Phone, MapPin, Briefcase, Users, ArrowLeft, LogIn, Settings, Smile, Shield, Zap, CheckCircle } from 'lucide-react';

// ==================== LOGIN PAGE ====================
export const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loginAdmin, loginHost, error: authError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successRole, setSuccessRole] = useState(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      setLoginError('');

      if (!validateEmail(formValues.email)) {
        setFieldError('email', 'Please enter a valid email address');
        return;
      }
      if (formValues.password.length < 6) {
        setFieldError('password', 'Password must be at least 6 characters');
        return;
      }

      try {
        if (userRole === 'user') {
          await loginUser(formValues.email, formValues.password);
          setLoginError('');
          navigate('/');
        } else if (userRole === 'admin') {
          await loginAdmin(formValues.email, formValues.password);
          setLoginError('');
          setSuccessRole('admin');
          setShowSuccessModal(true);
        } else {
          await loginHost(formValues.email, formValues.password);
          setLoginError('');
          navigate('/');
        }
      } catch (err) {
        const errorMessage = err.message || 'Login failed. Please try again.';
        // Check if error message indicates user not found
        if (errorMessage.includes('Invalid email or password')) {
          setLoginError('No account found with this email. Would you like to sign up?');
          setShowSignupPrompt(true);
        } else {
          setLoginError(errorMessage);
        }
      }
    }
  );

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/admin/events');
  };

  const handleSignupRedirect = () => {
    setShowSignupPrompt(false);
    if (userRole === 'user') {
      navigate('/signup');
    } else if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/host');
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword role={userRole} onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-card rounded-xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
            <LogIn size={22} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your TalentConnect account</p>
        </div>

        {/* Error Messages */}
        {(authError || loginError) && (
          <Alert type="error" message={authError || loginError} className="mb-6 rounded-lg" />
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Login as</p>
          <div className="grid grid-cols-3 gap-2">
            {['user', 'admin', 'host'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setUserRole(role);
                  setLoginError('');
                }}
                className={`py-2.5 px-3 rounded-lg font-medium transition text-sm ${userRole === role
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {role === 'user' ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <User size={14} /> User
                  </span>
                ) : role === 'admin' ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Settings size={14} /> Admin
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Building size={14} /> Host
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock size={16} className="text-blue-600" />
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1"><AlertTriangle size={16} /> {errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>

      {/* Admin Success Modal */}
      {showSuccessModal && successRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smile size={28} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back, Administrator!</h2>
              <p className="text-gray-500 text-sm mb-6">Accessing your admin dashboard...</p>
              <Button
                onClick={handleModalClose}
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Signup Prompt Modal */}
      {showSignupPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Account Found</h2>
              <p className="text-gray-500 text-sm mb-6">
                We couldn't find an account with this email. Create a new {userRole} account?
              </p>
              <div className="space-y-2">
                <Button
                  onClick={handleSignupRedirect}
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Sign Up Now
                </Button>
                <Button
                  onClick={() => setShowSignupPrompt(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try Another Email
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== SIGNUP PAGE ====================
export const Signup = () => {
  const navigate = useNavigate();
  const { registerUser, registerAdmin, registerHost, error: authError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState(null);

  if (!registrationType) {
    return <RegistrationTypeSelector onSelect={setRegistrationType} />;
  }

  return registrationType === 'user' ? (
    <UserSignup onBack={() => setRegistrationType(null)} />
  ) : registrationType === 'admin' ? (
    <AdminSignup onBack={() => setRegistrationType(null)} />
  ) : (
    <HostSignup onBack={() => setRegistrationType(null)} />
  );
};

// ==================== REGISTRATION TYPE SELECTOR ====================
const RegistrationTypeSelector = ({ onSelect }) => {
  const navigate = useNavigate();

  const registrationTypes = [
    {
      type: 'user',
      title: 'User Registration',
      description: 'Sign up as a participant to explore and attend events',
      icon: User,
      color: 'blue',
    },
    {
      type: 'admin',
      title: 'Administrator Registration',
      description: 'Sign up as an administrator to manage the platform',
      icon: Building,
      color: 'purple',
    },
    {
      type: 'host',
      title: 'Host Registration',
      description: 'Sign up as a host to organize and manage events',
      icon: Briefcase,
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Join TalentConnect</h1>
          <p className="text-gray-500">Choose your registration type</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {registrationTypes.map(({ type, title, description, icon: Icon, color }) => (
            <div
              key={type}
              className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-card-hover hover:border-gray-300 transition-all duration-200 text-center"
              onClick={() => onSelect(type)}
            >
              <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`text-${color}-600`} size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== USER SIGNUP ====================
const UserSignup = ({ onBack }) => {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      'fullname.firstname': '',
      'fullname.lastname': '',
      email: '',
      age: '',
      educationLevel: '',
      institution: '',
      disabilityType: 'None',
      password: '',
      confirmPassword: '',
    },
    async (formValues) => {
      try {
        if (formValues.password !== formValues.confirmPassword) {
          setFieldError('confirmPassword', 'Passwords do not match');
          return;
        }
        if (formValues.password.length < 8) {
          setFieldError('password', 'Password must be at least 8 characters');
          return;
        }

        const userData = {
          fullname: {
            firstname: formValues['fullname.firstname'],
            lastname: formValues['fullname.lastname'],
          },
          email: formValues.email,
          age: parseInt(formValues.age),
          educationLevel: formValues.educationLevel,
          institution: formValues.institution,
          disabilityType: formValues.disabilityType,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        };

        await registerUser(userData);
        // Show success modal instead of immediate redirect
        setShowSuccessModal(true);
      } catch (err) {
        // Check if user already exists
        if (err.message && err.message.includes('already exists')) {
          setShowExistingAccountModal(true);
        } else {
          setError(err.message);
        }
      }
    }
  );

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-card border border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">User Registration</h1>
          <p className="text-gray-500 text-sm">Create your account to get started</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="fullname.firstname"
              label="First Name"
              placeholder="John"
              value={values['fullname.firstname']}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors['fullname.firstname']}
              touched={touched['fullname.firstname']}
              required
            />
            <Input
              type="text"
              name="fullname.lastname"
              label="Last Name"
              placeholder="Doe"
              value={values['fullname.lastname']}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors['fullname.lastname']}
              touched={touched['fullname.lastname']}
              required
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="number"
              name="age"
              label="Age"
              placeholder="25"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.age}
              touched={touched.age}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
              <select
                name="educationLevel"
                value={values.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"
                required
              >
                <option value="">Select Education Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <Input
            type="text"
            name="institution"
            label="Institution"
            placeholder="University Name"
            value={values.institution}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.institution}
            touched={touched.institution}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disability Type</label>
            <select
              name="disabilityType"
              value={values.disabilityType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"
            >
              <option value="None">None</option>
              <option value="Physical">Physical</option>
              <option value="Visual">Visual</option>
              <option value="Hearing">Hearing</option>
              <option value="Neurological">Neurological</option>
              <option value="Multiple">Multiple</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>

      {/* Success Modal - Auto-login complete */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to TalentConnect!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your account has been created. Let's explore some events!
              </p>
              <Button
                onClick={handleSuccessClose}
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Explore Events
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Existing Account Modal */}
      {showExistingAccountModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Already Exists</h2>
              <p className="text-gray-500 text-sm mb-6">
                This email is already registered. Sign in or use a different email.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowExistingAccountModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Use Different Email
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== ADMIN AUTH (UNIFIED REGISTER/LOGIN) ====================
const AdminSignup = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('register');

  return activeTab === 'register' ? (
    <AdminRegister onBack={onBack} onSwitchTab={() => setActiveTab('login')} />
  ) : (
    <AdminLogin onBack={onBack} onSwitchTab={() => setActiveTab('register')} />
  );
};

// ==================== ADMIN REGISTER ====================
const AdminRegister = ({ onBack, onSwitchTab }) => {
  const navigate = useNavigate();
  const { registerAdmin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      'fullname.firstname': '',
      'fullname.lastname': '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    async (formValues) => {
      try {
        if (formValues.password !== formValues.confirmPassword) {
          setFieldError('confirmPassword', 'Passwords do not match');
          return;
        }
        if (formValues.password.length < 6) {
          setFieldError('password', 'Password must be at least 6 characters');
          return;
        }

        const adminData = {
          fullname: {
            firstname: formValues['fullname.firstname'],
            lastname: formValues['fullname.lastname'],
          },
          email: formValues.email,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        };

        await registerAdmin(adminData);
        setShowSuccessModal(true);
      } catch (err) {
        // Check if error is about admin limit
        if (err.message && err.message.includes('Maximum of 5 administrators')) {
          setError('Cannot register more than 5 administrators. System limit reached.');
        } else if (err.message && err.message.includes('already exists')) {
          setError('This email is already registered.');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      }
    }
  );

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-card border border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Administrator Access</h1>
          <p className="text-gray-500 text-sm">Manage and approve events</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            className="flex-1 py-2 px-4 rounded-md font-medium transition text-sm bg-white text-gray-900 shadow-sm"
            disabled
          >
            Register
          </button>
          <button
            onClick={onSwitchTab}
            className="flex-1 py-2 px-4 rounded-md font-medium transition text-sm text-gray-500 hover:text-gray-900"
          >
            Login
          </button>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullname.firstname"
            label="First Name"
            placeholder="John"
            value={values['fullname.firstname']}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors['fullname.firstname']}
            touched={touched['fullname.firstname']}
            required
          />

          <Input
            type="text"
            name="fullname.lastname"
            label="Last Name (Optional)"
            placeholder="Doe"
            value={values['fullname.lastname']}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="admin@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
            loading={loading}
          >
            Create Admin Account
          </Button>
        </form>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Successfully Registered!</h2>
              <p className="text-gray-500 text-sm mb-6">Welcome to TalentConnect Pro, Administrator! You're now logged in.</p>
              <Button
                onClick={handleModalClose}
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== ADMIN LOGIN ====================
const AdminLogin = ({ onBack, onSwitchTab }) => {
  const navigate = useNavigate();
  const { loginAdmin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      try {
        if (!formValues.email || !formValues.password) {
          setFieldError('email', 'Email and password required');
          return;
        }

        await loginAdmin(formValues.email, formValues.password);
        setShowSuccessModal(true);
      } catch (err) {
        setError(err.message);
      }
    }
  );

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-card border border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Administrator Access</h1>
          <p className="text-gray-500 text-sm">Manage and approve events</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={onSwitchTab}
            className="flex-1 py-2 px-4 rounded-md font-medium transition text-sm text-gray-500 hover:text-gray-900"
          >
            Register
          </button>
          <button
            className="flex-1 py-2 px-4 rounded-md font-medium transition text-sm bg-white text-gray-900 shadow-sm"
            disabled
          >
            Login
          </button>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="admin@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
            loading={loading}
          >
            Login
          </Button>
        </form>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smile size={28} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back, Administrator!</h2>
              <p className="text-gray-500 text-sm mb-6">You're logged in and ready to manage events.</p>
              <Button
                onClick={handleModalClose}
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== HOST SIGNUP ====================
const HostSignup = ({ onBack }) => {
  const navigate = useNavigate();
  const { registerHost, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      'fullname.firstname': '',
      'fullname.lastname': '',
      email: '',
      institution: '',
      address: '',
      designation: '',
      contact: '',
      totalNumberPhysical: '',
      password: '',
      confirmPassword: '',
    },
    async (formValues) => {
      try {
        if (formValues.password !== formValues.confirmPassword) {
          setFieldError('confirmPassword', 'Passwords do not match');
          return;
        }
        if (formValues.password.length < 6) {
          setFieldError('password', 'Password must be at least 6 characters');
          return;
        }

        const hostData = {
          fullname: {
            firstname: formValues['fullname.firstname'],
            lastname: formValues['fullname.lastname'],
          },
          email: formValues.email,
          institution: formValues.institution,
          address: formValues.address,
          designation: formValues.designation,
          contact: formValues.contact,
          totalNumberPhysical: formValues.totalNumberPhysical ? parseInt(formValues.totalNumberPhysical) : undefined,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        };

        await registerHost(hostData);
        setShowSuccessModal(true);
      } catch (err) {
        // Check if user already exists
        if (err.message && err.message.includes('already exists')) {
          setShowExistingAccountModal(true);
        } else {
          setError(err.message);
        }
      }
    }
  );

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-card border border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Host Registration</h1>
          <p className="text-gray-500 text-sm">Create your host account to organize events</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="fullname.firstname"
              label="First Name"
              placeholder="John"
              value={values['fullname.firstname']}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors['fullname.firstname']}
              touched={touched['fullname.firstname']}
              required
            />
            <Input
              type="text"
              name="fullname.lastname"
              label="Last Name (Optional)"
              placeholder="Doe"
              value={values['fullname.lastname']}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="host@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
          />

          <Input
            type="text"
            name="institution"
            label="Institution/Organization"
            placeholder="Your Organization"
            value={values.institution}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Input
            type="text"
            name="address"
            label="Address"
            placeholder="123 Main St"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="designation"
              label="Designation"
              placeholder="Event Manager"
              value={values.designation}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              type="tel"
              name="contact"
              label="Contact Number"
              placeholder="+1 234 567 8900"
              value={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <Input
            type="number"
            name="totalNumberPhysical"
            label="Total Physical Capacity"
            placeholder="100"
            value={values.totalNumberPhysical}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
            loading={loading}
          >
            Create Host Account
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Successfully Registered!</h2>
              <p className="text-gray-500 text-sm mb-6">Welcome to TalentConnect Pro, Host! You can now create events.</p>
              <Button
                onClick={handleModalClose}
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Start Creating Events
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Existing Account Modal */}
      {showExistingAccountModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Already Exists</h2>
              <p className="text-gray-500 text-sm mb-6">
                This email is already registered. Sign in or use a different email.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowExistingAccountModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Use Different Email
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== FORGOT PASSWORD ====================
const ForgotPassword = ({ role, onBack }) => {
  const { forgotPasswordUser, forgotPasswordAdmin, forgotPasswordHost, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'user') {
        await forgotPasswordUser(email);
      } else if (role === 'admin') {
        await forgotPasswordAdmin(email);
      } else {
        await forgotPasswordHost(email);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-card border border-gray-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600" size={28} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-500 text-sm mb-6">
              We've sent password reset instructions to <strong className="text-gray-700">{email}</strong>
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-card border border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
          <p className="text-gray-500 text-sm">Enter your email to reset your password</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            loading={loading}
          >
            Send Reset Link
          </Button>
        </form>
      </Card>
    </div>
  );
};
