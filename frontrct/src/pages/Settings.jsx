import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, Button, Alert } from '../components/UI';
import { Sun, Moon, Lock, Bell, Shield } from 'lucide-react';

export const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useApp();
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-custom p-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeSection === 'general' && <GeneralSettings theme={theme} toggleTheme={toggleTheme} />}
            {activeSection === 'privacy' && <PrivacySettings />}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'danger' && <DangerZone logout={logout} user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = ({ theme, toggleTheme }) => {
  const [language, setLanguage] = useState('en');

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

      <div className="space-y-6">
        {/* Theme */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Dark Mode</h3>
              <p className="text-sm text-gray-600 mt-1">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="border-b border-gray-200 pb-6">
          <label className="block font-semibold text-gray-900 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* Auto-save */}
        <div className="pb-6">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-gray-900 font-medium">Auto-save preferences</span>
          </label>
          <p className="text-sm text-gray-600 mt-2">Automatically save your settings changes</p>
        </div>
      </div>
    </Card>
  );
};

const PrivacySettings = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="border-b border-gray-200 pb-6">
          <label className="block font-semibold text-gray-900 mb-2">Profile Visibility</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="radio" name="visibility" defaultChecked className="w-4 h-4" />
              <span className="text-gray-900">Public - Anyone can see your profile</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="visibility" className="w-4 h-4" />
              <span className="text-gray-900">Private - Only you can see your profile</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="visibility" className="w-4 h-4" />
              <span className="text-gray-900">Custom - Set specific visibility rules</span>
            </label>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield size={18} />
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
            </div>
            <Button variant="primary" size="sm">
              Enable
            </Button>
          </div>
        </div>

        {/* Email Preferences */}
        <div className="pb-6">
          <label className="block font-semibold text-gray-900 mb-3">Email Preferences</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">Receive event recommendations</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">Receive event reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-gray-900">Receive marketing emails</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
};

const NotificationSettings = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

      <div className="space-y-6">
        {/* Event Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Event Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">Event reminders (1 hour before)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">New events in your interests</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-gray-900">Event cancellations</span>
            </label>
          </div>
        </div>

        {/* Message Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Message Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">Messages from other users</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900">Comments on my events</span>
            </label>
          </div>
        </div>

        {/* Notification Method */}
        <div className="pb-6">
          <label className="block font-semibold text-gray-900 mb-2">Notification Method</label>
          <select className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg">
            <option>Email & In-app</option>
            <option>Email only</option>
            <option>In-app only</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

const DangerZone = ({ logout, user }) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      // Call delete account API
      console.log('Deleting account...');
    }
  };

  return (
    <Card className="border-danger border-2">
      <h2 className="text-2xl font-bold text-danger mb-4">Danger Zone</h2>
      <p className="text-gray-600 mb-6">Be careful with these actions. They cannot be undone.</p>

      <div className="space-y-4">
        {/* Change Password */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lock size={18} />
              Change Password
            </h3>
            <p className="text-sm text-gray-600 mt-1">Update your account password</p>
          </div>
          <Button variant="danger" size="sm">
            Change
          </Button>
        </div>

        {/* Logout All Devices */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Logout All Devices</h3>
            <p className="text-sm text-gray-600 mt-1">Sign out from all active sessions</p>
          </div>
          <Button variant="danger" size="sm">
            Logout All
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-danger">
          <div>
            <h3 className="font-semibold text-danger">Delete Account</h3>
            <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all associated data</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
