"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const AboutUs: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
      
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white">
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
                            <Icon icon="mdi:lightbulb-on" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Illuminating Excellence Since Day One</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                            About <span className="text-white">IZAJ</span>
                        </h1>
                        
                        <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                            We don't just sell chandeliers—we create breathtaking lighting experiences that transform spaces into works of art.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                            <div className="flex items-center gap-2 text-white">
                                <Icon icon="mdi:map-marker" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>7 Branches Nationwide</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                            <div className="flex items-center gap-2 text-white">
                                <Icon icon="mdi:star" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Premium Quality</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
                            <div className="flex items-center gap-2 text-white">
                                <Icon icon="mdi:shield-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Trusted Service</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="relative">
                {/* Our Story Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                                <Icon icon="mdi:book-open" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Our Journey</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Our <span className="text-black">Story</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                From humble beginnings to becoming the Philippines&#39; premier lighting destination
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="space-y-6 sm:space-y-8">
                                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon icon="mdi:lightbulb-on" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Our Mission</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                        At <span className="font-semibold text-black">Izaj Lighting Centre</span>, we don&#39;t just sell chandeliers—we create breathtaking lighting experiences that transform spaces into works of art. From classic crystal masterpieces to modern, statement-making designs, our chandeliers bring elegance, sophistication, and brilliance to every home and business.
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon icon="mdi:trending-up" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Our Growth</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
        What started as a single store fueled by a passion for luxury lighting has now grown into seven branches, each dedicated to offering the finest selection of chandeliers. Our journey has been built on craftsmanship, innovation, and a deep understanding of what makes a space truly shine.
      </p>
                                </div>
                            </div>

                            <div className="relative mt-8 lg:mt-0">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img 
                                        src="/samp.jpg" 
                                        alt="Our Story" 
                                        className="w-full h-64 sm:h-80 md:h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                                        <h4 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Crafting Excellence</h4>
                                        <p className="text-gray-200 text-xs sm:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                                            Every piece tells a story of quality, innovation, and timeless beauty
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Floating Stats */}
                                <div className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>7+</div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Branches</div>
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-100">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>1000+</div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Happy Customers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    </section>

                {/* Our Values Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                                <Icon icon="mdi:heart" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>What We Stand For</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Our <span className="text-black">Values</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:star" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Quality First</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    We source only the best materials and partner with trusted manufacturers to ensure every product meets our high standards.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:account-heart" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Customer-Centric</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Your satisfaction is our top priority. Our support team is always ready to assist you before, during, and after your purchase.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:lightbulb-on" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Innovation</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    We stay ahead of trends and technology to bring you the latest in lighting design and smart home integration.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:leaf" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Sustainability</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    We are committed to offering energy-efficient and eco-friendly lighting solutions for a better tomorrow.
                                </p>
                            </div>
                        </div>
                    </div>
    </section>

                {/* Why Shop With Us Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                                <Icon icon="mdi:shopping" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Why Choose Us</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Why Shop <span className="text-black">With Us?</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Discover what makes us the preferred choice for lighting solutions
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:format-list-bulleted" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Wide Selection</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    From timeless classics to modern masterpieces, find lighting for every style and budget.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:account-tie" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Expert Advice</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Our lighting specialists are available to help you choose the perfect fixture for your space.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:truck-delivery" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Fast & Reliable Delivery</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Enjoy quick shipping and professional installation services within Metro Manila and beyond.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:shield-check" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Secure Shopping</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Shop with confidence using our safe and secure payment options.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:headset" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>After-Sales Support</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    We offer warranty and hassle-free returns for your peace of mind.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon icon="mdi:heart" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Satisfaction</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Your happiness is our success. We go above and beyond to exceed your expectations.
                                </p>
                            </div>
                        </div>
                    </div>
    </section>

                {/* Meet Our Team Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                                <Icon icon="mdi:account-group" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Our People</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Meet Our <span className="text-black">Team</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Our passionate team is made up of lighting designers, customer service professionals, and installation experts.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            <div className="group text-center">
                                <div className="relative mb-4 sm:mb-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-gray-400 transition-colors duration-300">
                                        <img 
                                            src="/anna.jpg" 
                                            alt="Anna Cruz" 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                                        <Icon icon="mdi:palette" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Anna Cruz</h3>
                                <p className="text-gray-800 font-semibold mb-2 sm:mb-3 text-sm sm:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Lighting Designer</p>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    With 8+ years of experience, Anna specializes in creating stunning lighting designs that transform spaces.
                                </p>
                            </div>

                            <div className="group text-center">
                                <div className="relative mb-4 sm:mb-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-gray-400 transition-colors duration-300">
                                        <img 
                                            src="/mark.jpg" 
                                            alt="Mark Santos" 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                        <Icon icon="mdi:headset" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Mark Santos</h3>
                                <p className="text-gray-800 font-semibold mb-2 sm:mb-3 text-sm sm:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Support</p>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Mark ensures every customer receives exceptional service and support throughout their journey.
                                </p>
                            </div>

                            <div className="group text-center sm:col-span-2 md:col-span-1">
                                <div className="relative mb-4 sm:mb-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-gray-400 transition-colors duration-300">
                                        <img 
                                            src="/liza.jpg" 
                                            alt="Liza Tan" 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                                        <Icon icon="mdi:tools" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>Liza Tan</h3>
                                <p className="text-gray-800 font-semibold mb-2 sm:mb-3 text-sm sm:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Installation Lead</p>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Liza leads our professional installation team, ensuring perfect setup and customer satisfaction.
                                </p>
                            </div>
                        </div>
      </div>
    </section>

                {/* Vision & Mission Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-white/20">
                                <Icon icon="mdi:target" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Our Purpose</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Vision & <span className="text-white">Mission</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Guiding principles that drive our commitment to excellence
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                            {/* Vision */}
                            <div className="relative group">
                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 h-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                    <div className="relative p-5 sm:p-6 md:p-8 lg:p-12 h-full">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <Icon icon="mdi:eye" className="text-black w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                            </div>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Jost, sans-serif' }}>Our Vision</h3>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Jost, sans-serif' }}>
                                            To be the Philippines&#39; most trusted and innovative lighting provider, illuminating every home and business with elegance, quality, and inspiration. We envision a future where every space shines with beauty and purpose, powered by our passion for exceptional lighting solutions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mission */}
                            <div className="relative group">
                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 h-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                    <div className="relative p-5 sm:p-6 md:p-8 lg:p-12 h-full">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <Icon icon="mdi:rocket-launch" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                            </div>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Jost, sans-serif' }}>Our Mission</h3>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Jost, sans-serif' }}>
                                            To deliver world-class lighting products and services that exceed customer expectations. We are committed to continuous innovation, outstanding customer care, and empowering our clients to create spaces that reflect their unique style and vision.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
      </div>
    </section>

                {/* Customer Testimonials Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                                <Icon icon="mdi:star" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Customer Reviews</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                What Our <span className="text-black">Customers Say</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                                Real feedback from satisfied customers who trust us with their lighting needs
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center gap-1 mb-4 sm:mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon key={i} icon="mdi:star" className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed mb-4 sm:mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    "The chandelier I bought from Izaj transformed my living room. The quality and service were outstanding! The installation team was professional and the final result exceeded my expectations."
                                </p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-base sm:text-lg">M</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm sm:text-base text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Maria Gonzales</h4>
                                        <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>Homeowner, Quezon City</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center gap-1 mb-4 sm:mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon key={i} icon="mdi:star" className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed mb-4 sm:mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    "Fast delivery and the installation team was very professional. Highly recommended! They helped me choose the perfect lighting for my restaurant and the ambiance is now perfect."
                                </p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-base sm:text-lg">J</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm sm:text-base text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>James Rodriguez</h4>
                                        <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>Restaurant Owner, Makati</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-1 mb-4 sm:mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon key={i} icon="mdi:star" className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed mb-4 sm:mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    "Excellent customer service and beautiful lighting fixtures. The team was knowledgeable and helped me find exactly what I was looking for. Will definitely shop here again!"
                                </p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-base sm:text-lg">S</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm sm:text-base text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>Sarah Lim</h4>
                                        <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>Interior Designer, Taguig</p>
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

export default AboutUs; 