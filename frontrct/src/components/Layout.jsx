import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Settings, User, Calendar, Plus, CheckCircle } from 'lucide-react';
import logo from '../assets/talentconnect-logo.svg';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, userRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.fullname?.firstname || user?.firstname || 'User';

  return (
    <header className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition">
            <img
              src={logo}
              alt="TalentConnect Pro"
              className="h-11 w-11 rounded-lg bg-white object-contain"
            />
            <span className="hidden sm:inline">TalentConnect Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">
              How It Works
            </Link>
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-2">
                      <Calendar size={16} />
                      My Events
                    </Link>
                    <Link to="/host/create-event" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                      <Plus size={16} />
                      Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1">
                    <Settings size={16} />
                    <CheckCircle size={16} />
                    Review Events
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{firstName}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {userRole === 'user' ? 'Participant' : userRole === 'admin' ? 'Admin' : 'Host'}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition font-bold"
                  >
                    {firstName.charAt(0).toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100"
                      >
                        <User size={16} className="text-blue-600" /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 transition"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 bg-gray-100 rounded-lg p-3 mb-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
              Home
            </Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
              How It Works
            </Link>
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                      <Calendar size={16} />
                      My Events
                    </Link>
                    <Link to="/host/create-event" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg transition font-medium">
                      <Plus size={16} />
                      Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                    <Settings size={16} />
                    <CheckCircle size={16} />
                    Review Events
                  </Link>
                )}
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                  <User size={16} /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 bg-blue-600 text-white rounded-lg transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeError('');
    setSubscribeSuccess(false);

    if (!email.trim()) {
      setSubscribeError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setSubscribeSuccess(true);
      setEmail('');
      // Reset success message after 5 seconds
      setTimeout(() => setSubscribeSuccess(false), 5000);
    } catch (error) {
      setSubscribeError(error.message || 'Error subscribing. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-12 text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Stay Updated!</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter for the latest events, accessibility tips, and updates.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeSuccess && (
              <p className="text-green-200 text-sm mt-3 flex items-center gap-2">
                <span>✓</span>
                <span>Thank you! Check your email to confirm your subscription.</span>
              </p>
            )}
            {subscribeError && (
              <p className="text-red-200 text-sm mt-3 flex items-center gap-2">
                <span>⚠</span>
                <span>{subscribeError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Main Footer Content - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">TalentConnect Pro</h3>
              <p className="text-blue-400 text-xs font-semibold">Empowering Accessibility</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering students with disabilities through accessible virtual conferences.
            </p>
            <p className="text-xs text-gray-500">
              Making professional opportunities accessible to everyone, regardless of ability.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Events
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> How It Works
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> About
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#help" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Contact Us
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> FAQ
                </a>
              </li>
              <li>
                <a href="#report" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Report Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Terms of Service
                </a>
              </li>
              <li>
                <a href="#accessibility" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Accessibility
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-gray-400 hover:text-white transition duration-200 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Copyright Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 TalentConnect Pro. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Building an accessible future for students with disabilities worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
