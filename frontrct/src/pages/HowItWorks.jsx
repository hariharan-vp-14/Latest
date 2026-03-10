
import React from "react";
import { UserPlus, Calendar, Video, Trophy } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={24} className="text-blue-600" />,
    badge: "1",
    title: "Sign Up",
    description:
      "Create your free account as a participant or host. Specify your disability type for personalized accessibility features.",
  },
  {
    icon: <Calendar size={24} className="text-blue-600" />,
    badge: "2",
    title: "Explore Events",
    description:
      "Browse through our curated virtual conferences. Filter by accessibility features, topics, and dates.",
  },
  {
    icon: <Video size={24} className="text-blue-600" />,
    badge: "3",
    title: "Join & Participate",
    description:
      "Register for conferences and join with our accessible platform. Network with peers and industry professionals.",
  },
  {
    icon: <Trophy size={24} className="text-blue-600" />,
    badge: "4",
    title: "Showcase Your Talent",
    description:
      "Present your skills, get feedback, and connect with opportunities. Launch your career with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white flex flex-col items-center py-16 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">How It Works</h2>
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                {step.icon}
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {step.badge}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
