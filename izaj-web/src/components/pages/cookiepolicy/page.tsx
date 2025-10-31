"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const CookiePolicy: React.FC = () => {
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
            <Icon icon="mdi:cookie" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Policy</h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            Details about cookies used on our site and how you can manage them.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:cookie" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Usage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                How we use cookies
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                We use cookies to give you the best experience and to help us understand how the site is used.
              </p>
            </div>

            {/* Introduction Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                <strong className="text-gray-900">Izaj (Philippines), Inc.</strong> ("we", "us") uses cookies on <a href="https://www.izaj.ph" className="text-orange-500 hover:text-orange-600 hover:underline font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>www.izaj.ph</a>. Cookies are small text files placed on your device to collect standard Internet log information and visitor behavior information.
              </p>
            </div>

            {/* Types of Cookies Section */}
            <div className="mb-10 sm:mb-12 md:mb-16">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>Types of cookies we use</h3>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:shield-check" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Strictly necessary cookies</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    These are required for the website to function. Examples: keeping track of your order and enabling secure login.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:cog" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Functional cookies</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Remember choices you make and provide enhanced features like live chat or saved preferences.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:chart-line" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Performance cookies</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Collect anonymous data on how visitors use the site so we can improve performance and user experience.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:target" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Targeting cookies</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Used to deliver adverts that are relevant to you and to measure the effectiveness of campaigns.
                  </p>
                </div>
              </div>
            </div>

            {/* Managing Cookies Section */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:settings" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Managing cookies</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  You can choose to accept or decline cookies. Most browsers allow you to change your cookie settings via the browser settings. Disabling cookies may affect site functionality.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  For detailed information on how to manage and delete cookies, visit <a href="http://www.aboutcookies.org" className="text-orange-500 hover:text-orange-600 hover:underline font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>www.aboutcookies.org</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default CookiePolicy;