import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useCustom';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, TextArea, Badge, Select, Loading, Alert, Modal } from '../components/UI';
import { Plus, Edit2, Trash2, Eye, Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

/* ================= HOST EVENT MANAGEMENT ================= */
export const HostEventManagement = () => {
  const { user, userRole } = useAuth();
  const [hostEvents, setHostEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  // Fetch host's events
  const fetchHostEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.request('/api/events/host-events', {
        method: 'GET',
      });
      setHostEvents(response.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'host') {
      fetchHostEvents();
    }
  }, [userRole]);

  const filteredEvents = hostEvents.filter(event => {
    if (filter === 'all') return true;
    return event.approvalStatus === filter;
  });

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedEvent(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">✓ Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">✗ Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">◆ Pending Review</Badge>;
      default:
        return <Badge variant="info">Draft</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600 mt-1">Create and manage your hosted events</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus size={20} /> Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error */}
        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All Events' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading && <Loading />}

        {!loading && filteredEvents.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-gray-600 text-lg">
              {filter === 'all'
                ? 'No events created yet. Start by creating your first event!'
                : `No ${filter} events found.`}
            </p>
            {filter === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                className="mt-6"
              >
                Create Your First Event
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <HostEventCard
                key={event._id}
                event={event}
                onRefresh={fetchHostEvents}
                getStatusBadge={getStatusBadge}
                onView={handleViewEvent}
                onEdit={handleEditEvent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchHostEvents();
          }}
        />
      )}

      {/* View Event Modal */}
      {showViewModal && selectedEvent && (
        <ViewEventModal
          event={selectedEvent}
          onClose={handleCloseViewModal}
          onEdit={handleEditEvent}
          onRefresh={fetchHostEvents}
        />
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            handleCloseEditModal();
            fetchHostEvents();
          }}
        />
      )}
    </div>
  );
};

/* ================= HOST EVENT CARD ================= */
const HostEventCard = ({ event, onRefresh, getStatusBadge, onView, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      await apiService.request(`/api/events/${event._id}`, {
        method: 'DELETE',
      });
      onRefresh();
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{event.eventName}</h3>
        {getStatusBadge(event.approvalStatus)}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-green-600" />
          {event.capacity} participants
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onView(event)}
          variant="secondary"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1"
        >
          <Eye size={16} /> View
        </Button>
        {event.approvalStatus === 'pending' && (
          <Button
            onClick={() => onEdit(event)}
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
          >
            <Edit2 size={16} /> Edit
          </Button>
        )}
        {event.approvalStatus === 'pending' && (
          <Button
            onClick={handleDelete}
            variant="danger"
            size="sm"
            disabled={loading}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </Card>
  );
};

/* ================= CREATE EVENT MODAL ================= */
const CreateEventModal = ({ onClose, onSuccess }) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      eventName: '',
      description: '',
      eventDate: '',
      eventTime: '',
      meetingLink: '',
      category: 'tech',
      capacity: '50',
    },
    async (formValues) => {
      if (!formValues.eventName) {
        setFieldError('eventName', 'Event name is required');
        return;
      }
      if (!formValues.description) {
        setFieldError('description', 'Description is required');
        return;
      }
      if (!formValues.meetingLink) {
        setFieldError('meetingLink', 'Meeting link is required');
        return;
      }

      try {
        await apiService.request('/api/events', {
          method: 'POST',
          body: JSON.stringify({
            eventName: formValues.eventName,
            description: formValues.description,
            eventDate: formValues.eventDate,
            eventTime: formValues.eventTime,
            meetingLink: formValues.meetingLink,
            category: formValues.category,
            capacity: parseInt(formValues.capacity),
          }),
        });
        onSuccess();
      } catch (err) {
        setFieldError('submit', err.message);
      }
    }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="eventName"
            label="Event Title"
            placeholder="Tech Innovation Summit 2024"
            value={values.eventName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.eventName}
            touched={touched.eventName}
            required
          />

          <TextArea
            name="description"
            label="Description"
            placeholder="Describe your event in detail..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            rows="4"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              name="eventDate"
              label="Event Date"
              value={values.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.eventDate}
              touched={touched.eventDate}
              required
            />
            <Input
              type="time"
              name="eventTime"
              label="Event Time"
              value={values.eventTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.eventTime}
              touched={touched.eventTime}
              required
            />
          </div>

          <Input
            type="url"
            name="meetingLink"
            label="Meeting Link"
            placeholder="https://zoom.us/j/..."
            value={values.meetingLink}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.meetingLink}
            touched={touched.meetingLink}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              name="category"
              label="Category"
              options={[
                { label: 'Technology', value: 'tech' },
                { label: 'Creative', value: 'creative' },
                { label: 'Education', value: 'education' },
                { label: 'Career', value: 'career' },
              ]}
              value={values.category}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="capacity"
              label="Max Participants"
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
          </div>

          {errors.submit && <Alert type="error" message={errors.submit} />}

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Create Event
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

