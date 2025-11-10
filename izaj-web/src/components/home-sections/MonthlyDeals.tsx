import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../../services/productService';
import { InternalApiService } from '../../services/internalApi';

export default function MonthlyDeals() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [desktopCurrentPage, setDesktopCurrentPage] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isImageTransitioning, setIsImageTransitioning] = useState<{ [key: number]: boolean }>({});


  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setSlideDirection('left');
      setCurrentPage(prev => prev + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setSlideDirection('right');
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(w < 768); 
      setIsTablet(w >= 768 && w < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch sales products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 MonthlyDeals: Starting to fetch sales products...');
        const salesProducts = await InternalApiService.getSalesProducts();
        console.log('📦 MonthlyDeals: Received sales products:', salesProducts);
        
        // Transform to legacy format for compatibility
        const transformedProducts = salesProducts.map(product => {
          // Get stock from product_stock array
          let stock = 10; // Default stock for sales products
          if ((product as any).product_stock && (product as any).product_stock.length > 0) {
            stock = (product as any).product_stock[0].display_quantity || 10;
          }
          
          // Calculate sale price based on percentage or fixed_amount
          const originalPrice = parseFloat(product.price.toString());
          const saleDetails = (product as any).sale?.[0]; // Sale is an array, get first element
          let salePrice = originalPrice;
          let originalPriceFormatted = `₱${originalPrice.toLocaleString()}`;
          
          if (saleDetails) {
            if (saleDetails.percentage) {
              // Calculate discount based on percentage
              const discountAmount = (originalPrice * saleDetails.percentage) / 100;
              salePrice = originalPrice - discountAmount;
            } else if (saleDetails.fixed_amount) {
              // Calculate discount based on fixed amount
              salePrice = Math.max(0, originalPrice - saleDetails.fixed_amount);
            }
          }
          
          return {
          id: parseInt(product.product_id) || 0,
          name: product.product_name,
          price: `₱${salePrice.toLocaleString()}`,
          originalPrice: saleDetails ? originalPriceFormatted : undefined,
          image: product.media_urls?.[0] || "/placeholder.jpg",
            mediaUrls: product.media_urls || [],
          colors: ["black"], // Default color
            sale: (product as any).sale || [], // Include sale information
            stock: stock,
            category: product.category || 'Lighting' // Use actual category from Supabase
          };
        });
        
        setAllProducts(transformedProducts);
      } catch (error) {
        console.error('❌ MonthlyDeals: Error fetching sales products:', error);
        setAllProducts([]);
      } finally {
        console.log('✅ MonthlyDeals: Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleColorSelect = (productId: number, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  // Handle hover events for image switching
  const handleMouseEnter = (productId: number) => {
    setHoveredProduct(productId);
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  const handleMouseLeave = (productId: number) => {
    setHoveredProduct(null);
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  // Get current image for a product
  const getCurrentImage = (product: any) => {
    if (!product.mediaUrls || product.mediaUrls.length === 0) {
      return product.image;
    }
    
    const index = currentImageIndex[product.id] || 0;
    return product.mediaUrls[index] || product.image;
  };

  // Image cycling effect when hovering
  useEffect(() => {
    if (!hoveredProduct) return;

    const product = allProducts.find(p => p.id === hoveredProduct);
    if (!product || !product.mediaUrls || product.mediaUrls.length <= 1) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsImageTransitioning(prev => ({
        ...prev,
        [hoveredProduct]: true
      }));

      // After fade out, change image and fade in
      setTimeout(() => {
        setCurrentImageIndex(prev => {
          const currentIndex = prev[hoveredProduct] || 0;
          const nextIndex = (currentIndex + 1) % product.mediaUrls.length;
          return {
            ...prev,
            [hoveredProduct]: nextIndex
          };
        });

        // Fade in
        setTimeout(() => {
          setIsImageTransitioning(prev => ({
            ...prev,
            [hoveredProduct]: false
          }));
        }, 50);
      }, 300); // Half of transition duration
    }, 1200); // Increased interval to account for fade time

    return () => clearInterval(interval);
  }, [hoveredProduct, allProducts]);

  // Determine productsPerPage based on screen size (avoid window on SSR)
  let productsPerPage = 4;
  if (isMobile) {
    productsPerPage = 2;
  } else if (isTablet) {
    productsPerPage = 3;
  }
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const currentProducts = allProducts.slice(
    (isMobile ? currentPage : desktopCurrentPage) * productsPerPage,
    ((isMobile ? currentPage : desktopCurrentPage) + 1) * productsPerPage
  );

  // Add new state for animation
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrevPage = () => {
    if (isMobile) {
      if (currentPage > 0) {
        setSlideDirection('right');
        setCurrentPage(currentPage - 1);
      }
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      if (desktopCurrentPage > 0) {
        setIsAnimating(true);
        setSlideDirection('right');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage - 1);
          setIsAnimating(false);
        }, 500);
      }
    } else {
      if (desktopCurrentPage > 0) {
        setIsAnimating(true);
        setSlideDirection('right');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage - 1);
          setIsAnimating(false);
        }, 500);
      }
    }
  };

  const handleNextPage = () => {
    if (isMobile) {
      if (currentPage < totalPages - 1) {
        setSlideDirection('left');
        setCurrentPage(currentPage + 1);
      }
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      if (desktopCurrentPage < totalPages - 1) {
        setIsAnimating(true);
        setSlideDirection('left');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage + 1);
          setIsAnimating(false);
        }, 500);
      }
    } else {
      if (desktopCurrentPage < totalPages - 1) {
        setIsAnimating(true);
        setSlideDirection('left');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage + 1);
          setIsAnimating(false);
        }, 500);
      }
    }
  };

  // Add CSS classes for animations
  const getSlideClass = (isAnimating: boolean, direction: 'left' | 'right') => {
    if (!isAnimating) return '';
    return direction === 'left' ? 'animate-slide-out-left' : 'animate-slide-out-right';
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-2 sm:px-6 md:px-8 lg:px-12 py-8 max-w-[95%] relative">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-lg md:text-xl text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
            Monthly Deals 
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/sales"
            className="text-sm text-gray-500 hover:underline mt-1 flex items-center font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View all
          </Link>
        </div>
        <div className="flex justify-center items-center py-4">
          <div className="text-gray-500 font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
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
      `}</style>
      <section className="w-full bg-gray-50 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-0 max-w-6xl relative">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-base sm:text-lg md:text-xl text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
            Monthly Deals 
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/sales"
            className="text-sm text-gray-500 hover:underline mt-1 flex items-center font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View all
          </Link>
        </div>

      <div 
        className="relative px-0 sm:px-0"
        onMouseEnter={() => setIsHoveringProducts(true)}
        onMouseLeave={() => setIsHoveringProducts(false)}
      >
        {/* Navigation Buttons - Hidden on mobile and tablet */}
        {!isMobile && !isTablet && desktopCurrentPage > 0 && (
          <button 
            onClick={handlePrevPage}
            className={`absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-all duration-300 z-10 shadow-lg ${
              isHoveringProducts ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {!isMobile && !isTablet && desktopCurrentPage < totalPages - 1 && (
          <button 
            onClick={handleNextPage}
            className={`absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-all duration-300 z-10 shadow-lg ${
              isHoveringProducts ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div 
          className="relative overflow-visible lg:overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="block lg:hidden">
            <>
            <style>{`
              .mobile-deals-scroll {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
              }
              .mobile-deals-scroll::-webkit-scrollbar {
                height: 6px; /* match categories scrollbar */
              }
              .mobile-deals-scroll::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.06);
                border-radius: 9999px;
              }
              .mobile-deals-scroll::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.35);
                border-radius: 9999px;
              }
              .mobile-deals-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(0,0,0,0.5);
              }
            `}</style>
            <div className="mobile-deals-scroll pb-6 md:pb-2 pl-8 pr-6">
              <div className="flex flex-nowrap gap-4 sm:gap-6 mr-6">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden relative flex flex-col w-full group max-w-[500px] min-w-0"
                  style={isMobile ? { width: '65vw', minWidth: '65vw', flex: '0 0 65vw' } : isTablet ? { width: '40vw', minWidth: '40vw', flex: '0 0 40vw' } : {}}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={() => handleMouseLeave(product.id)}
                >
                  <div className="relative">
                    <Image 
                      src={getCurrentImage(product)} 
                      alt={product.name} 
                      width={400}
                      height={320}
                      className={`w-full h-72 sm:h-96 object-cover transition-all duration-300 hover:scale-110 ${
                        isImageTransitioning[product.id] ? 'opacity-0' : 'opacity-100'
                      }`} 
                    />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#EF4444' }}>SALE</span>
                  </div>
                  <div className="pt-5 pb-0 flex flex-col">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <p className="text-gray-500 text-xs text-left group-hover:opacity-0 transition-opacity duration-300" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                        <Link
                          href={`/item-description/${product.id}`}
                          className="hidden sm:block absolute top-0 left-0 w-full text-white py-3 px-3 hover:opacity-100 transition-all duration-300 text-sm text-center rounded-sm border opacity-0 group-hover:opacity-100"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#423f3f', borderColor: '#423f3f', letterSpacing: '0.1em' }}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                      <h3 className="text-gray-900 text-base text-left line-clamp-2 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.name}</h3>
                      <div className="flex items-center gap-2">
                      <p className="text-gray-900 text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 text-sm line-through" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.originalPrice}</p>
                        )}
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        (product.stock || 0) > 5 ? 'bg-green-100 text-green-800' : 
                        (product.stock || 0) > 0 ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${
                          (product.stock || 0) > 5 ? 'bg-green-500' : 
                          (product.stock || 0) > 0 ? 'bg-orange-500' : 
                          'bg-red-500'
                        }`}></span>
                        {(product.stock || 0) > 5 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                  {/* Full-card link on mobile */}
                  <Link href={`/item-description/${product.id}`} className="sm:hidden absolute inset-0 z-10" aria-label={`View ${product.name}`} />
                </div>
              ))}
              </div>
            </div>
            </>
          </div>
          <div className="hidden lg:block">
            <div 
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center transition-all duration-500 ease-in-out ${getSlideClass(isAnimating, slideDirection)}`}
            >
              {currentProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="overflow-hidden relative flex flex-col w-full group"
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={() => handleMouseLeave(product.id)}
                >
                  <div className="relative">
                    <Image 
                      src={getCurrentImage(product)} 
                      alt={product.name} 
                      width={400}
                      height={320}
                      className={`w-full h-64 sm:h-96 object-cover transition-all duration-300 hover:scale-110 ${
                        isImageTransitioning[product.id] ? 'opacity-0' : 'opacity-100'
                      }`} 
                    />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#EF4444' }}>SALE</span>
                  </div>
                  <div className="pt-5 pb-0 flex flex-col">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <p className="text-gray-500 text-xs text-left group-hover:opacity-0 transition-opacity duration-300" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                        <Link
                          href={`/item-description/${product.id}`}
                          className="absolute top-0 left-0 w-full text-white py-3 px-3 hover:opacity-100 transition-all duration-300 text-sm text-center block rounded-sm border opacity-0 group-hover:opacity-100"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#423f3f', borderColor: '#423f3f', letterSpacing: '0.1em' }}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                      <h3 className="text-gray-900 text-base text-left line-clamp-2 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.name}</h3>
                      <div className="flex items-center gap-2">
                      <p className="text-gray-900 text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 text-sm line-through" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.originalPrice}</p>
                        )}
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        (product.stock || 0) > 5 ? 'bg-green-100 text-green-800' : 
                        (product.stock || 0) > 0 ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${
                          (product.stock || 0) > 5 ? 'bg-green-500' : 
                          (product.stock || 0) > 0 ? 'bg-orange-500' : 
                          'bg-red-500'
                        }`}></span>
                        {(product.stock || 0) > 5 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </div>
      </section>
    </>
  );
}
