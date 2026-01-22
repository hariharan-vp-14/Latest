import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Loading, Alert, Input, Modal, TextArea, Select } from './UI';
import { Plus, Edit2, Trash2, Eye, Calendar, MapPin, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const HostEventManagement = () => {
  const { getHostEvents, loading, error, addNotification } = useApp();
  const { userRole } = useAuth();
  const [hostEvents, setHostEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    eventTime: '',
    meetingLink: '',
    category: 'tech',
    capacity: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userRole === 'Host') {
      loadHostEvents();
    }
  }, [userRole]);

  const loadHostEvents = async () => {
    try {
      const events = await getHostEvents();
      setHostEvents(events || []);
    } catch (err) {
      console.error('Failed to load host events:', err);
      addNotification('Failed to load your events', 'error');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.eventName.trim()) {
      errors.eventName = 'Event name is required';
    } else if (formData.eventName.length < 3) {
      errors.eventName = 'Event name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required';
    }

    if (!formData.eventTime) {
      errors.eventTime = 'Event time is required';
    }

    if (!formData.meetingLink.trim()) {
      errors.meetingLink = 'Meeting link is required';
    } else if (!isValidUrl(formData.meetingLink)) {
      errors.meetingLink = 'Please enter a valid URL';
    }

    if (!formData.capacity) {
      errors.capacity = 'Capacity is required';
    } else if (parseInt(formData.capacity) < 1) {
      errors.capacity = 'Capacity must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const eventPayload = {
        eventName: formData.eventName,
        description: formData.description,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        meetingLink: formData.meetingLink,
        category: formData.category,
        capacity: parseInt(formData.capacity)
      };

      const method = editingEventId ? 'PUT' : 'POST';
      const url = editingEventId 
        ? `http://localhost:4000/api/events/${editingEventId}`
        : 'http://localhost:4000/api/events';

      // Call the API directly since we don't have createEvent in AppContext yet
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include',
        body: JSON.stringify(eventPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingEventId ? 'update' : 'create'} event`);
      }

      const successMessage = editingEventId 
        ? 'Event updated successfully!'
        : 'Event created successfully! Admin will review it soon.';
      addNotification(successMessage, 'success');
      setShowCreateModal(false);
      setEditingEventId(null);
      setFormData({
        eventName: '',
        description: '',
        eventDate: '',
        eventTime: '',
        meetingLink: '',
        category: 'tech',
        capacity: ''
      });
      
      // Reload events
      await loadHostEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
      addNotification(err.message || 'Failed to save event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      addNotification('Event deleted successfully', 'success');
      await loadHostEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
      addNotification(err.message || 'Failed to delete event', 'error');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event._id);
    setFormData({
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate.split('T')[0], // Format date for input
      eventTime: event.eventTime,
      meetingLink: event.meetingLink,
      category: event.category,
      capacity: event.capacity.toString()
    });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingEventId(null);
    setFormData({
      eventName: '',
      description: '',
      eventDate: '',
      eventTime: '',
      meetingLink: '',
      category: 'tech',
      capacity: ''
    });
    setFormErrors({});
  };

  const handleViewEvent = (event) => {
    setViewingEvent(event);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingEvent(null);
  };

  const filteredEvents = statusFilter === 'all' 
    ? hostEvents 
    : hostEvents.filter(event => event.approvalStatus === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <AlertCircle size={16} />;
      case 'pending':
      default:
        return <Clock size={16} />;
    }
  };

  if (userRole !== 'Host') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only hosts can access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Your Events</h1>
            <p className="text-gray-600">Create and manage your events</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus size={20} />
            Create Event
          </Button>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Events' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <Loading />
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-12">
            <div className="mb-4">
              <Calendar size={48} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No Events Yet' : `No ${statusFilter} events`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? 'Create your first event to get started!' 
                : 'Try adjusting your filters'}
            </p>
            {statusFilter === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create First Event
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <Card key={event._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {event.eventName}
                        </h3>
                        <Badge 
                          className={`border ${getStatusColor(event.approvalStatus)} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(event.approvalStatus)}
                          {event.approvalStatus.charAt(0).toUpperCase() + event.approvalStatus.slice(1)}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {event.category}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span>{event.eventTime}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="text-gray-400" />
                        <span>Capacity: {event.capacity}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                        <MapPin size={16} className="text-gray-400" />
                        <a 
                          href={event.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {event.meetingLink}
                        </a>
                      </div>
                    </div>

                    {/* Rejection Reason (if rejected) */}
                    {event.approvalStatus === 'rejected' && event.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{event.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:min-w-[150px]">
                    {event.approvalStatus === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleEditEvent(event)}
                          variant="outline"
                          className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 size={16} className="mr-2" />
                          Edit Event
                        </Button>
                        <Button
                          onClick={() => handleDeleteEvent(event._id)}
                          variant="outline"
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Draft
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleViewEvent(event)}
                      variant="outline"
                      className="w-full"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        <Modal
          isOpen={showCreateModal}
          title={editingEventId ? "Edit Event" : "Create New Event"}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., React Workshop 2024"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className={formErrors.eventName ? 'border-red-500' : ''}
              />
              {formErrors.eventName && (
                <p className="text-red-600 text-sm mt-1">{formErrors.eventName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <TextArea
                placeholder="Describe your event in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={formErrors.description ? 'border-red-500' : ''}
              />
              {formErrors.description && (
                <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className={formErrors.eventDate ? 'border-red-500' : ''}
                />
                {formErrors.eventDate && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.eventDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <Input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className={formErrors.eventTime ? 'border-red-500' : ''}
                />
                {formErrors.eventTime && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.eventTime}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link (Zoom/Google Meet) *
              </label>
              <Input
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className={formErrors.meetingLink ? 'border-red-500' : ''}
              />
              {formErrors.meetingLink && (
                <p className="text-red-600 text-sm mt-1">{formErrors.meetingLink}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="tech">Tech</option>
                  <option value="creative">Creative</option>
                  <option value="education">Education</option>
                  <option value="career">Career</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Capacity *
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className={formErrors.capacity ? 'border-red-500' : ''}
                />
                {formErrors.capacity && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.capacity}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? (editingEventId ? 'Updating...' : 'Creating...') : (editingEventId ? 'Update Event' : 'Create Event')}
              </Button>
              <Button
                type="button"
                onClick={handleCloseModal}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Event Details Modal */}
        <Modal
          isOpen={showViewModal}
          title="Event Details"
          onClose={handleCloseViewModal}
        >
          {viewingEvent && (
            <div className="space-y-6">
              {/* Event Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{viewingEvent.eventName}</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge 
                    className={`border ${getStatusColor(viewingEvent.approvalStatus)} flex items-center gap-1`}
                  >
                    {getStatusIcon(viewingEvent.approvalStatus)}
                    {viewingEvent.approvalStatus.charAt(0).toUpperCase() + viewingEvent.approvalStatus.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {viewingEvent.category}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{viewingEvent.description}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-b">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Date & Time</h4>
                  </div>
                  <p className="text-gray-600 ml-8">
                    {new Date(viewingEvent.eventDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-600 ml-8">{viewingEvent.eventTime}</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Users size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Capacity</h4>
                  </div>
                  <p className="text-gray-600 ml-8">{viewingEvent.capacity} participants</p>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Meeting Link</h4>
                  </div>
                  <a 
                    href={viewingEvent.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all ml-8"
                  >
                    {viewingEvent.meetingLink}
                  </a>
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {viewingEvent.approvalStatus === 'rejected' && viewingEvent.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 mb-2">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{viewingEvent.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {viewingEvent.approvalStatus === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        handleCloseViewModal();
                        handleEditEvent(viewingEvent);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Edit Event
                    </Button>
                    <Button
                      onClick={() => {
                        handleCloseViewModal();
                        handleDeleteEvent(viewingEvent._id);
                      }}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      variant="outline"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleCloseViewModal}
                  variant="outline"
                  className={viewingEvent.approvalStatus === 'pending' ? 'flex-1' : 'w-full'}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
