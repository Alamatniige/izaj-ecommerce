import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface LightingCategoryProps {
  user: UserData | null;
}

const LightingCategory: React.FC<LightingCategoryProps> = ({ user: _user }) => {
  const allItems = [
    { id: 1, name: "Ceiling Lights", image: "bey.jpg" },
    { id: 2, name: "Chandelier", image: "bey2.jpg" },
    { id: 3, name: "Pendant Lights", image: "bey3.jpg" },
    { id: 4, name: "Wall Lights", image: "bey4.jpg" },
    { id: 5, name: "Table Lamps", image: "bey5.jpg" },
    { id: 6, name: "Cluster Chandelier", image: "bey6.jpg" },
    { id: 7, name: "Floor Lamps", image: "bey7.jpg" },
    { id: 8, name: "Painting Lights", image: "bey8.jpg" },
    { id: 9, name: "Indoor Lights", image: "bey9.jpg" },
    { id: 10, name: "Outdoor Lights", image: "bey10.jpg" },
    { id: 11, name: "Mirror", image: "bey11.jpg" },
    { id: 12, name: "Magnetic Lights", image: "bey12.jpg" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(Math.ceil(allItems.length / 4));
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      if (width < 640) {
        setItemsPerPage(allItems.length); // Show all on mobile
        setTotalPages(1);
      } else if (width >= 640 && width < 1024) {
        setItemsPerPage(3); // Tablet: 3 per page
        setTotalPages(Math.ceil(allItems.length / 3));
      } else {
        setItemsPerPage(4); // Desktop: 4 per page
        setTotalPages(Math.ceil(allItems.length / 4));
      }
    };
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [allItems.length]);

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    return allItems.slice(start, start + itemsPerPage);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      setIsAnimating(true);
      setSlideDirection('forward');
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 0) {
      setIsAnimating(true);
      setSlideDirection('backward');
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile && !isTablet) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile && !isTablet) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!isMobile && !isTablet && touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe && currentPage < totalPages - 1) {
        handleNextClick();
      }
      if (isRightSwipe && currentPage > 0) {
        handlePrevClick();
      }
    }
  };

  // Add this style block for the animation
  const slideLeftKeyframes = `
    @keyframes slideLeft {
      0% { transform: translateX(0);}
      100% { transform: translateX(-16px);}
    }
    .slide-left-anim {
      animation: slideLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
    }
  `;

  const slideAnimationKeyframes = `
    @keyframes slideOutLeft {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(-100%); opacity: 0; }
    }
    @keyframes slideOutRight {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    .animate-slide-out-left {
      animation: slideOutLeft 0.5s ease-in-out forwards;
    }
    .animate-slide-out-right {
      animation: slideOutRight 0.5s ease-in-out forwards;
    }
  `;

  // Add improved effect styles
  const improvedEffects = `
    .category-tile {
      transition: transform 0.3s;
      background: transparent;
      box-shadow: none;
    }
    .category-tile:hover, .category-tile:active {
      transform: scale(1.07) translateY(-4px);
      z-index: 2;
      box-shadow: none;
    }
    .category-img {
      transition: transform 0.3s;
      background: transparent;
      box-shadow: none;
    }
    .category-tile:hover .category-img, .category-tile:active .category-img {
      transform: scale(1.10);
      box-shadow: none;
    }
  `;

  return (
    <>
      <style>{slideLeftKeyframes}</style>
      <style>{slideAnimationKeyframes}</style>
      <style>{improvedEffects}</style>
      
      {/* Brand Messaging Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 mt-2 md:mt-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
            Discover Your Perfect Lighting
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            Transform your space with our carefully curated collection of premium lighting solutions. 
            From elegant chandeliers to modern LED fixtures, find the perfect lighting to illuminate your style.
          </p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 md:py-16 mt-2 md:mt-8 relative bg-gray-50">
        <div className="flex justify-between items-baseline mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl text-black font-extrabold" style={{ fontFamily: 'Jost, sans-serif' }}>
          Choose By Categories
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/product-list"
            className="text-xs sm:text-sm font-medium text-gray-500 hover:underline mt-1 flex items-center font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View all
          </Link>
        </div>

        <div
          ref={containerRef}
          className={`relative group ${isMobile || isTablet ? 'overflow-x-auto' : ''}`}
        style={{
          minHeight: isMobile ? "140px" : "180px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <style>
          {`
            /* Visible horizontal scrollbar for the mobile carousel */
            .show-horizontal-scroll {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .show-horizontal-scroll::-webkit-scrollbar {
              height: 6px; /* horizontal bar height */
            }
            .show-horizontal-scroll::-webkit-scrollbar-track {
              background: rgba(0,0,0,0.06);
              border-radius: 9999px;
            }
            .show-horizontal-scroll::-webkit-scrollbar-thumb {
              background: rgba(0,0,0,0.3);
              border-radius: 9999px;
            }
            .show-horizontal-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(0,0,0,0.45);
            }
            @media (max-width: 639px) {
              .slide-in-forward {
                animation: slideInForward 0.3s ease-out forwards;
              }
              .slide-in-backward {
                animation: slideInBackward 0.3s ease-out forwards;
              }
            }
          `}
        </style>

        {(isMobile || isTablet) ? (
          <div className="show-horizontal-scroll pb-6 md:pb-2 px-6">
            <div className="flex flex-nowrap gap-4 sm:gap-6 -mx-6">
              {allItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="overflow-hidden relative flex flex-col w-full group max-w-[500px] min-w-0"
                  style={isMobile ? { width: '65vw', minWidth: '65vw', flex: '0 0 65vw' } : isTablet ? { width: '40vw', minWidth: '40vw', flex: '0 0 40vw' } : {}}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-full h-72 sm:h-80 md:h-96 object-cover transition-all duration-300 ${
                        hoveredIndex === idx ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Overlay hidden; name shown below */}
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {item.name}
                    </h3>
                    <Link
                      href={`/product-list?category=${encodeURIComponent(item.name)}`}
                      className="hidden sm:inline-block mt-2 text-xs sm:text-sm font-semibold text-black hover:underline"
                      style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.05em' }}
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center transition-all duration-500 ease-in-out ${isAnimating ? (slideDirection === 'forward' ? 'animate-slide-out-left' : 'animate-slide-out-right') : ''}`}
          >
            {getCurrentPageItems().map((item, idx) => (
              <div 
                key={item.id} 
                className="overflow-hidden relative flex flex-col w-full group"
                onMouseEnter={() => setHoveredIndex(currentPage * itemsPerPage + idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-full h-72 sm:h-96 object-cover transition-all duration-300 ${
                      hoveredIndex === (currentPage * itemsPerPage + idx) ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className={`text-white text-xl sm:text-2xl md:text-3xl font-bold text-center transition-all duration-500 mb-4 ${
                      hoveredIndex === (currentPage * itemsPerPage + idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`} style={{ 
                      fontFamily: 'Jost, sans-serif', 
                      fontWeight: 600,
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                    }}>
                      {item.name}
                    </h3>
                    <Link
                      href={`/product-list?category=${encodeURIComponent(item.name)}`}
                      className={`text-black py-2 px-4 hover:opacity-80 transition-all duration-500 text-sm text-center block rounded-sm border ${
                        hoveredIndex === (currentPage * itemsPerPage + idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: 'white', borderColor: 'white', letterSpacing: '0.1em' }}
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
                {/* Name below only for mobile/tablet; desktop overlay retained */}
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Pagination arrows only on desktop */}
        {!(isMobile || isTablet) && currentPage > 0 && (
          <button
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 focus:outline-none transition-transform duration-500 hover:scale-110 opacity-70 sm:opacity-0 group-hover:opacity-100 hidden sm:block"
            style={{ zIndex: 10 }}
          >
            <Icon icon="mdi:chevron-left" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" width="24" height="24" />
          </button>
        )}

        {!(isMobile || isTablet) && currentPage < totalPages - 1 && (
          <button
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 focus:outline-none transition-transform duration-500 hover:scale-110 opacity-70 sm:opacity-0 group-hover:opacity-100 hidden sm:block"
            style={{ zIndex: 10 }}
          >
            <Icon icon="mdi:chevron-right" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" width="24" height="24" />
          </button>
        )}
      </section>
    </>
  );
};

export default LightingCategory;
