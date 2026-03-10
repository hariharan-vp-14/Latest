import React from 'react';
import { Users, Globe, Heart, Target } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: Globe,
      title: 'Accessibility First',
      description: 'Every feature is designed with inclusivity in mind, ensuring equal access for all abilities.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by and for a community that believes in the power of diverse talent.',
    },
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We create pathways for students with disabilities to showcase their unique skills.',
    },
    {
      icon: Target,
      title: 'Opportunity',
      description: 'Connecting talented individuals with mentors, employers, and real-world opportunities.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white border-t border-gray-100">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Who We Are</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-5">About Us</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            TalentConnect Pro is a platform dedicated to empowering students with disabilities by providing
            accessible virtual conferences, talent showcases, and professional networking opportunities.
            We believe every individual deserves a stage to shine.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-16">
          {/* Illustration side */}
          <div className="order-2 md:order-1">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-10 flex items-center justify-center aspect-[4/3]">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Users size={36} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Building Bridges</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Connecting talent with opportunity through accessible, inclusive technology.
                </p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Our Mission
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We're on a mission to break down barriers in professional development. Through our platform,
              students with disabilities can participate in virtual conferences, showcase their talents,
              and connect with organizations that value diverse perspectives.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Since our founding, we've hosted thousands of events and connected participants with
              mentors, employers, and peers across the globe — all through a fully accessible platform.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">2,450+</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Events Hosted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15,000+</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Participants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5,000+</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <item.icon size={20} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
