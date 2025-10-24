"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const TermOfUse: React.FC = () => {
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
            <Icon icon="mdi:file-document" className="text-white" width="20" height="20" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Legal & Policy</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>Terms of Use</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
            These Terms of Use explain the rules for using our website and services. Please read them carefully.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Overview</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>By accessing our website you agree to these Terms of Use, as well as our Privacy and Cookie policies.</p>
            </div>

            <div className="prose prose-gray max-w-none text-gray-800 space-y-6" style={{ fontFamily: 'Jost, sans-serif' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>General</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>These Terms of Use apply when you access and use www.izaj.com/ph/en/ (the "Website"), operated by Izaj (Philippines) Inc. We may update these terms from time to time; continued use after changes means you accept them.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>User Accounts</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>To buy from the Website you may need an account. You must keep your account details accurate and keep your password secure. You are responsible for activity under your account.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Prohibited Conduct</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>When using the Website you must not engage in illegal activity, abuse the platform, attempt to hack or otherwise disrupt the services, or submit content that infringes others' rights.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Intellectual Property</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>The Website and its contents are protected by intellectual property rights owned by us or our licensors. Do not reproduce or distribute materials without permission.</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Limitation of Liability</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>To the fullest extent permitted by law, we are not liable for incidental, special, or consequential damages arising from use of the Website. The Website is provided "as is".</p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Governing Law</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>These Terms of Use are governed by the laws of the Philippines.</p>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default TermOfUse;

