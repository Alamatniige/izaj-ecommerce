import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
    setIsSubscribing(false);
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
              <Icon icon="mdi:email" className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Get In Touch</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              Contact <span className="text-white">Us</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              <div className="flex items-center gap-2 text-white">
                <Icon icon="mdi:clock" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>Mon-Sun: 9AM-5PM</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2 text-white">
                <Icon icon="mdi:phone" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>+63 912 345 6789</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2 text-white">
                <Icon icon="mdi:email" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>contact@izaj.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative">

        {/* Contact Information Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50" style={{ fontFamily: 'Jost, sans-serif' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:map-marker" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Our Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Get In <span className="text-black">Touch</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Multiple ways to reach us. We're here to help with all your lighting needs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:map-marker" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Our Location</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  San Pablo - 173 I, San Pablo City, 4000 Laguna
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:phone" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Phone Number</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  +63 912 345 6789
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:email" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Email Address</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  contact@izaj.com
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="mdi:clock" className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Working Hours</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Monday to Sunday: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mt-10 sm:mt-12 md:mt-16 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>Follow Us</h3>
              <div className="flex justify-center gap-4 sm:gap-6">
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 group">
                  <Icon icon="mdi:facebook" className="text-white group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 group">
                  <Icon icon="mdi:instagram" className="text-white group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 group">
                  <Icon icon="mdi:twitter" className="text-white group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Icon icon="mdi:message" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Send Message</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Send Us A <span className="text-black">Message</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 md:p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm py-3 sm:py-4 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base sm:text-lg transition-all duration-300"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm py-3 sm:py-4 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base sm:text-lg transition-all duration-300"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm py-3 sm:py-4 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base sm:text-lg transition-all duration-300"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm py-3 sm:py-4 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base sm:text-lg transition-all duration-300"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="installation">Installation Service</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm py-3 sm:py-4 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base sm:text-lg transition-all duration-300 resize-none"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white py-3 sm:py-4 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span style={{ fontFamily: 'Jost, sans-serif' }}>Sending Message...</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: 'Jost, sans-serif' }}>Send Message</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
       
      </main>
    </div>
  );
};

export default ContactUs;