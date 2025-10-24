"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

const Return = () => {

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
      
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Handle subscription logic here
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
        setIsSubmitting(false);
    };
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
        {/* Hero Section */}
        <section className="relative bg-black text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <Icon icon="mdi:undo" className="text-white" width="20" height="20" />
                <span className="text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Easy Returns</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Jost, sans-serif' }}>
                Return & <span className="text-white">Refund</span> Policy
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'Jost, sans-serif' }}>
                We make returns easy with our customer-friendly 7-day return policy and store credit system
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:clock-outline" width="20" height="20" />
                  <span className="font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>7-Day Return Window</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:credit-card" width="20" height="20" />
                  <span className="font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Store Credit System</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:shield-check" width="20" height="20" />
                  <span className="font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Hassle-Free Process</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="relative">
          {/* Return Policy Overview Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-4 py-2 mb-6">
                  <Icon icon="mdi:information" width="20" height="20" />
                  <span className="text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Return Overview</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Our <span className="text-black">Return</span> Policy
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Changed your mind? No worries! We offer flexible returns within 7 days
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <Icon icon="mdi:cancel" className="text-white" width="24" height="24" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Order Cancellation</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      You can cancel your order within <span className="font-semibold text-black">7 days</span> of placing it. Your payment will be converted to store credit, valid for <span className="font-semibold text-black">60 days</span>.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                        <Icon icon="mdi:truck-fast" className="text-white" width="24" height="24" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Delivery Fee Policy</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Once you receive "Your order is on its way!" email, delivery costs become non-refundable with a <span className="font-semibold text-black">10% pick-up fee</span> applied.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <Icon icon="mdi:calculator" className="text-white" width="24" height="24" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Refund Calculation</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <span className="font-semibold text-black">Refund Amount = Final Paid Price - Delivery Fee - Pick-Up Fee - 10% of Final Paid Price</span>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="/aber.webp" 
                      alt="Return Policy" 
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Easy Returns</h4>
                      <p className="text-gray-200 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Customer satisfaction is our priority
                      </p>
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>7</div>
                      <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Days</div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>60</div>
                      <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Days Credit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Return Conditions Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-4 py-2 mb-6">
                  <Icon icon="mdi:clipboard-check" width="20" height="20" />
                  <span className="text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Return Conditions</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Return <span className="text-black">Requirements</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Please ensure your items meet our return conditions for a smooth process
                </p>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:check-circle" className="text-white" width="24" height="24" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Eligible Returns</h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:check" className="text-green-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Items unused and in original condition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:check" className="text-green-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Original packaging included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:check" className="text-green-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Receipt or proof of purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:check" className="text-green-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Within 7 days of purchase</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:alert-circle" className="text-white" width="24" height="24" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Partial Store Credits</h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:close" className="text-red-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Damaged items (100% charge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:close" className="text-red-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Returned after 30 days (50% charge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="mdi:close" className="text-red-600 mt-1" width="16" height="16" />
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Opened or installed items (50% charge)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Special Cases Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-4 py-2 mb-6">
                  <Icon icon="mdi:gift" width="20" height="20" />
                  <span className="text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Special Cases</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Special <span className="text-black">Returns</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Information for exchanges, gifts, and special circumstances
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:swap-horizontal" className="text-white" width="24" height="24" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Exchanges</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    We only replace items if they are defective or damaged. For exchanges, contact us at <span className="font-semibold text-black">izajph@gmail.com</span>.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:gift" className="text-white" width="24" height="24" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Gift Returns</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Gift items receive gift credit. Once returned, a gift certificate will be mailed to you.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:sale" className="text-white" width="24" height="24" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Sale Items</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Unfortunately, sale items cannot be refunded. Only regular priced items are eligible for returns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Information Section */}
          <section className="py-20 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                  <Icon icon="mdi:truck" width="20" height="20" />
                  <span className="text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Shipping Information</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Return <span className="text-white">Shipping</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Important information about shipping costs and procedures
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="relative p-8 md:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                          <Icon icon="mdi:currency-usd" className="text-black" width="32" height="32" />
                        </div>
                        <h3 className="text-3xl font-bold" style={{ fontFamily: 'Jost, sans-serif' }}>Shipping Costs</h3>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-lg mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                        You are responsible for return shipping costs. These costs are non-refundable and will be deducted from your refund amount if applicable.
                      </p>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <p className="text-white font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Items over Php4,000</p>
                        <p className="text-gray-300 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>Consider trackable shipping or insurance</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="relative p-8 md:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                          <Icon icon="mdi:clock" className="text-white" width="32" height="32" />
                        </div>
                        <h3 className="text-3xl font-bold" style={{ fontFamily: 'Jost, sans-serif' }}>Processing Time</h3>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-lg mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Processing times vary by location. We don't guarantee receipt of returned items, so use trackable shipping for valuable items.
                      </p>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <p className="text-white font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Email Notification</p>
                        <p className="text-gray-300 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>You'll receive email updates on your return status</p>
                      </div>
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
  
  export default Return;
  

