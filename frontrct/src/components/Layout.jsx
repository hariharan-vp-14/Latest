import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Settings, User, Calendar, Plus, CheckCircle } from 'lucide-react';
import logo from '../assets/talentconnect-logo.svg';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, userRole } = useAuth();

  const scrollToSection = useCallback((sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.fullname?.firstname || user?.firstname || 'User';

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40 transition-shadow duration-300 hover:shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="TalentConnect Pro"
              className="h-9 w-9 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="hidden sm:inline font-heading text-lg font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200">TalentConnect<span className="text-blue-600">Pro</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200">
              Home
            </Link>
            <Link to="/how-it-works" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200">
              How It Works
            </Link>
            <button onClick={() => scrollToSection('about')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200">
              About Us
            </button>
            <button onClick={() => scrollToSection('contact')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200">
              Contact Us
            </button>
            <button onClick={() => scrollToSection('donation')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200">
              Donation
            </button>
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                      <Calendar size={15} />
                      My Events
                    </Link>
                    <Link to="/host/create-event" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md">
                      <Plus size={15} />
                      Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                    <Settings size={15} />
                    <CheckCircle size={15} />
                    Review Events
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{firstName}</p>
                  <p className="text-[11px] text-gray-500 capitalize tracking-wide">
                    {userRole === 'user' ? 'Participant' : userRole === 'admin' ? 'Admin' : 'Host'}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white text-sm flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold ring-2 ring-white"
                  >
                    {firstName.charAt(0).toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{firstName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <User size={15} className="text-gray-400" /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign up
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
          <nav className="md:hidden pb-4 space-y-1 bg-white rounded-xl p-2 mb-3 shadow-lg border border-gray-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
              Home
            </Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
              How It Works
            </Link>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
              About Us
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
              Contact Us
            </button>
            <button onClick={() => scrollToSection('donation')} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
              Donation
            </button>
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
                      <Calendar size={15} />
                      My Events
                    </Link>
                    <Link to="/host/create-event" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg transition-all duration-150 text-sm font-semibold">
                      <Plus size={15} />
                      Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
                    <Settings size={15} />
                    <CheckCircle size={15} />
                    Review Events
                  </Link>
                )}
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
                  <User size={15} /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 flex items-center gap-2"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all duration-150 text-center">
                  Sign up
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
    <footer className="bg-gray-950 text-gray-400 mt-20 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-14 text-white shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 tracking-tight">Stay Updated!</h3>
            <p className="text-blue-100/80 mb-6 text-sm">
              Subscribe to our newsletter for the latest events, accessibility tips, and updates.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-14">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-1 tracking-tight">TalentConnect<span className="text-blue-400">Pro</span></h3>
              <p className="text-blue-400/70 text-xs font-medium tracking-wider uppercase">Empowering Accessibility</p>
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
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
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
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Support</h4>
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
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Legal</h4>
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
