import React from 'react';
import Link from 'next/link';

export default function NewCollectionBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="flex flex-col lg:flex-row min-h-[320px] sm:min-h-[400px] lg:min-h-[500px]">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 relative group overflow-hidden">
          <img 
            src="/collection2.jpg"
            alt="New Collection"
            className="w-full h-[240px] sm:h-[300px] lg:h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Right side - Content */}
        <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="max-w-lg text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6 border border-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-white" style={{ fontFamily: 'Jost, sans-serif' }}>
                Just Launched
              </span>
            </div>
            
            {/* Title */}
            <h2 
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              NEW COLLECTION
            </h2>
            
            {/* Subtitle */}
            <p 
              className="text-sm sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-snug sm:leading-relaxed"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Discover our latest lighting designs that blend contemporary elegance with timeless sophistication.
            </p>
            
            {/* CTA Button */}
            <Link
              href="/collection"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              <span className="group-hover:-translate-x-3 transition-transform duration-300 ease-in-out">
                Explore Collection
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
