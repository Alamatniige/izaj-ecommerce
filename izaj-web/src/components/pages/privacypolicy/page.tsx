"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

const PrivacyPolicy: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-white/20">
                <Icon icon="mdi:shield-account" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Your Privacy Matters</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Privacy <span className="text-white">Policy</span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                We are committed to protecting your privacy and ensuring the security of your personal information
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:shield-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Secure Data</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:lock" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Protected Information</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="mdi:account-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Your Rights</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="relative">
          {/* Information Collection Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Icon icon="mdi:information" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Information Collection</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  What We <span className="text-black">Collect</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We collect information to provide you with the best possible service
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:account" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Personal Information</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      When you purchase from our store, we collect personal information such as your name, address, and email address as part of the buying and selling process.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:web" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Technical Information</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      When you browse our store, we automatically receive your computer's internet protocol (IP) address to help us learn about your browser and operating system.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:email" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Marketing Communications</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                      With your permission, we may send you emails about our store, new products, and other updates to keep you informed about our latest offerings.
                    </p>
                  </div>
                </div>

                <div className="relative mt-8 lg:mt-0">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="/aber.webp" 
                      alt="Privacy Protection" 
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                      <h4 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Your Privacy is Protected</h4>
                      <p className="text-gray-200 text-xs sm:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                        We use industry-standard security measures to protect your data
                      </p>
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>SSL</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Encrypted</div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>AES-256</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Security</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Rights Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Icon icon="mdi:account-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Your Rights</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Your Privacy <span className="text-black">Rights</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  You have control over your personal information and how it's used
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:check-circle" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Consent</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    When you provide personal information for a transaction, we imply consent for that specific reason only. For marketing purposes, we ask for your explicit consent.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:cancel" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Withdraw Consent</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    You may withdraw your consent at any time by contacting us at izajph@gmail.com. We will stop using your information for marketing purposes immediately.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:eye" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Access Information</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    You have the right to access, correct, amend, or delete any personal information we have about you. Contact our Privacy Compliance Officer for assistance.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:security" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Data Security</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                    We use SSL encryption and AES-256 security standards to protect your information. Credit card data is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          </section>

          

          
        </main>
      
      </div>
    );
  };
  
  export default PrivacyPolicy;
  

