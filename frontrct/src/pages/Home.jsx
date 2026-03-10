import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Loading, Alert } from '../components/UI';
import { Calendar, MapPin, Users, ArrowRight, Accessibility, Globe, Share2, Lock, LogIn, UserPlus, MessageCircle, Shield, Star, Award, Zap, Heart, QrCode, Smartphone, CheckCircle2 } from 'lucide-react';
import { Slider } from '../components/Slider';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
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
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 border-b border-gray-100">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold mb-6 text-gray-900 leading-[1.1] tracking-tight">
                  Showcase Your Talent. Connect with Opportunities.
                </h1>
                <p className="text-lg mb-8 text-gray-500 leading-relaxed max-w-lg">
                  Empowering students with disabilities through accessible virtual conferences and talent showcases.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="primary" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 shadow-sm"
                    onClick={() => navigate('/how-it-works')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6"
                    onClick={() => {
                      document.getElementById('featured-events').scrollIntoView({ behavior: 'smooth' });
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
        <div className="container-main py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center py-8 px-6 rounded-xl border border-gray-100 bg-white shadow-card hover:shadow-card-hover transition-shadow">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        <div id="featured-events" className="section bg-gray-50/60 border-t border-gray-100">
          <div className="container-main">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Featured Events</h2>
              <p className="text-gray-500 mb-6">Join upcoming conferences and showcase your talents</p>
              
              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                {['All Conferences', 'Upcoming', 'Live Now', 'Tech & Innovation', 'Creative Arts'].map((label, i) => (
                  <button key={label} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900">
                    {label}
                  </button>
                ))}
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
            <div className="mt-24 pt-16 border-t border-gray-200">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-medium text-sm px-4 py-1.5 rounded-full mb-4">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live Community
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Join Our Real-time Community</h2>
                      <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Connect with 5,000+ students, hosts, and employers. Get instant notifications, networking opportunities, and peer support.
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                      {[
                        { icon: Users, title: "5,000+ Members", desc: "Active community of professionals and learners", accent: "bg-green-50", accentText: "text-green-600" },
                        { icon: MessageCircle, title: "Real-time Updates", desc: "Instant notifications about new events and opportunities", accent: "bg-blue-50", accentText: "text-blue-600" },
                        { icon: Shield, title: "Safe & Moderated", desc: "Professional environment with active moderation", accent: "bg-violet-50", accentText: "text-violet-600" },
                      ].map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-gray-100 p-6 text-center hover:shadow-card transition-shadow">
                          <div className={`w-12 h-12 ${item.accent} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                            <item.icon size={22} className={item.accentText} />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                      <a 
                        href="https://chat.whatsapp.com/your-community-link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
                      >
                        Join WhatsApp Community
                        <ArrowRight size={18} />
                      </a>
                      <p className="text-xs text-gray-400 mt-3">Free to join · No spam · Community-driven</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories Section */}
            <div className="mt-24 pt-16 border-t border-gray-200">
              <div className="section-header">
                <h2>Success Stories</h2>
                <p>Inspiring achievements from our community members</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Sarah's Story */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
                  <div className="h-1 bg-blue-600"></div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Award size={20} className="text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Tech Career</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarah's Journey to Google</h3>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                      Despite visual impairment, Sarah landed a software engineering internship at Google after showcasing her coding skills at our Tech Talent Conference.
                    </p>
                    <div className="bg-blue-50 rounded-lg px-4 py-3 mb-5">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-blue-600" />
                        <span className="font-medium text-blue-900 text-sm">Google Internship 2023</span>
                      </div>
                    </div>
                    <a href="#" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Michael's Story */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
                  <div className="h-1 bg-amber-500"></div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-amber-600" />
                      </div>
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Art & Design</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Michael's Art Exhibition</h3>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                      Michael, who has cerebral palsy, sold his digital art collection for $15,000 after connecting with galleries through our Creative Arts Conference.
                    </p>
                    <div className="bg-amber-50 rounded-lg px-4 py-3 mb-5">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-600" />
                        <span className="font-medium text-amber-900 text-sm">$15,000 Art Sales</span>
                      </div>
                    </div>
                    <a href="#" className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-medium text-sm group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Emma's Story */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
                  <div className="h-1 bg-rose-500"></div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                        <Award size={20} className="text-rose-600" />
                      </div>
                      <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Music Career</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Emma's Music Career Launch</h3>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                      Hearing-impaired musician Emma secured a recording contract after performing at our Accessible Music Showcase, reaching 1M+ streams in her first month.
                    </p>
                    <div className="bg-rose-50 rounded-lg px-4 py-3 mb-5">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-rose-600" />
                        <span className="font-medium text-rose-900 text-sm">Platinum Music Career</span>
                      </div>
                    </div>
                    <a href="#" className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium text-sm group/link transition-colors">
                      Read Full Story
                      <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
      <div id="donation" className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Header with Icon */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-medium text-sm px-4 py-1.5 rounded-full mb-4">
                <Heart size={14} className="fill-red-500" />
                Support Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Help Us Make a Difference</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Help us provide free conference access and resources to students with disabilities worldwide.
              </p>
            </div>

            {/* Impact Info */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { value: "100%", desc: "Funds go directly to accessibility initiatives", accent: "text-blue-600" },
                { value: "5,000+", desc: "Students helped globally this year", accent: "text-emerald-600" },
                { value: "50+", desc: "Countries reached with our programs", accent: "text-violet-600" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 p-6 text-center">
                  <div className={`text-3xl font-bold ${item.accent} mb-2`}>{item.value}</div>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
                onClick={() => setShowDonationModal(true)}
              >
                <Heart size={18} className="fill-white" />
                Make a Donation
              </Button>
              <p className="text-xs text-gray-400 mt-3">Your contribution changes lives</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <AboutSection />

      {/* Contact Us Section */}
      <ContactSection />

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Heart size={22} className="text-red-500 fill-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Support Our Mission</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <p className="text-gray-500 leading-relaxed">
            Scan the QR code below with your phone to make a donation via UPI. Your contribution will directly support students with disabilities worldwide.
          </p>

          {/* QR Code Section */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-6">
              <QrCode size={20} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Scan to Donate</h3>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D9019807194%40slc%26pn%3DMr%2520Hariharan%2520V%2520P" 
                  alt="UPI Donation QR Code"
                  className="w-56 h-56"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
            <div className="text-center mt-5">
              <p className="text-sm font-medium text-gray-700">UPI ID: 9019807194@slc</p>
              <p className="text-xs text-gray-400 mt-1">Account holder: Mr Hariharan V P</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={16} className="text-emerald-600" />
              <h4 className="font-semibold text-emerald-900 text-sm">How to donate</h4>
            </div>
            <ol className="text-sm text-emerald-800 space-y-2">
              {[
                "Open your UPI app (Google Pay, PhonePe, Paytm, etc.)",
                "Scan this QR code with your phone camera",
                "Enter the donation amount",
                "Complete the payment",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="flex-shrink-0 text-emerald-600" />
                <span>You'll receive a payment confirmation</span>
              </li>
            </ol>
          </div>

          {/* Close Button */}
          <Button
            variant="primary"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 flex items-center gap-2 justify-center"
            onClick={() => {
              addNotification('Thank you for your support! 💝', 'success');
              onClose();
            }}
          >
            <CheckCircle2 size={18} />
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
