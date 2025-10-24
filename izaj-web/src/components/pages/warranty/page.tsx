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
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Limited Warranty Overview</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ warrants its products against defects in material and workmanship for a period of one (1) year from shipment unless otherwise stated.</p>
            </div>

            <div className="prose prose-gray max-w-none text-gray-800" style={{ fontFamily: 'Jost, sans-serif' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Coverage</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                IZAJ warrants its products to be free from defects in materials and workmanship under normal use during the warranty period. If a defect arises and a valid claim is received within the Warranty Period, at its option IZAJ will (1) repair the product at no charge, using new or refurbished parts, (2) exchange the product with a product that is new or refurbished and is at least functionally equivalent to the original product, or (3) refund the purchase price for the product.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>What Is Not Covered</h3>
              <ul>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Damage from misuse, abuse, improper installation, alteration, accident, or neglect.</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Normal wear and tear, cosmetic damage, or damage caused by exposure to outdoor elements.</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Products used in commercial or 24/7 applications unless otherwise specified.</li>
                <li style={{ fontFamily: 'Jost, sans-serif' }}>Scratches, abrasions, or deterioration due to paints, solvents, chemicals, or abrasive cleaning.</li>
              </ul>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>How to Obtain Warranty Service</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                To obtain warranty service, contact us at <a href="mailto:izajph@gmail.com" className="text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>izajph@gmail.com</a> or call +63 2 500 3729. Please be prepared to provide proof of purchase, product details, and a description of the defect.
              </p>

              <h3 style={{ fontFamily: 'Jost, sans-serif' }}>Limitation of Liability</h3>
              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                To the maximum extent permitted by law, IZAJ's liability for any claim related to the product shall be limited to the remedies set forth above. IZAJ is not responsible for incidental, special, or consequential damages.
              </p>

              <p style={{ fontFamily: 'Jost, sans-serif' }}>
                These terms give you specific legal rights, and you may also have other rights which vary by jurisdiction.
              </p>
            </div>
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default Warranty;


