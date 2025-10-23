import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../../services/productService';

export default function FreshDrops() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHoveringFreshDrops, setIsHoveringFreshDrops] = useState(false);
  const [freshDropsPage, setFreshDropsPage] = useState(0);
  const [desktopFreshDropsPage, setDesktopFreshDropsPage] = useState(0);
  const [freshDropsSlideDirection, setFreshDropsSlideDirection] = useState<'left' | 'right'>('right');
  const [freshDropsTouchStart, setFreshDropsTouchStart] = useState<number | null>(null);
  const [freshDropsTouchEnd, setFreshDropsTouchEnd] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isImageTransitioning, setIsImageTransitioning] = useState<{ [key: number]: boolean }>({});


  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Fresh Drops touch handlers
  const onFreshDropsTouchStart = (e: React.TouchEvent) => {
    setFreshDropsTouchEnd(null);
    setFreshDropsTouchStart(e.targetTouches[0].clientX);
  };

  const onFreshDropsTouchMove = (e: React.TouchEvent) => {
    setFreshDropsTouchEnd(e.targetTouches[0].clientX);
  };

  const onFreshDropsTouchEnd = () => {
    if (!freshDropsTouchStart || !freshDropsTouchEnd) return;
    const distance = freshDropsTouchStart - freshDropsTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && freshDropsPage < totalPages - 1) {
      setFreshDropsSlideDirection('left');
      setFreshDropsPage(prev => prev + 1);
    }
    if (isRightSwipe && freshDropsPage > 0) {
      setFreshDropsSlideDirection('right');
      setFreshDropsPage(prev => prev - 1);
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

  // Fetch products using the same service as collection page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 FreshDrops: Starting to fetch products...');
        
        // Use the same service as collection page to ensure consistent image handling
        const products = await getAllProducts();
        console.log('📦 FreshDrops: Received products:', products);
        console.log('📦 FreshDrops: Products length:', products?.length || 0);
        
        
        // Transform to the format expected by FreshDrops component
        const transformedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price, // Already formatted in productService
          image: product.image,
          mediaUrls: product.mediaUrls || [],
          colors: product.colors || ["black"],
          stock: product.stock || 0,
          category: product.category || 'Lighting' // Use actual category from Supabase
        }));
        
        setAllProducts(transformedProducts);
      } catch (error) {
        console.error('❌ FreshDrops: Error fetching products:', error);
        setAllProducts([]);
      } finally {
        console.log('✅ FreshDrops: Setting loading to false');
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

  // Fresh Drops products
  const freshDropsProducts = allProducts.slice(
    (isMobile ? freshDropsPage : desktopFreshDropsPage) * productsPerPage,
    ((isMobile ? freshDropsPage : desktopFreshDropsPage) + 1) * productsPerPage
  );

  // Add new state for animation
  const [isFreshDropsAnimating, setIsFreshDropsAnimating] = useState(false);

  const handleFreshDropsPrevPage = () => {
    if (isMobile) {
      if (freshDropsPage > 0) {
        setFreshDropsSlideDirection('right');
        setFreshDropsPage(freshDropsPage - 1);
      }
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      if (desktopFreshDropsPage > 0) {
        setIsFreshDropsAnimating(true);
        setFreshDropsSlideDirection('right');
        setTimeout(() => {
          setDesktopFreshDropsPage(desktopFreshDropsPage - 1);
          setIsFreshDropsAnimating(false);
        }, 500);
      }
    } else {
      if (desktopFreshDropsPage > 0) {
        setIsFreshDropsAnimating(true);
        setFreshDropsSlideDirection('right');
        setTimeout(() => {
          setDesktopFreshDropsPage(desktopFreshDropsPage - 1);
          setIsFreshDropsAnimating(false);
        }, 500);
      }
    }
  };

  const handleFreshDropsNextPage = () => {
    if (isMobile) {
      if (freshDropsPage < totalPages - 1) {
        setFreshDropsSlideDirection('left');
        setFreshDropsPage(freshDropsPage + 1);
      }
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      if (desktopFreshDropsPage < totalPages - 1) {
        setIsFreshDropsAnimating(true);
        setFreshDropsSlideDirection('left');
        setTimeout(() => {
          setDesktopFreshDropsPage(desktopFreshDropsPage + 1);
          setIsFreshDropsAnimating(false);
        }, 500);
      }
    } else {
      if (desktopFreshDropsPage < totalPages - 1) {
        setIsFreshDropsAnimating(true);
        setFreshDropsSlideDirection('left');
        setTimeout(() => {
          setDesktopFreshDropsPage(desktopFreshDropsPage + 1);
          setIsFreshDropsAnimating(false);
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
      <section className="container mx-auto px-2 sm:px-6 md:px-8 lg:px-12 py-8 mt-8 max-w-[95%] relative">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-lg md:text-xl text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
            Fresh Drops
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/sales"
            className="text-sm font-medium text-gray-500 hover:underline mt-1 flex items-center font-semibold"
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
      <section className="w-full bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-0 sm:px-0 max-w-6xl relative">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-lg md:text-xl text-black font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
            Fresh Drops
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/sales"
            className="text-sm font-medium text-gray-500 hover:underline mt-1 flex items-center font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View all
          </Link>
        </div>

      <div 
        className="relative px-0 sm:px-0"
        onMouseEnter={() => setIsHoveringFreshDrops(true)}
        onMouseLeave={() => setIsHoveringFreshDrops(false)}
      >
        {/* Navigation Buttons - Hidden on mobile and tablet */}
        {!isMobile && !isTablet && desktopFreshDropsPage > 0 && (
          <button 
            onClick={handleFreshDropsPrevPage}
            className={`absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-all duration-300 z-10 shadow-lg ${
              isHoveringFreshDrops ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {!isMobile && !isTablet && desktopFreshDropsPage < totalPages - 1 && (
          <button 
            onClick={handleFreshDropsNextPage}
            className={`absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-all duration-300 z-10 shadow-lg ${
              isHoveringFreshDrops ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div 
          className="relative overflow-hidden"
          onTouchStart={onFreshDropsTouchStart}
          onTouchMove={onFreshDropsTouchMove}
          onTouchEnd={onFreshDropsTouchEnd}
        >
          {(isMobile || isTablet) ? (
            <div className="flex flex-nowrap overflow-x-auto gap-6 pb-2 px-1 -mx-1">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden relative flex flex-col w-full group max-w-[500px] min-w-0"
                  style={isMobile ? { width: '70vw', minWidth: '70vw', flex: '0 0 70vw' } : isTablet ? { width: '40vw', minWidth: '40vw', flex: '0 0 40vw' } : {}}
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
                    <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#10B981' }}>NEW</span>
                  </div>
                  <div className="pt-5 pb-0 flex flex-col">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <p className="text-gray-500 text-xs text-left group-hover:opacity-0 transition-opacity duration-300" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                        <Link
                          href={`/item-description/${product.id}?source=new`}
                          className="absolute top-0 left-0 w-full text-white py-3 px-3 hover:opacity-80 transition-all duration-300 text-sm text-center block rounded-sm border opacity-0 group-hover:opacity-100"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#423f3f', borderColor: '#423f3f', letterSpacing: '0.1em' }}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                      <h3 className="text-gray-900 text-base text-left line-clamp-2 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.name}</h3>
                      <p className="text-gray-900 text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.price}</p>
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
          ) : (
            <div 
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center transition-all duration-500 ease-in-out ${getSlideClass(isFreshDropsAnimating, freshDropsSlideDirection)}`}
            >
              {freshDropsProducts.map((product) => (
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
                    <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#10B981' }}>NEW</span>
                  </div>
                  <div className="pt-5 pb-0 flex flex-col">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <p className="text-gray-500 text-xs text-left group-hover:opacity-0 transition-opacity duration-300" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                        <Link
                          href={`/item-description/${product.id}?source=new`}
                          className="absolute top-0 left-0 w-full text-white py-3 px-3 hover:opacity-80 transition-all duration-300 text-sm text-center block rounded-sm border opacity-0 group-hover:opacity-100"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#423f3f', borderColor: '#423f3f', letterSpacing: '0.1em' }}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                      <h3 className="text-gray-900 text-base text-left line-clamp-2 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.name}</h3>
                      <p className="text-gray-900 text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.price}</p>
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
          )}
        </div>
      </div>
        </div>
      </section>
    </>
  );
}
