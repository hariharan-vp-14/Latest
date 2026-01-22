import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Menu, X, LogOut, Settings, User, Moon, Sun } from 'lucide-react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, userRole } = useAuth();
  const { toggleTheme, theme } = useApp();

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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="text-lg font-bold">T</span>
            </div>
            <span className="hidden sm:inline">TalentConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" className="text-gray-700 hover:text-blue-600 transition font-medium">
                      📅 My Events
                    </Link>
                    <Link to="/host/create-event" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                      ➕ Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1">
                    <Settings size={16} />
                    ✅ Review Events
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

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
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
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
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <>
                    <Link to="/host/events" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                      📅 My Events
                    </Link>
                    <Link to="/host/create-event" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 bg-blue-600 text-white rounded-lg transition font-medium">
                      ➕ Create Event
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                    <Settings size={16} />
                    ✅ Review Events
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
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">TalentConnect Pro</h3>
            <p className="text-sm">Empowering students with disabilities through accessible virtual conferences.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            © 2024 TalentConnect Pro. All rights reserved.
          </p>
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
