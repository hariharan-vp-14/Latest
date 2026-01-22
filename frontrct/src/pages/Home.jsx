import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Loading, Alert } from '../components/UI';
import { Calendar, MapPin, Users, ArrowRight, Accessibility, Globe, Share2, Lock, LogIn, UserPlus } from 'lucide-react';
import { Slider } from '../components/Slider';
import { HowItWorksSection } from './HowItWorks';

export const Home = () => {
  const navigate = useNavigate();
  const { events, fetchEvents, loading, error } = useApp();
  const { isAuthenticated, userRole } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchEvents({ featured: true }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setFeatured(events.slice(0, 3));
    }
  }, [events]);

  const stats = [
    { label: 'Active Events', value: '2,450+' },
    { label: 'Participants', value: '15,000+' },
    { label: 'Opportunities', value: '5,000+' },
  ];

  const howItWorksRef = useRef(null);

  const handleScrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">Showcase Your Talent. Connect with Opportunities.</h1>
                <p className="text-xl mb-8 text-gray-100">
                  Empowering students with disabilities through accessible virtual conferences and talent showcases.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-full h-80 flex items-center justify-center">
                  <Slider onHowItWorksClick={handleScrollToHowItWorks} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary-500 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
              <p className="text-gray-600 mb-6">Join upcoming conferences and showcase your talents</p>
              
              {/* Filter Buttons */}
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" size="md" className="bg-blue-600 text-white hover:bg-blue-700">
                  All Conferences
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Upcoming
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Live Now
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Tech & Innovation
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Creative Arts
                </Button>
              </div>
            </div>

            {loading && <Loading />}
            {error && <Alert type="error" message={error} />}

            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((event) => (
                <FeaturedEventCard key={event._id || event.id || Math.random()} event={event} />
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose TalentConnect?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <div className="mb-4 flex justify-center">
                  <Accessibility size={60} className="text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Accessible</h3>
                <p className="text-gray-600">
                  Designed for everyone with comprehensive accessibility features including screen readers, captions, and more.
                </p>
              </Card>

              <Card className="text-center">
                <div className="mb-4 flex justify-center">
                  <Globe size={60} className="text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Virtual Conferences</h3>
                <p className="text-gray-600">
                  Join from anywhere in the world. No travel required, just pure connection and opportunity.
                </p>
              </Card>

              <Card className="text-center">
                <div className="mb-4 flex justify-center">
                  <Share2 size={60} className="text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Networking Opportunities</h3>
                <p className="text-gray-600">
                  Connect with industry professionals, mentors, and fellow talented individuals globally.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Showcase Your Talent?</h2>
            <p className="text-xl mb-8 text-gray-100">Join thousands of talented individuals in our community.</p>
            <Button variant="primary" size="lg" className="bg-white text-primary-500 hover:bg-gray-100">
              {isAuthenticated ? 'Browse Events' : 'Create an Account'}
            </Button>
          </div>
        </div>
      </div>
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>
    </>
  );
};

/* ================= FEATURED EVENT CARD WITH DETAILS MODAL ================= */
const FeaturedEventCard = ({ event }) => {
  const { isAuthenticated } = useAuth();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const getMeetingPlatform = () => {
    if (!event.meetingLink) return 'Virtual';
    if (event.meetingLink.includes('zoom')) return 'Zoom';
    if (event.meetingLink.includes('meet.google')) return 'Google Meet';
    return 'Virtual';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Card hover className="flex flex-col cursor-pointer transition-all" onClick={() => setShowDetailsModal(true)}>
        <div className="mb-4">
          <Badge variant="success">Featured</Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.eventName || event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-blue-600" />
            <span>{formatDate(event.eventDate)}</span>
            <span className="text-gray-400">•</span>
            <span>{event.eventTime || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-green-600" />
            <span>{event.capacity} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-red-600" />
            <span>{getMeetingPlatform()}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {event.category && (
            <Badge variant="primary" className="text-xs capitalize">
              {event.category}
            </Badge>
          )}
        </div>

        <Button 
          variant="primary" 
          className="w-full gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailsModal(true);
          }}
        >
          View Full Details <ArrowRight size={16} />
        </Button>
      </Card>

      {/* Event Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{event.eventName || event.title}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex gap-2">
                <Badge variant="success">Approved</Badge>
                <Badge variant="primary" className="capitalize">
                  {event.category}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-b">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" /> Date & Time
                  </h4>
                  <p className="text-gray-600">{formatDate(event.eventDate)}</p>
                  <p className="text-gray-600">{event.eventTime || 'Time TBD'}</p>
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
                  {isAuthenticated ? (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {event.meetingLink}
                    </a>
                  ) : (
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Lock size={16} /> Login to view meeting link
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Host Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Hosted By</h4>
                <p className="text-gray-600">
                  {event.createdBy?.fullname 
                    ? `${event.createdBy.fullname.firstname} ${event.createdBy.fullname.lastname}`
                    : event.host || 'Professional Host'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {isAuthenticated ? (
                  <Button 
                    variant="primary" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => {
                      setShowDetailsModal(false);
                      navigate('/events');
                    }}
                  >
                    Register for Event
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="primary" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowDetailsModal(false);
                        navigate('/login');
                      }}
                    >
                      <LogIn size={16} /> Login
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowDetailsModal(false);
                        navigate('/signup');
                      }}
                    >
                      <UserPlus size={16} /> Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Home;
