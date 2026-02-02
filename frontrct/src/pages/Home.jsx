import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Loading, Alert } from '../components/UI';
import { Calendar, MapPin, Users, ArrowRight, Accessibility, Globe, Share2, Lock, LogIn, UserPlus, MessageCircle, Shield, Star, Award, Zap, Heart, QrCode, Smartphone, CheckCircle2 } from 'lucide-react';
import { Slider } from '../components/Slider';
import api from '../services/api';

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

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
                  Showcase Your Talent. Connect with Opportunities.
                </h1>
                <p className="text-lg sm:text-xl mb-6 md:mb-8 text-gray-700 leading-relaxed">
                  Empowering students with disabilities through accessible virtual conferences and talent showcases.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6"
                    onClick={() => navigate('/how-it-works')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6"
                    onClick={() => {
                      if (userRole === 'admin' || userRole === 'host' || userRole === 'user') {
                        document.getElementById('featured-events').scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/events');
                      }
                    }}
                  >
                    Explore Events
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2 mb-8 md:mb-0">
                <div className="w-full h-64 sm:h-72 md:h-80 flex items-center justify-center">
                  <Slider />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        <div id="featured-events" className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Featured Events</h2>
              <p className="text-gray-600 mb-4 md:mb-6">Join upcoming conferences and showcase your talents</p>
              
              {/* Filter Buttons */}
              <div className="flex gap-2 md:gap-3 flex-wrap">
                <Button variant="primary" size="md" className="bg-blue-600 text-white hover:bg-blue-700 text-sm md:text-base">
                  All Conferences
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base">
                  Upcoming
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base">
                  Live Now
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base">
                  Tech & Innovation
                </Button>
                <Button variant="outline" size="md" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base">
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

            {/* WhatsApp Community Section */}
            <div className="mt-20 pt-16 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        ♦
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Join Our Real-time Community</h2>
                    </div>
                    <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
                      Connect with 5,000+ students, hosts, and employers in our active WhatsApp community. Get instant notifications, networking opportunities, and peer support.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {/* Members Card */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users size={28} className="text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">5,000+ Members</h3>
                      <p className="text-sm text-gray-600">Active community of professionals and learners</p>
                    </div>

                    {/* Real-time Updates Card */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle size={28} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                      <p className="text-sm text-gray-600">Instant notifications about new events and opportunities</p>
                    </div>

                    {/* Safe & Moderated Card */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield size={28} className="text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Safe & Moderated</h3>
                      <p className="text-sm text-gray-600">Professional environment with active moderation</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <a 
                      href="https://chat.whatsapp.com/your-community-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center gap-2">
                        Join WhatsApp Community
                        <ArrowRight size={20} />
                      </span>
                    </a>
                    <p className="text-sm text-gray-500 mt-4">Free to join • No spam • Community-driven</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories Section */}
            <div className="mt-20 pt-16 border-t border-gray-200">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Success Stories</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Inspiring achievements from our community members</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Sarah's Story */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-8">
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award size={24} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tech Career</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Sarah's Journey to Google</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      Despite visual impairment, Sarah landed a software engineering internship at Google after showcasing her coding skills at our Tech Talent Conference.
                    </p>

                    {/* Achievement Badge */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-5 border-l-4 border-blue-600">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-900">Google Internship 2023</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Michael's Story */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
                  <div className="p-8">
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap size={24} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Art & Design</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Michael's Art Exhibition</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      Michael, who has cerebral palsy, sold his digital art collection for $15,000 after connecting with galleries through our Creative Arts Conference.
                    </p>

                    {/* Achievement Badge */}
                    <div className="bg-orange-50 rounded-lg p-4 mb-5 border-l-4 border-orange-600">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="text-orange-600" />
                        <span className="font-semibold text-orange-900">$15,000 Art Sales</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <a href="#" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Emma's Story */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600"></div>
                  <div className="p-8">
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <Award size={24} className="text-pink-600" />
                      </div>
                      <span className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Music Career</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Emma's Music Career Launch</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      Hearing-impaired musician Emma secured a recording contract after performing at our Accessible Music Showcase, reaching 1M+ streams in her first month.
                    </p>

                    {/* Achievement Badge */}
                    <div className="bg-pink-50 rounded-lg p-4 mb-5 border-l-4 border-pink-600">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="text-pink-600" />
                        <span className="font-semibold text-pink-900">Platinum Music Career</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <a href="#" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Section */}
            <div className="mt-20 pt-16 border-t border-gray-200">
              <DonationSection />
            </div>
          </div>
        </div>

        {/* Features Section - REMOVED */}


        {/* CTA Section - REMOVED */}

      </div>
    </>
  );
};
const FeaturedEventCard = ({ event }) => {
  const { addNotification } = useApp();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    age: '',
    email: '',
    instituteName: ''
  });
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

  const handleEmailCheck = (email) => {
    if (email) {
      checkRegistrationStatus(email);
    }
  };

  const checkRegistrationStatus = async (email) => {
    if (!email) return;
    setCheckingRegistration(true);
    try {
      const response = await api.checkEventRegistration(email, event._id || event.id);
      setIsRegistered(response.isRegistered);
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
    // Check registration if we have email from localStorage or user input
    const savedEmail = localStorage.getItem('registrationEmail');
    if (savedEmail) {
      checkRegistrationStatus(savedEmail);
    }
  };

  const handleRegisterClick = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);

    try {
      const response = await api.registerForEvent({
        ...registrationForm,
        eventId: event._id || event.id
      });

      addNotification(response.message, 'success');
      setIsRegistered(true);
      localStorage.setItem('registrationEmail', registrationForm.email);
      setShowRegistrationModal(false);
      setRegistrationForm({ name: '', age: '', email: '', instituteName: '' });
    } catch (error) {
      addNotification(error.message || 'Registration failed', 'error');
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <>
      <Card hover className="flex flex-col cursor-pointer transition-all" onClick={handleViewDetails}>
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
            handleViewDetails();
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
                  {isRegistered ? (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {event.meetingLink}
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-100 rounded-lg filter blur-sm">
                        <p className="text-sm text-gray-600 break-all">
                          {event.meetingLink || 'Meeting link will be available after registration'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          placeholder="Enter your email to check registration"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => handleEmailCheck(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleRegisterClick}
                          className="whitespace-nowrap"
                        >
                          Register Here
                        </Button>
                      </div>
                      {checkingRegistration && (
                        <p className="text-sm text-gray-500">Checking registration status...</p>
                      )}
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={registrationForm.age}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute Name *
                </label>
                <input
                  type="text"
                  required
                  value={registrationForm.instituteName}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, instituteName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your institute/school name"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={registrationLoading}
                >
                  {registrationLoading ? 'Registering...' : 'Register for Event'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

/* ==================== DONATION SECTION COMPONENT ==================== */
const DonationSection = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-pink-50 rounded-2xl p-8 md:p-12 shadow-lg border border-red-100">
        <div className="max-w-4xl mx-auto">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart size={32} className="text-red-600 fill-red-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Support Our Mission</h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Help us provide free conference access and resources to students with disabilities worldwide.
            </p>
          </div>

          {/* Impact Info with Icons */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-red-100">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Zap size={24} className="text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
              <p className="text-gray-600 text-sm">Funds go directly to accessibility initiatives</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">5,000+</div>
              <p className="text-gray-600 text-sm">Students helped globally this year</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-pink-100">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Globe size={24} className="text-pink-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-pink-600 mb-2">50+</div>
              <p className="text-gray-600 text-sm">Countries reached with our programs</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center gap-2 justify-center mx-auto"
              onClick={() => setShowDonationModal(true)}
            >
              <Heart size={24} className="fill-white" />
              Make a Donation
            </Button>
            <p className="text-sm text-gray-500 mt-4">Your contribution changes lives</p>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </>
  );
};

/* ==================== DONATION MODAL COMPONENT ==================== */
const DonationModal = ({ isOpen, onClose }) => {
  const { addNotification } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Heart size={28} className="text-red-600 fill-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Support Our Mission</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 text-center">
          {/* Description */}
          <div>
            <p className="text-gray-600 text-lg mb-6">
              Scan the QR code below with your phone to make a donation via UPI. Your contribution will directly support our mission to provide free conference access and resources to students with disabilities worldwide.
            </p>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-6">
              <QrCode size={28} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Scan to Donate</h3>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=donate@talentconnect.com&pn=TalentConnect%20Pro&tr=Support%20Our%20Mission" 
                  alt="UPI Donation QR Code"
                  className="w-64 h-64"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-6 font-medium">UPI: donate@talentconnect.com</p>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={20} className="text-green-600" />
              <h4 className="font-semibold text-green-900">How to donate:</h4>
            </div>
            <ol className="text-left text-sm text-green-800 space-y-2">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Scan this QR code with your phone camera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Enter the donation amount</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Complete the payment</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="flex-shrink-0 text-green-600 fill-green-600" />
                <span>You'll receive a payment confirmation</span>
              </li>
            </ol>
          </div>

          {/* Closing Message */}
          <div className="text-center">
            <p className="text-gray-700 font-semibold mb-4">
              Thank you for supporting inclusive education! 💝
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart size={20} className="text-red-600 fill-red-600 animate-pulse" />
              <span className="text-2xl">💝</span>
              <Heart size={20} className="text-red-600 fill-red-600 animate-pulse" />
            </div>
            <Button
              variant="primary"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 flex items-center gap-2 justify-center"
              onClick={() => {
                addNotification('Thank you for your support! 💝', 'success');
                onClose();
              }}
            >
              <CheckCircle2 size={20} />
              Done
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
