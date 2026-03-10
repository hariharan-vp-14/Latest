import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Globe, Zap, Award } from 'lucide-react';
import { Button } from '../components/UI';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <h1 className="text-xl font-semibold text-gray-900">About TalentConnect</h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Empowering Talent, Celebrating Diversity</h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            TalentConnect Pro is a revolutionary platform dedicated to discovering and nurturing diverse talent from individuals of all backgrounds and abilities. We create inclusive spaces where everyone's potential can shine.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8 md:p-10 mb-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Target size={20} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-500 leading-relaxed mb-3">
                To create an inclusive digital ecosystem that connects talented individuals with opportunities, mentors, and communities that celebrate diversity and foster growth.
              </p>
              <p className="text-gray-500 leading-relaxed">
                We believe every person has unique talents and perspectives worth sharing. Our platform removes barriers, amplifies voices, and creates meaningful connections that transform careers and lives.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[280px] border border-gray-100">
              <div className="text-center">
                <Target size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-sm">Connecting Talent with Opportunity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8 md:p-10 mb-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[280px] border border-gray-100 order-last md:order-first">
              <div className="text-center">
                <Globe size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-sm">A Global Community of Inclusion</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-500 leading-relaxed mb-3">
                A world where talent is recognized, celebrated, and nurtured regardless of background, ability, or circumstance.
              </p>
              <p className="text-gray-500 leading-relaxed">
                We envision a future where diversity is not just accepted but actively valued as the driving force behind innovation and success. Every individual deserves a platform where they can shine and grow.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Our Core Values</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Inclusivity */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-7 hover:shadow-card-hover transition-shadow">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Heart size={22} className="text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Inclusivity</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                We celebrate diversity in all its forms and create spaces where everyone feels welcome, valued, and able to participate fully.
              </p>
            </div>

            {/* Empowerment */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-7 hover:shadow-card-hover transition-shadow">
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <Zap size={22} className="text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Empowerment</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                We provide tools, resources, and opportunities that help individuals discover their potential and achieve their goals.
              </p>
            </div>

            {/* Excellence */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-7 hover:shadow-card-hover transition-shadow">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Award size={22} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                We are committed to delivering exceptional experiences and maintaining high standards in everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-gray-900 rounded-xl p-8 md:p-10 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">What We Do</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                Host Virtual Events
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We organize accessible virtual conferences, talent showcases, and networking events that bring together diverse communities and create meaningful connections.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                Connect Opportunities
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We bridge the gap between talented individuals and employers, mentors, and organizations looking for diverse perspectives and fresh talent.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Heart size={18} className="text-pink-400" />
                Build Community
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We foster supportive communities where members can network, share experiences, and grow together in a safe and inclusive environment.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                Showcase Talent
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We provide platforms and opportunities for talented individuals to showcase their skills, gain recognition, and launch successful careers.
              </p>
            </div>
          </div>
        </div>

        {/* Numbers Section */}
        <div className="grid md:grid-cols-4 gap-5 mb-16">
          {[
            { number: '2,450+', label: 'Active Events', icon: '📅' },
            { number: '15,000+', label: 'Community Members', icon: '👥' },
            { number: '5,000+', label: 'Opportunities Created', icon: '🚀' },
            { number: '50+', label: 'Countries Reached', icon: '🌍' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-card border border-gray-200 p-6 text-center hover:shadow-card-hover transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h4>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 md:p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Our Community Today</h3>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Be part of a movement that celebrates diversity, empowers talent, and creates opportunities for everyone. Your unique perspective matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="primary"
              className="bg-gray-900 hover:bg-gray-800 text-white px-7 py-2.5 font-medium shadow-sm"
              onClick={() => navigate('/how-it-works')}
            >
              Learn How It Works
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-7 py-2.5 font-medium"
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
