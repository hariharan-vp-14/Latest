import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useCustom';
import { Card, Button, Input, TextArea, Badge, Loading, Alert, Tabs } from '../components/UI';
import { Mail, Phone, MapPin, Edit2, Save, X, Calendar, User, LogOut } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, loading: authLoading, userRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  if (authLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Please log in to view your profile" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user.fullname?.firstname || user.firstname || 'User';
  const lastName = user.fullname?.lastname || user.lastname || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {firstName} {lastName}
                </h1>
                <p className="text-gray-600 capitalize text-lg font-medium">
                  {userRole === 'user' ? 'Participant' : userRole === 'admin' ? 'Administrator' : 'Event Host'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email - Always shown */}
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Full Name - Always shown */}
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="font-semibold text-gray-900">{firstName} {lastName}</p>
              </div>
            </div>

            {/* Account Type - Always shown */}
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Account Type</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {userRole === 'user' ? 'Participant' : userRole === 'admin' ? 'Administrator' : 'Event Host'}
                </p>
              </div>
            </div>

            {/* Age - Optional */}
            {user.age && (
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Age</p>
                  <p className="font-semibold text-gray-900">{user.age}</p>
                </div>
              </div>
            )}

            {/* Institution - Optional */}
            {user.institution && (
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Institution</p>
                  <p className="font-semibold text-gray-900">{user.institution}</p>
                </div>
              </div>
            )}

            {/* Contact/Phone - Optional */}
            {user.contact && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Contact Number</p>
                  <p className="font-semibold text-gray-900">{user.contact}</p>
                </div>
              </div>
            )}

            {/* Education Level - Optional */}
            {user.educationLevel && (
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Education Level</p>
                  <p className="font-semibold text-gray-900">{user.educationLevel}</p>
                </div>
              </div>
            )}

            {/* Designation - Optional */}
            {user.designation && (
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Designation</p>
                  <p className="font-semibold text-gray-900">{user.designation}</p>
                </div>
              </div>
            )}

            {/* Company Name - Optional */}
            {user.companyName && (
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Company</p>
                  <p className="font-semibold text-gray-900">{user.companyName}</p>
                </div>
              </div>
            )}

            {/* Bio - Optional */}
            {user.bio && (
              <div className="col-span-2 flex items-start gap-3">
                <User size={20} className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Bio</p>
                  <p className="font-semibold text-gray-900">{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tabs */}
        {isEditing && <EditProfileForm user={user} onSave={() => setIsEditing(false)} />}
      </div>
    </div>
  );
};

const ProfileInfo = ({ user }) => {
  return (
    <Card>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Full Name</p>
          <p className="font-medium text-gray-900">{user.firstname} {user.lastname}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Account Type</p>
          <Badge variant="primary" className="capitalize">{user.role}</Badge>
        </div>
        {user.institution && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Institution</p>
            <p className="font-medium text-gray-900">{user.institution}</p>
          </div>
        )}
        {user.bio && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Bio</p>
            <p className="font-medium text-gray-900">{user.bio}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

const EditProfileForm = ({ user, onSave }) => {
  const { updateProfile, loading } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    {
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      institution: user.institution || '',
      bio: user.bio || '',
    },
    async (formValues) => {
      try {
        await updateProfile(formValues);
        onSave();
      } catch (err) {
        console.error(err);
      }
    }
  );

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="firstname"
            label="First Name"
            value={values.firstname}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstname}
            touched={touched.firstname}
          />
          <Input
            type="text"
            name="lastname"
            label="Last Name"
            value={values.lastname}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastname}
            touched={touched.lastname}
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
        />

        <Input
          type="text"
          name="institution"
          label="Institution"
          value={values.institution}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextArea
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
          value={values.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user registrations
    setLoading(false);
  }, [user?.id]);

  return (
    <Card>
      {loading ? (
        <Loading />
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map(reg => (
            <div key={reg.id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900">{reg.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{reg.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You haven't registered for any events yet.</p>
      )}
    </Card>
  );
};

const HostedEvents = () => {
  const { user } = useAuth();
  const [hostedEvents, setHostedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hosted events
    setLoading(false);
  }, [user?.id]);

  return (
    <Card>
      {loading ? (
        <Loading />
      ) : hostedEvents.length > 0 ? (
        <div className="space-y-4">
          {hostedEvents.map(event => (
            <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {event.registeredParticipants} / {event.maxParticipants} participants
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You haven't hosted any events yet.</p>
      )}
    </Card>
  );
};
