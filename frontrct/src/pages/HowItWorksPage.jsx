import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Calendar, Video, Trophy, ArrowLeft, Accessibility, Globe, Rocket, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    badge: "1",
    title: "Create Your Account",
    description:
      "Sign up as a participant or host in just a few clicks. Tell us about yourself and any accessibility needs you have. Our platform is designed to be inclusive for everyone.",
    accent: "bg-blue-600",
    accentLight: "bg-blue-50",
    accentText: "text-blue-600",
  },
  {
    icon: Calendar,
    badge: "2",
    title: "Discover Events",
    description:
      "Browse our curated collection of virtual conferences and talent showcases. Filter by topics, dates, and accessibility features that matter to you.",
    accent: "bg-violet-600",
    accentLight: "bg-violet-50",
    accentText: "text-violet-600",
  },
  {
    icon: Video,
    badge: "3",
    title: "Connect & Network",
    description:
      "Join events with our fully accessible platform. Network with peers, industry professionals, and discover new opportunities in your field.",
    accent: "bg-amber-600",
    accentLight: "bg-amber-50",
    accentText: "text-amber-600",
  },
  {
    icon: Trophy,
    badge: "4",
    title: "Showcase & Grow",
    description:
      "Present your talents and skills with confidence. Get valuable feedback from experts and unlock career opportunities that align with your goals.",
    accent: "bg-emerald-600",
    accentLight: "bg-emerald-50",
    accentText: "text-emerald-600",
  },
];

export const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">How It Works</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Hero */}
      <div className="section">
        <div className="container-main text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Get started in minutes
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Empowering students with disabilities through accessible virtual conferences and opportunities. 
            Our platform makes it easy to discover, connect, and showcase your talent.
          </p>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="section-sm bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="group">
                  <div className="h-full bg-white rounded-xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200">
                    {/* Step number + Icon */}
                    <div className="flex items-start gap-4 mb-5">
                      <span className={`flex-shrink-0 w-8 h-8 ${step.accent} text-white text-sm font-bold rounded-lg flex items-center justify-center`}>
                        {step.badge}
                      </span>
                      <div className={`w-12 h-12 ${step.accentLight} rounded-lg flex items-center justify-center`}>
                        <Icon size={24} className={step.accentText} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section">
        <div className="container-main">
          <div className="section-header">
            <h2>Why Choose TalentConnect?</h2>
            <p>Built with accessibility, flexibility, and career growth in mind</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Accessibility, title: "Fully Accessible", desc: "Designed with accessibility at our core for students with all disabilities.", accent: "bg-blue-50", accentText: "text-blue-600" },
              { icon: Globe, title: "Virtual & Flexible", desc: "Participate from anywhere at your own pace. No geographical barriers.", accent: "bg-violet-50", accentText: "text-violet-600" },
              { icon: Rocket, title: "Career Ready", desc: "Connect with industry professionals and unlock real career opportunities.", accent: "bg-emerald-50", accentText: "text-emerald-600" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-14 h-14 ${feature.accent} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon size={28} className={feature.accentText} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-sm bg-gray-50 border-t border-gray-100">
        <div className="container-main text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">Join thousands of students who are already connecting with opportunities on our platform.</p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create Your Account
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
