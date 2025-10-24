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

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20 mx-auto">
            <Icon icon="mdi:cookie" className="text-white" width="20" height="20" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Policy</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Policy</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
            Details about cookies used on our site and how you can manage them.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>How we use cookies</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>We use cookies to give you the best experience and to help us understand how the site is used.</p>
            </div>

            <div className="prose prose-gray max-w-none text-gray-800 space-y-6" style={{ fontFamily: 'Jost, sans-serif' }}>
              <p style={{ fontFamily: 'Jost, sans-serif' }}><strong>Izaj (Philippines), Inc.</strong> ("we", "us") uses cookies on <a href="https://www.izaj.ph" className="text-orange-500 hover:underline" style={{ fontFamily: 'Jost, sans-serif' }}>www.izaj.ph</a>. Cookies are small text files placed on your device to collect standard Internet log information and visitor behavior information.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Types of cookies we use</h3>
              <h4 style={{ fontFamily: 'Jost, sans-serif' }}>Strictly necessary cookies</h4>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>These are required for the website to function. Examples: keeping track of your order and enabling secure login.</p>

              <h4 style={{ fontFamily: 'Jost, sans-serif' }}>Functional cookies</h4>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>Remember choices you make and provide enhanced features like live chat or saved preferences.</p>

              <h4 style={{ fontFamily: 'Jost, sans-serif' }}>Performance cookies</h4>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>Collect anonymous data on how visitors use the site so we can improve performance and user experience.</p>

              <h4 style={{ fontFamily: 'Jost, sans-serif' }}>Targeting cookies</h4>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>Used to deliver adverts that are relevant to you and to measure the effectiveness of campaigns.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Managing cookies</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>You can choose to accept or decline cookies. Most browsers allow you to change your cookie settings via the browser settings. Disabling cookies may affect site functionality.</p>

              <p style={{ fontFamily: 'Jost, sans-serif' }}>For detailed information on how to manage and delete cookies, visit <a href="http://www.aboutcookies.org" className="text-orange-500 hover:underline" style={{ fontFamily: 'Jost, sans-serif' }}>www.aboutcookies.org</a>.</p>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default CookiePolicy;