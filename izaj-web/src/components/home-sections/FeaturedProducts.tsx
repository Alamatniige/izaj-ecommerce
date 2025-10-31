import React from 'react';
import Link from 'next/link';

export default function FeaturedProducts() {
  return (
    <section className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Top Picks Card */}
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] overflow-hidden">
            <img
              src="/featured.jpg"
              alt="Top Picks"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
            <div className="max-w-sm">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                TOP PICKS
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-200 mb-4 sm:mb-6 leading-snug sm:leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                Shop designer favorites and discover our most popular lighting solutions
              </p>
              
              <Link
                href="/product-list"
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn relative overflow-hidden"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                <span className="group-hover/btn:-translate-x-2 transition-transform duration-300 ease-in-out">
                  SHOP NOW
                </span>
                <svg 
                  className="absolute right-3 w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/btn:translate-x-0" 
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

        {/* What's Hot Card */}
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] overflow-hidden">
            <img
              src="/featured.jpg"
              alt="What's Hot"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
            <div className="max-w-sm">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                WHAT'S HOT?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-200 mb-4 sm:mb-6 leading-snug sm:leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                Get the latest design trends for your home and projects with our newest collections
              </p>
              
              <Link
                href="/product-list"
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn relative overflow-hidden"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                <span className="group-hover/btn:-translate-x-2 transition-transform duration-300 ease-in-out">
                  SHOP NOW
                </span>
                <svg 
                  className="absolute right-3 w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/btn:translate-x-0" 
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
      </div>
    </section>
  );
}
