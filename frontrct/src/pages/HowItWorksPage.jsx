import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Calendar, Video, Trophy, ArrowLeft, Accessibility, Globe, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={48} className="text-white" />,
    badge: "1",
    title: "Create Your Account",
    description:
      "Sign up as a participant or host in just a few clicks. Tell us about yourself and any accessibility needs you have. Our platform is designed to be inclusive for everyone.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Calendar size={48} className="text-white" />,
    badge: "2",
    title: "Discover Events",
    description:
      "Browse our curated collection of virtual conferences and talent showcases. Filter by topics, dates, and accessibility features that matter to you.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: <Video size={48} className="text-white" />,
    badge: "3",
    title: "Connect & Network",
    description:
      "Join events with our fully accessible platform. Network with peers, industry professionals, and discover new opportunities in your field.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <Trophy size={48} className="text-white" />,
    badge: "4",
    title: "Showcase & Grow",
    description:
      "Present your talents and skills with confidence. Get valuable feedback from experts and unlock career opportunities that align with your goals.",
    color: "from-green-500 to-green-600"
  },
];

export const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            How TalentConnect Works
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-20">
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Empowering students with disabilities through accessible virtual conferences and opportunities. 
              Our platform makes it easy to discover, connect, and showcase your talent.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {steps.map((step, idx) => (
              <div key={idx} className="group">
                <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Icon Circle */}
                  <div className="relative mb-8 flex justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-xl opacity-30 group-hover:opacity-40 transition`}></div>
                    <div className={`relative w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl`}>
                      {step.icon}
                    </div>
                    <span className="absolute -top-4 -right-4 bg-pink-500 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center border-4 border-white shadow-lg">
                      {step.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose TalentConnect?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Accessibility size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fully Accessible</h3>
                <p className="text-gray-700">
                  Designed with accessibility at our core for students with all disabilities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual & Flexible</h3>
                <p className="text-gray-700">
                  Participate from anywhere at your own pace. No geographical barriers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Ready</h3>
                <p className="text-gray-700">
                  Connect with industry professionals and unlock real career opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-12 rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started Now
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
