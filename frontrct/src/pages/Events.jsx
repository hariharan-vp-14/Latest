import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useForm } from '../hooks/useCustom';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, TextArea, Badge, Select, Loading, Alert } from '../components/UI';
import { Calendar, MapPin, Users, Share2, Heart, Edit2, Trash2, Lock, LogIn, UserPlus, Tag, CheckCircle, Zap, Shield } from 'lucide-react';

export const Events = () => {
  const { conferences, fetchConferences, loading, error, registerForConference } = useApp();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConferences().catch(err => console.error(err));
  }, []);

  const filteredEvents = conferences.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || event.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'tech', 'arts', 'business', 'education'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Events</h1>
          <p className="text-gray-600">Discover upcoming conferences and networking opportunities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-custom mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    filter === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading && <Loading />}
        {error && <Alert type="error" message={error} />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onRegister={registerForConference} />
          ))}
        </div>

        {!loading && filteredEvents.length === 0 && (
          <Alert type="info" message="No events found. Try adjusting your filters." />
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, onRegister }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMeetingLink, setShowMeetingLink] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const handleRegister = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      await onRegister(event.id);
      setIsRegistered(true);
      setShowMeetingLink(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      addNotification('Please sign in or sign up to view event details', 'warning');
      navigate('/login');
      return;
    }
    setShowDetailsModal(true);
  };

  const getMeetingPlatform = () => {
    if (!event.meetingLink) return 'Virtual';
    if (event.meetingLink.includes('zoom')) return 'Zoom';
    if (event.meetingLink.includes('meet.google')) return 'Google Meet';
    return 'Virtual';
  };

  return (
    <>
      <Card hover className="flex flex-col">
        <div className="mb-4">
          <Badge variant={event.approved ? 'success' : 'warning'}>
            {event.approved ? 'Approved' : 'Pending'}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            {event.registeredParticipants || 0}/{event.maxParticipants} registered
          </div>

          {/* Meeting Link Section - Visible to authenticated users */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            {isAuthenticated ? (
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-2">📍 {getMeetingPlatform()} Link</p>
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium break-all underline"
                >
                  {event.meetingLink}
                </a>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-600">🔒 {getMeetingPlatform()} Link Hidden</p>
                <p className="text-xs text-gray-500 mt-1">Login to view meeting link</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Host: {event.host}</p>
          <div className="flex gap-2 flex-wrap">
            {event.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleRegister}
            loading={loading}
            disabled={event.registeredParticipants >= event.maxParticipants || isRegistered}
          >
            {isRegistered ? '✓ Registered' : 'Register'}
          </Button>
          <Button variant="ghost" size="md">
            <Heart size={18} />
          </Button>
          <Button variant="ghost" size="md">
            <Share2 size={18} />
          </Button>
        </div>
      </Card>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showDetailsModal}
        event={event}
        isRegistered={isRegistered}
        onClose={() => setShowDetailsModal(false)}
        onRegister={handleRegister}
        onNavigateToLogin={() => {
          setShowDetailsModal(false);
          navigate('/login');
        }}
        onNavigateToSignup={() => {
          setShowDetailsModal(false);
          navigate('/signup');
        }}
      />
    </>
  );
};

export const CreateEvent = () => {
  const { createConference, loading } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      eventName: '',
      description: '',
      eventDate: '',
      eventTime: '',
      meetingLink: '',
      category: 'tech',
      capacity: '100',
    },
    async (formValues) => {
      setSubmitError('');
      setIsSubmitting(true);

      // Validation
      if (!formValues.eventName.trim()) {
        setFieldError('eventName', 'Event name is required');
        setIsSubmitting(false);
        return;
      }
      if (!formValues.description.trim()) {
        setFieldError('description', 'Description is required');
        setIsSubmitting(false);
        return;
      }
      if (!formValues.eventDate) {
        setFieldError('eventDate', 'Event date is required');
        setIsSubmitting(false);
        return;
      }
      if (!formValues.eventTime) {
        setFieldError('eventTime', 'Event time is required');
        setIsSubmitting(false);
        return;
      }
      if (!formValues.meetingLink.trim()) {
        setFieldError('meetingLink', 'Meeting link is required');
        setIsSubmitting(false);
        return;
      }
      if (!/^https?:\/\/.+/i.test(formValues.meetingLink)) {
        setFieldError('meetingLink', 'Meeting link must start with http:// or https://');
        setIsSubmitting(false);
        return;
      }
      if (!formValues.category) {
        setFieldError('category', 'Category is required');
        setIsSubmitting(false);
        return;
      }
      const capacityNum = parseInt(formValues.capacity);
      if (isNaN(capacityNum) || capacityNum < 1) {
        setFieldError('capacity', 'Capacity must be at least 1');
        setIsSubmitting(false);
        return;
      }

      try {
        await createConference({
          eventName: formValues.eventName,
          description: formValues.description,
          eventDate: formValues.eventDate,
          eventTime: formValues.eventTime,
          meetingLink: formValues.meetingLink,
          category: formValues.category,
          capacity: capacityNum,
        });
        
        setSuccessMessage('✅ Event created successfully! It\'s pending admin approval.');
        setTimeout(() => {
          navigate('/host/events');
        }, 2000);
      } catch (err) {
        setSubmitError(err.message || 'Failed to create event. Please try again.');
        console.error('Create event error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to create your event</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white shadow-lg">
          {successMessage && (
            <Alert type="success" message={successMessage} className="mb-6" />
          )}
          {submitError && (
            <Alert type="error" message={submitError} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="eventName"
                placeholder="e.g., Tech Innovation Summit 2024"
                value={values.eventName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.eventName}
                touched={touched.eventName}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <TextArea
                name="description"
                placeholder="Provide detailed information about your event, including topics, agenda, and what participants can expect..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                rows="5"
              />
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="eventDate"
                  value={values.eventDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.eventDate}
                  touched={touched.eventDate}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  name="eventTime"
                  value={values.eventTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.eventTime}
                  touched={touched.eventTime}
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Meeting Link (Zoom/Google Meet) <span className="text-red-500">*</span>
              </label>
              <Input
                type="url"
                name="meetingLink"
                placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                value={values.meetingLink}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.meetingLink}
                touched={touched.meetingLink}
              />
              <p className="mt-2 text-xs text-gray-500">Must start with http:// or https://</p>
            </div>

            {/* Category and Capacity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  name="category"
                  options={[
                    { label: 'Technology', value: 'tech' },
                    { label: 'Creative', value: 'creative' },
                    { label: 'Education', value: 'education' },
                    { label: 'Career', value: 'career' },
                  ]}
                  value={values.category}
                  onChange={handleChange}
                />
                {errors.category && touched.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Max Capacity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="capacity"
                  placeholder="e.g., 100"
                  value={values.capacity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.capacity}
                  touched={touched.capacity}
                  min="1"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>📋 Note:</strong> Your event will be submitted for admin approval. You can view its status in "My Events" dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={16} className="animate-pulse" /> Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={16} /> Create Event
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border border-slate-300 text-slate-700 font-medium py-3"
                onClick={() => navigate('/host/events')}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

/* Event Details Modal Component */
const EventDetailsModal = ({
  isOpen,
  event,
  isRegistered,
  onClose,
  onRegister,
  onNavigateToLogin,
  onNavigateToSignup,
}) => {
  const { isAuthenticated } = useAuth();

  const getMeetingPlatform = () => {
    if (!event?.meetingLink) return 'Virtual';
    if (event.meetingLink.includes('zoom')) return 'Zoom';
    if (event.meetingLink.includes('meet.google')) return 'Google Meet';
    return 'Virtual';
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <Badge variant="success" className="bg-white/30">
              {event.approved ? 'Approved' : 'Pending Approval'}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Not Authenticated - Ask to Login/Register */}
          {!isAuthenticated && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center mb-6">
              <Lock size={48} className="mx-auto text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Shield size={24} /> Login Required</h3>
              <p className="text-gray-600 mb-6">
                Please login or register to view event details as a User, Host, or Administrator.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onNavigateToLogin}
                  variant="primary"
                  className="flex-1"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Button>
                <Button
                  onClick={onNavigateToSignup}
                  variant="outline"
                  className="flex-1"
                >
                  <UserPlus size={18} className="mr-2" />
                  Register
                </Button>
              </div>
            </div>
          )}

          {/* Authenticated but Not Registered - Show meeting link as locked */}
          {isAuthenticated && !isRegistered && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 mb-3">
                💡 <strong>Register for this event</strong> to unlock the meeting link and join the conference.
              </p>
              <Button onClick={onRegister} variant="primary" className="w-full">
                Register for Event
              </Button>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">📝 Description</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">📅 Date</p>
                <p className="text-lg font-bold text-gray-900">{event.date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">⏰ Time</p>
                <p className="text-lg font-bold text-gray-900">{event.time}</p>
              </div>
            </div>

            {/* Meeting Link Section */}
            {event.meetingLink && isAuthenticated && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-lg">
                <p className="text-xs text-green-600 font-semibold mb-2">✅ 📍 {getMeetingPlatform()} Meeting Link</p>
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium break-all underline text-sm"
                >
                  {event.meetingLink}
                </a>
              </div>
            )}

            {/* Registration Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">👥 Participants</p>
                <p className="text-lg font-bold text-gray-900">
                  {event.registeredParticipants || 0}/{event.maxParticipants}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Host</p>
                <p className="text-lg font-bold text-gray-900">{event.host}</p>
              </div>
            </div>

            {/* Category & Tags */}
            {event.category && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">🏷️ Category</p>
                <Badge className="capitalize">{event.category}</Badge>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Tag size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-600 font-semibold">Tags</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-3">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
