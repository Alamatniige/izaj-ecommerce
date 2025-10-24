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

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20 mx-auto">
            <Icon icon="mdi:briefcase-account" className="text-white" width="20" height="20" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Careers</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>Join Our Team</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
            We're growing and looking for passionate people who want to help build beautiful products and experiences.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Why work with us?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4" style={{ fontFamily: 'Jost, sans-serif' }}>We design and deliver thoughtfully-made lighting solutions for modern homes. We're creative, fast, and care about craft.</p>
            </div>

            <div className="prose prose-gray max-w-none text-gray-800" style={{ fontFamily: 'Jost, sans-serif' }}>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>We value teamwork, curiosity, and ownership. Whether you're a designer, engineer, marketer, or part of operations, if you love great product and customer care, we'd love to meet you.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Open Positions</h3>
              <ul>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Retail Sales Associate</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Product Designer</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Fulfillment & Logistics Coordinator</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Customer Experience Representative</li>
              </ul>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Apply</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>Send your resume and a short note to <a href="mailto:izajhr@gmail.com" className="text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>izajhr@gmail.com</a>. Please include the position you are applying for in the subject line.</p>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default Career;
