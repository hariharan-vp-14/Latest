import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Loading, Alert, Modal, TextArea } from '../components/UI';
import { CheckCircle, XCircle, Clock, Calendar, User, MapPin, Users } from 'lucide-react';

export const AdminEvents = () => {
  const { getPendingEvents, updateEventStatus, loading, error } = useApp();
  const { userRole } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [processingEvent, setProcessingEvent] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, eventId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (userRole === 'admin') {
      loadPendingEvents();
    }
  }, [userRole]);

  const loadPendingEvents = async () => {
    try {
      const events = await getPendingEvents();
      setPendingEvents(events);
    } catch (err) {
      console.error('Failed to load pending events:', err);
    }
  };

  const handleApprove = async (eventId) => {
    setProcessingEvent(eventId);
    try {
      await updateEventStatus(eventId, 'approved');
      setPendingEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Failed to approve event:', err);
    } finally {
      setProcessingEvent(null);
    }
  };

  const handleRejectClick = (eventId) => {
    setRejectModal({ isOpen: true, eventId });
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessingEvent(rejectModal.eventId);
    try {
      await updateEventStatus(rejectModal.eventId, 'rejected', rejectionReason);
      setPendingEvents(prev => prev.filter(event => event._id !== rejectModal.eventId));
      setRejectModal({ isOpen: false, eventId: null });
      setRejectionReason('');
    } catch (err) {
      console.error('Failed to reject event:', err);
    } finally {
      setProcessingEvent(null);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Approval Dashboard</h1>
          <p className="text-gray-600">Review and approve events submitted by hosts</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {loading && pendingEvents.length === 0 ? (
          <Loading />
        ) : pendingEvents.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending events to review at the moment.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingEvents.map((event) => (
              <Card key={event._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {event.eventName}
                        </h3>
                        <Badge variant="secondary" className="mb-3">
                          <Clock size={14} className="mr-1" />
                          Pending Approval
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span>{event.eventTime}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>Capacity: {event.capacity}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span className="truncate">{event.meetingLink}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>Host: {event.createdBy?.fullname ? `${event.createdBy.fullname.firstname} ${event.createdBy.fullname.lastname}` : 'Unknown'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <Button
                      onClick={() => handleApprove(event._id)}
                      disabled={processingEvent === event._id}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {processingEvent === event._id ? (
                        <Loading size="sm" />
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleRejectClick(event._id)}
                      disabled={processingEvent === event._id}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {processingEvent === event._id ? (
                        <Loading size="sm" />
                      ) : (
                        <>
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Reason Modal */}
        <Modal
          isOpen={rejectModal.isOpen}
          title="Reject Event"
          onClose={() => setRejectModal({ isOpen: false, eventId: null })}
        >
          <div>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this event. This will be sent to the host.</p>
            <TextArea
              label="Rejection Reason"
              placeholder="e.g., Event violates community guidelines, insufficient details, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              required
            />
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleRejectConfirm}
                variant="danger"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Reject Event
              </Button>
              <Button
                onClick={() => setRejectModal({ isOpen: false, eventId: null })}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};