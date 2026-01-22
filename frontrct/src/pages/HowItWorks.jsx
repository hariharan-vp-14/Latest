
import React from "react";
import { UserPlus, Calendar, Video, Trophy } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={32} className="text-white" />, // Sign Up
    badge: "1",
    title: "Sign Up",
    description:
      "Create your free account as a participant or host. Specify your disability type for personalized accessibility features.",
  },
  {
    icon: <Calendar size={32} className="text-white" />, // Explore Events
    badge: "2",
    title: "Explore Events",
    description:
      "Browse through our curated virtual conferences. Filter by accessibility features, topics, and dates.",
  },
  {
    icon: <Video size={32} className="text-white" />, // Join & Participate
    badge: "3",
    title: "Join & Participate",
    description:
      "Register for conferences and join with our accessible platform. Network with peers and industry professionals.",
  },
  {
    icon: <Trophy size={32} className="text-white" />, // Showcase Your Talent
    badge: "4",
    title: "Showcase Your Talent",
    description:
      "Present your skills, get feedback, and connect with opportunities. Launch your career with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white flex flex-col items-center py-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">How It Works</h2>
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:justify-between relative">
        {/* Vertical line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 z-0" style={{transform: 'translateX(-50%)'}} />
        <div className="flex flex-col gap-12 w-full md:w-1/2 z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start md:justify-start gap-4 relative">
              {/* Icon with badge */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow">{step.badge}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* For desktop, mirror the icons on the right */}
        <div className="hidden md:flex flex-col gap-12 w-1/2 items-end z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start justify-end gap-4 relative">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow">{step.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
