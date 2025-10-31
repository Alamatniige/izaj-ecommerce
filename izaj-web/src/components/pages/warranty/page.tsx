"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const Warranty: React.FC = () => {
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
      {/* Hero */}
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
            <Icon icon="mdi:shield-check" className="text-white" width="20" height="20" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Warranty</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>Warranty & Returns</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
            We stand behind our products. Read the warranty terms below for coverage details and how to request service.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Limited Warranty Overview</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ warrants its products against defects in material and workmanship for a period of one (1) year from shipment unless otherwise stated.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:shield-check" width="22" height="22" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Coverage</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      IZAJ warrants products against defects in materials and workmanship under normal use for one (1) year from shipment, unless otherwise stated. Remedies may include repair, replacement with an equivalent product, or refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:alert-circle-outline" width="22" height="22" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>What Is Not Covered</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600 space-y-1 marker:text-gray-400" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <li>Misuse, abuse, improper installation, alteration, accident, or neglect.</li>
                      <li>Normal wear, cosmetic damage, or damage from outdoor exposure.</li>
                      <li>Commercial or 24/7 use unless explicitly specified.</li>
                      <li>Scratches or deterioration due to chemicals or abrasive cleaning.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:headset" width="22" height="22" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>How to Obtain Service</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Email <a href="mailto:izajph@gmail.com" className="text-black font-semibold underline underline-offset-4">izajph@gmail.com</a> or call +63 2 500 3729. Prepare proof of purchase, product details, and a description of the defect.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 md:max-w-2xl md:mx-auto lg:col-span-1 lg:col-start-2">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:scale-balance" width="22" height="22" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Limitation of Liability</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      To the maximum extent permitted by law, IZAJ’s liability is limited to the remedies above. IZAJ is not responsible for incidental, special, or consequential damages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-3 md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:law" width="22" height="22" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Your Rights</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      These terms provide specific legal rights; you may have other rights that vary by jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default Warranty;


