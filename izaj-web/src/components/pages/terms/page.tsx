"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const Term: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20 mx-auto">
            <Icon icon="mdi:file-document" className="text-white" width="20" height="20" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Legal & Policy</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>Terms & Conditions</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
            Please read these terms carefully. They govern your access to and use of our website and services.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Our <span className="text-black">Terms</span></h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4" style={{ fontFamily: 'Jost, sans-serif' }}>These terms apply to all users of the site, including browsers, vendors, customers, merchants and contributors of content.</p>
            </div>

            <div className="prose prose-gray max-w-none text-gray-800 text-center" style={{ fontFamily: 'Jost, sans-serif' }}>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                This website is operated by Izaj. Throughout the site, the terms "we", "us" and "our" refer to Izaj. Izaj offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Acceptance of Terms</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by these Terms of Service, including additional terms referenced herein or available by hyperlink.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Changes & Updates</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                We reserve the right to update these Terms at any time. It is your responsibility to check the page periodically. Continued use after changes constitutes acceptance.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Online Store Terms</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                By using the Service you represent you are of legal age in your jurisdiction or have parental consent. You may not use our products for unlawful purposes.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Accuracy of Information</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>We try to keep information accurate but do not guarantee completeness or timeliness. Use the site at your own risk.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Pre-Orders & Delivery</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>Pre-order reservations may require a down payment and are processed in the order received. Delivery times are estimates and may change.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Limitation of Liability</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>To the maximum extent permitted by law, Izaj is not liable for incidental, special or consequential damages arising from use of the Service.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Governing Law & Contact</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                These Terms shall be governed by the laws of Izaj HQ. Questions about the Terms should be sent to <a href="mailto:izajph@gmail.com" className="text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>izajph@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

      
      </main>
    </div>
  );
};

export default Term;
