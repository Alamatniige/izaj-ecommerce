"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

const Delivery = () => {

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
        <section className="relative bg-black text-white overflow-hidden" style={{ fontFamily: 'Jost, sans-serif' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-white/20">
                <Icon icon="mdi:truck-delivery" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Professional Service</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Delivery & <span className="text-white">Installation</span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Quality service guaranteed with our professional delivery and installation team
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:map-marker" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>San Pablo City Coverage</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:shield-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Free Installation</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:clock" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Same Day Service</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="relative">
          {/* Service Guidelines Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-gray-50" style={{ fontFamily: 'Jost, sans-serif' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Icon icon="mdi:information" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Service Guidelines</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Our <span className="text-black">Service</span> Terms
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  To ensure quality service, please read our Delivery and Installation guidelines
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:truck" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Free Delivery</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Orders <span className="font-semibold text-black">Php10,000 and above</span> qualify for free delivery within San Pablo City only. We ensure your products arrive safely and on time.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:tools" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Free Installation</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Orders <span className="font-semibold text-black">Php10,000 and above</span> include free installation within San Pablo City. Installation is done on the same day as delivery.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:currency-usd" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Regular Installation Fee</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Regular installation fee is <span className="font-semibold text-black">Php 900.00 per piece</span>. Installations are applicable to lighting fixtures only.
                    </p>
                  </div>
                </div>

                <div className="relative mt-8 lg:mt-0">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="/aber.webp" 
                      alt="Delivery Service" 
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                      <h4 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Professional Service</h4>
                      <p className="text-gray-200 text-xs sm:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Our team ensures safe delivery and proper installation
                      </p>
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>100%</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Safe Delivery</div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>Same</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Day Service</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Icon icon="mdi:clipboard-text" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Important Notes</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Delivery & <span className="text-black">Installation</span> Notes
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Please read these important guidelines for a smooth delivery and installation experience
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:account-check" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Responsibility</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Ensure you or a valid representative is available to receive and approve the products. Check for any damage before the delivery team leaves.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:file-document" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Permits & Documentation</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Apply for all necessary gate passes, working permits, and other documentation needed for the delivery day.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:calendar-clock" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Rescheduling</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    If unavailable on the agreed delivery day, a new delivery will be scheduled with a corresponding delivery fee.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:home" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Installation Requirements</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Ensure your ceiling is suitable for installation. Gypsum boards without proper support are not suitable for large fixtures.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      
      </div>
    );
  };
  
  export default Delivery;
  

