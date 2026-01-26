import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Globe, Zap, Award } from 'lucide-react';
import { Button } from '../components/UI';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition font-medium hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">About TalentConnect</h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Empowering Talent, Celebrating Diversity</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            TalentConnect Pro is a revolutionary platform dedicated to discovering and nurturing diverse talent from individuals of all backgrounds and abilities. We create inclusive spaces where everyone's potential can shine.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-blue-100">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target size={28} className="text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To create an inclusive digital ecosystem that connects talented individuals with opportunities, mentors, and communities that celebrate diversity and foster growth.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe every person has unique talents and perspectives worth sharing. Our platform removes barriers, amplifies voices, and creates meaningful connections that transform careers and lives.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Target size={80} className="text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-semibold">Connecting Talent with Opportunity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-purple-100">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 flex items-center justify-center min-h-[300px] order-last md:order-first">
              <div className="text-center">
                <Globe size={80} className="text-purple-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-semibold">A Global Community of Inclusion</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe size={28} className="text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                A world where talent is recognized, celebrated, and nurtured regardless of background, ability, or circumstance.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We envision a future where diversity is not just accepted but actively valued as the driving force behind innovation and success. Every individual deserves a platform where they can shine and grow.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Inclusivity */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart size={28} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Inclusivity</h4>
              <p className="text-gray-600">
                We celebrate diversity in all its forms and create spaces where everyone feels welcome, valued, and able to participate fully.
              </p>
            </div>

            {/* Empowerment */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Zap size={28} className="text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Empowerment</h4>
              <p className="text-gray-600">
                We provide tools, resources, and opportunities that help individuals discover their potential and achieve their goals.
              </p>
            </div>

            {/* Excellence */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award size={28} className="text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Excellence</h4>
              <p className="text-gray-600">
                We are committed to delivering exceptional experiences and maintaining high standards in everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 mb-16 text-white">
          <h3 className="text-3xl font-bold mb-8">What We Do</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users size={24} />
                Host Virtual Events
              </h4>
              <p className="text-blue-50">
                We organize accessible virtual conferences, talent showcases, and networking events that bring together diverse communities and create meaningful connections.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Target size={24} />
                Connect Opportunities
              </h4>
              <p className="text-blue-50">
                We bridge the gap between talented individuals and employers, mentors, and organizations looking for diverse perspectives and fresh talent.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Heart size={24} />
                Build Community
              </h4>
              <p className="text-blue-50">
                We foster supportive communities where members can network, share experiences, and grow together in a safe and inclusive environment.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Zap size={24} />
                Showcase Talent
              </h4>
              <p className="text-blue-50">
                We provide platforms and opportunities for talented individuals to showcase their skills, gain recognition, and launch successful careers.
              </p>
            </div>
          </div>
        </div>

        {/* Numbers Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '2,450+', label: 'Active Events', icon: '📅' },
            { number: '15,000+', label: 'Community Members', icon: '👥' },
            { number: '5,000+', label: 'Opportunities Created', icon: '🚀' },
            { number: '50+', label: 'Countries Reached', icon: '🌍' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h4 className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</h4>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Join Our Community Today</h3>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Be part of a movement that celebrates diversity, empowers talent, and creates opportunities for everyone. Your unique perspective matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold"
              onClick={() => navigate('/how-it-works')}
            >
              Learn How It Works
            </Button>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 font-semibold"
              onClick={() => navigate('/signup')}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
