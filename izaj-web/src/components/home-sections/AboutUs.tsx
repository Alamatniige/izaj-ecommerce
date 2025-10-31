import React from 'react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-20 max-w-6xl">
      <div className="text-center">
        {/* Section Title */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
          About IZAJ
        </h2>
        
        {/* Decorative line */}
        <div className="w-16 sm:w-20 h-0.5 bg-gray-800 mx-auto mb-4 sm:mb-6"></div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto leading-snug sm:leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            Izaj Lighting Centre is a premier provider of high-quality chandeliers and lighting solutions in the Philippines. With a commitment to enhancing interiors through exceptional illumination, we offer a curated selection of lighting fixtures that blend functionality with aesthetic appeal.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center mt-5 sm:mt-8">
            <Link 
              href="/static/aboutus" 
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gray-800 text-white font-jost font-semibold text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <span className="group-hover:-translate-x-3 transition-transform duration-300 ease-in-out">
                Learn More About Us
              </span>
              <svg 
                className="absolute right-4 w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" 
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
