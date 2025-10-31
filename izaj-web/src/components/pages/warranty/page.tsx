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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-white/20 mx-auto">
            <Icon icon="mdi:shield-check" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Warranty</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>Warranty & Returns</h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            We stand behind our products. Read the warranty terms below for coverage details and how to request service.
          </p>
        </div>
      </section>

      <main className="relative">
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>Limited Warranty Overview</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-3 sm:mt-4 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ warrants its products against defects in material and workmanship for a period of one (1) year from shipment unless otherwise stated.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:shield-check" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Coverage</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      IZAJ warrants products against defects in materials and workmanship under normal use for one (1) year from shipment, unless otherwise stated. Remedies may include repair, replacement with an equivalent product, or refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>What Is Not Covered</h3>
                    <ul className="mt-2 list-disc pl-4 sm:pl-5 text-sm sm:text-base text-gray-600 space-y-1 marker:text-gray-400" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <li>Misuse, abuse, improper installation, alteration, accident, or neglect.</li>
                      <li>Normal wear, cosmetic damage, or damage from outdoor exposure.</li>
                      <li>Commercial or 24/7 use unless explicitly specified.</li>
                      <li>Scratches or deterioration due to chemicals or abrasive cleaning.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:headset" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>How to Obtain Service</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Email <a href="mailto:izajph@gmail.com" className="text-black font-semibold underline underline-offset-4">izajph@gmail.com</a> or call +63 2 500 3729. Prepare proof of purchase, product details, and a description of the defect.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:max-w-2xl md:mx-auto lg:col-span-1 lg:col-start-2">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:scale-balance" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Limitation of Liability</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      To the maximum extent permitted by law, IZAJ's liability is limited to the remedies above. IZAJ is not responsible for incidental, special, or consequential damages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-3 sm:col-span-2">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon icon="mdi:law" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Your Rights</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
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


