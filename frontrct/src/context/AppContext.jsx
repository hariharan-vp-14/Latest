import React, { createContext, useContext, useState, useCallback } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });

  const fetchEvents = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getEvents(filters);
      setEvents(data.events || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await apiService.createConference(eventData);
      setEvents([...events, newEvent]);
      // Show success modal instead of just notification
      setSuccessModal({
        isOpen: true,
        message: 'Your event has been created successfully! The admin will review and confirm your event within 24 hours.'
      });
      return newEvent;
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [events]);

  // Alias for createEvent to match component usage
  const createConference = createEvent;

  // Alias for fetchEvents to match component usage
  const fetchConferences = fetchEvents;

  // Alias for events to match component usage
  const conferences = events;

  const registerForEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.registerForEvent(eventId);
      addNotification('Successfully registered for event!', 'success');
      return result;
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Alias for registerForEvent to match component usage
  const registerForConference = registerForEvent;

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  }, [theme]);

  // Admin Event Management
  const getPendingEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPendingEvents();
      return data.events || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEventStatus = useCallback(async (eventId, status, rejectionReason = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.updateEventStatus(eventId, status, rejectionReason);
      addNotification(`Event ${status} successfully!`, 'success');
      return result;
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHostEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getHostEvents();
      return data.events || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    events,
    conferences,
    setEvents,
    loading,
    error,
    notifications,
    theme,
    successModal,
    setSuccessModal,
    fetchEvents,
    fetchConferences,
    createEvent,
    createConference,
    registerForEvent,
    registerForConference,
    getPendingEvents,
    getHostEvents,
    updateEventStatus,
    addNotification,
    removeNotification,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
