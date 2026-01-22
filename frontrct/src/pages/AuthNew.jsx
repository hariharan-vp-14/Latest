import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useCustom';
import { Input, Button, Alert, Card } from '../components/UI';
import { Mail, Lock, Eye, EyeOff, User, Building, Phone, MapPin, Briefcase, Users, ArrowLeft } from 'lucide-react';

// ==================== LOGIN PAGE ====================
export const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loginAdmin, loginHost, error: authError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      if (!validateEmail(formValues.email)) {
        setFieldError('email', 'Invalid email format');
        return;
      }
      if (formValues.password.length < 6) {
        setFieldError('password', 'Password must be at least 6 characters');
        return;
      }

      try {
        if (userRole === 'user') {
          await loginUser(formValues.email, formValues.password);
        } else if (userRole === 'admin') {
          await loginAdmin(formValues.email, formValues.password);
        } else {
          await loginHost(formValues.email, formValues.password);
        }
        navigate('/');
      } catch (err) {
        setFieldError('submit', err.message);
      }
    }
  );

  if (showForgotPassword) {
    return <ForgotPassword role={userRole} onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your TalentConnect account</p>
        </div>

        {authError && <Alert type="error" message={authError} className="mb-4" />}
        {errors.submit && <Alert type="error" message={errors.submit} className="mb-4" />}

        {/* Role Selection */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {['user', 'admin', 'host'].map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`py-2 px-3 rounded-lg font-medium transition text-sm ${
                userRole === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role === 'user' ? 'User' : role === 'admin' ? 'Admin' : 'Host'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join TalentConnect</h1>
          <p className="text-gray-600 text-lg">Choose your registration type</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {registrationTypes.map(({ type, title, description, icon: Icon, color }) => (
            <Card
              key={type}
              className="bg-white cursor-pointer hover:shadow-xl transition transform hover:scale-105"
              onClick={() => onSelect(type)}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-16 h-16 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`text-${color}-600`} size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
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
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Registration</h1>
          <p className="text-gray-600">Create your account to get started</p>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
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
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
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

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

// ==================== ADMIN SIGNUP ====================
const AdminSignup = ({ onBack }) => {
  const navigate = useNavigate();
  const { registerAdmin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

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
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrator Registration</h1>
          <p className="text-gray-600">Create your admin account</p>
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
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
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
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
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
            className="w-full bg-purple-600 hover:bg-purple-700"
            loading={loading}
          >
            Create Admin Account
          </Button>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
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
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Registration</h1>
          <p className="text-gray-600">Create your host account to organize events</p>
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
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
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
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'
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
            className="w-full bg-green-600 hover:bg-green-700"
            loading={loading}
          >
            Create Host Account
          </Button>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
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