/* ================= VIEW EVENT MODAL ================= */
const ViewEventModal = ({ event, onClose, onEdit, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      await apiService.request(`/api/events/${event._id}`, {
        method: 'DELETE',
      });
      onClose();
      onRefresh();
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.eventName}</h3>
            <Badge variant={event.approvalStatus === 'pending' ? 'warning' : 'info'} className="mb-4">
              {event.approvalStatus.charAt(0).toUpperCase() + event.approvalStatus.slice(1)}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-b">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> Date & Time
              </h4>
              <p className="text-gray-600">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-gray-600">{event.eventTime}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users size={18} className="text-green-600" /> Capacity
              </h4>
              <p className="text-gray-600">{event.capacity} participants</p>
            </div>

            <div className="col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-red-600" /> Meeting Link
              </h4>
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {event.meetingLink}
              </a>
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
            <p className="text-gray-600 capitalize">{event.category}</p>
          </div>

          {/* Rejection Reason (if rejected) */}
          {event.approvalStatus === 'rejected' && event.rejectionReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-900 mb-2">Rejection Reason:</p>
              <p className="text-sm text-red-700">{event.rejectionReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {event.approvalStatus === 'pending' && (
              <>
                <Button
                  onClick={() => onEdit(event)}
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Edit Event
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="secondary" className={event.approvalStatus === 'pending' ? 'flex-1' : 'w-full'}>
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ================= EDIT EVENT MODAL ================= */
const EditEventModal = ({ event, onClose, onSuccess }) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError } = useForm(
    {
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate.split('T')[0],
      eventTime: event.eventTime,
      meetingLink: event.meetingLink,
      category: event.category,
      capacity: event.capacity.toString(),
    },
    async (formValues) => {
      if (!formValues.eventName) {
        setFieldError('eventName', 'Event name is required');
        return;
      }
      if (!formValues.description) {
        setFieldError('description', 'Description is required');
        return;
      }
      if (!formValues.meetingLink) {
        setFieldError('meetingLink', 'Meeting link is required');
        return;
      }

      try {
        await apiService.request(`/api/events/${event._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            eventName: formValues.eventName,
            description: formValues.description,
            eventDate: formValues.eventDate,
            eventTime: formValues.eventTime,
            meetingLink: formValues.meetingLink,
            category: formValues.category,
            capacity: parseInt(formValues.capacity),
          }),
        });
        onSuccess();
      } catch (err) {
        setFieldError('submit', err.message);
      }
    }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="eventName"
            label="Event Title"
            placeholder="Tech Innovation Summit 2024"
            value={values.eventName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.eventName}
            touched={touched.eventName}
            required
          />

          <TextArea
            name="description"
            label="Description"
            placeholder="Describe your event in detail..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            rows="4"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              name="eventDate"
              label="Event Date"
              value={values.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.eventDate}
              touched={touched.eventDate}
              required
            />
            <Input
              type="time"
              name="eventTime"
              label="Event Time"
              value={values.eventTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.eventTime}
              touched={touched.eventTime}
              required
            />
          </div>

          <Input
            type="url"
            name="meetingLink"
            label="Meeting Link"
            placeholder="https://zoom.us/j/..."
            value={values.meetingLink}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.meetingLink}
            touched={touched.meetingLink}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              name="category"
              label="Category"
              options={[
                { label: 'Technology', value: 'tech' },
                { label: 'Creative', value: 'creative' },
                { label: 'Education', value: 'education' },
                { label: 'Career', value: 'career' },
              ]}
              value={values.category}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="capacity"
              label="Max Participants"
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
          </div>

          {errors.submit && <Alert type="error" message={errors.submit} />}

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Update Event
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default HostEventManagement;
