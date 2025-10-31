"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const Career: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-6">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-white/20 mx-auto">
            <Icon icon="mdi:briefcase-account" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Careers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>Join Our Team</h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            We're growing and looking for passionate people who want to help build beautiful products and experiences.
          </p>
        </div>
      </section>

      <main className="relative">
        {/* Why Work With Us Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:account-group" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Join Our Team</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Why work with <span className="text-black">us?</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                We design and deliver thoughtfully-made lighting solutions for modern homes. We're creative, fast, and care about craft.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:heart-multiple" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Teamwork & Culture</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We value collaboration and foster an environment where everyone's ideas matter and creativity thrives.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:lightbulb-on" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Innovation</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We encourage curiosity and ownership. Bring your creative solutions and help shape the future of lighting design.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:star-circle" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Quality Craft</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We care deeply about craftsmanship. Join us in creating beautiful products and exceptional customer experiences.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:chart-line" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Growth Opportunity</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Be part of a growing company with seven branches nationwide. Your career growth is our priority.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:account-heart" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Focus</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  If you love great products and exceptional customer care, you'll find your place here. Every role impacts our customer experience.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:handshake" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Diverse Roles</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Whether you're a designer, engineer, marketer, or part of operations, we welcome diverse talents and perspectives.
                </p>
              </div>
            </div>

            {/* Open Positions Section */}
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Icon icon="mdi:briefcase" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Opportunities</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Open <span className="text-black">Positions</span>
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:store" className="text-white w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Retail Sales Associate</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Help customers find the perfect lighting solutions and create memorable shopping experiences.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:palette" className="text-white w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Product Designer</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Create beautiful and innovative lighting designs that inspire and transform spaces.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:truck-delivery" className="text-white w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Fulfillment & Logistics Coordinator</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Ensure smooth operations and timely delivery of our products to customers nationwide.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:headset" className="text-white w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Experience Representative</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Provide exceptional support and build lasting relationships with our valued customers.
                  </p>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:email-send" className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Ready to <span className="text-black">Apply?</span>
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Send your resume and a short note to{' '}
                <a 
                  href="mailto:izajhr@gmail.com" 
                  className="text-black font-semibold hover:text-gray-700 underline transition-colors" 
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  izajhr@gmail.com
                </a>
                . Please include the position you are applying for in the subject line.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon icon="mdi:information" className="w-5 h-5" />
                <span style={{ fontFamily: 'Jost, sans-serif' }}>
                  We review applications regularly and will contact qualified candidates for next steps.
                </span>
              </div>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default Career;
