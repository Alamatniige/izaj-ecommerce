import React from 'react';
import Link from 'next/link';

export default function FreeDesignConsultation() {
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 max-w-6xl">
      <div className="text-center">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
          FREE LIGHTING CONSULTATION
        </h2>
        
        {/* Decorative line */}
        <div className="w-20 h-0.5 bg-gray-800 mx-auto mb-4 sm:mb-6"></div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            We'd love to hear from you! Whether you have questions about our products, need assistance with your order, or want to provide feedback, please reach out to us through any of the following channels.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <Link 
              href="/static/contactus" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-jost font-semibold text-base rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <span className="group-hover:-translate-x-3 transition-transform duration-300 ease-in-out">
                Contact Us
              </span>
              <svg 
                className="absolute right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
