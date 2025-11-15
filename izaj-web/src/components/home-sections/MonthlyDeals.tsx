import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { getAllProducts } from '../../services/productService';
import { InternalApiService } from '../../services/internalApi';

export default function MonthlyDeals() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [desktopCurrentPage, setDesktopCurrentPage] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
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

    // Calculate totalPages for mobile
    const mobileProductsPerPage = allProducts.length;
    const mobileTotalPages = Math.ceil(allProducts.length / mobileProductsPerPage);

    if (isLeftSwipe && currentPage < mobileTotalPages - 1) {
      setSlideDirection('forward');
      setCurrentPage(prev => prev + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setSlideDirection('backward');
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(w < 640); 
      setIsTablet(w >= 640 && w < 1024);
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
          let discountPercentage: number | undefined = undefined;
          
          if (saleDetails) {
            if (saleDetails.percentage) {
              // Calculate discount based on percentage
              discountPercentage = saleDetails.percentage;
              const discountAmount = (originalPrice * saleDetails.percentage) / 100;
              salePrice = originalPrice - discountAmount;
            } else if (saleDetails.fixed_amount) {
              // Calculate discount based on fixed amount
              salePrice = Math.max(0, originalPrice - saleDetails.fixed_amount);
              // Calculate percentage from fixed amount
              discountPercentage = originalPrice > 0 ? Math.round((saleDetails.fixed_amount / originalPrice) * 100) : 0;
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
            discountPercentage: discountPercentage,
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
    productsPerPage = allProducts.length; // Show all on mobile
  } else if (isTablet) {
    productsPerPage = 3;
  }
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const getCurrentPageItems = () => {
    const start = (isMobile ? currentPage : desktopCurrentPage) * productsPerPage;
    return allProducts.slice(start, start + productsPerPage);
  };

  const currentProducts = getCurrentPageItems();

  // Add new state for animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const [isScrollbarNavigation, setIsScrollbarNavigation] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate max scroll position for continuous scrolling
  const getMaxScroll = () => {
    if (productsContainerRef.current && scrollbarContainerRef.current) {
      const containerWidth = scrollbarContainerRef.current.offsetWidth;
      const contentWidth = productsContainerRef.current.scrollWidth;
      return Math.max(0, contentWidth - containerWidth);
    }
    return 0;
  };

  // Calculate one product card width including gap
  const getOneCardWidth = () => {
    if (productsContainerRef.current) {
      const firstCard = productsContainerRef.current.querySelector('[data-product-card]') as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        // Get gap from computed styles (gap-6 = 24px, gap-8 = 32px)
        const computedStyle = window.getComputedStyle(productsContainerRef.current);
        const gap = parseFloat(computedStyle.gap) || 24;
        return cardWidth + gap;
      }
    }
    // Fallback: calculate based on container width (25% per card + gap)
    if (scrollbarContainerRef.current) {
      const containerWidth = scrollbarContainerRef.current.offsetWidth;
      const cardWidth = containerWidth / 4; // 4 cards per view
      const gap = 24; // Default gap
      return cardWidth + gap;
    }
    return 0;
  };

  // Initialize scrollbar navigation on mount
  useEffect(() => {
    setIsScrollbarNavigation(true);
  }, []);

  const handlePrevPage = () => {
    if (isMobile) {
      if (currentPage > 0) {
        setSlideDirection('backward');
        setCurrentPage(currentPage - 1);
      }
    } else {
      if (desktopCurrentPage > 0 && !isAnimating) {
        setIsScrollbarNavigation(false); // Use opacity fade for arrows
        setIsAnimating(true);
        setSlideDirection('backward');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage - 1);
          setIsAnimating(false);
        }, 300);
      }
    }
  };

  const handleNextPage = () => {
    if (isMobile) {
      if (currentPage < totalPages - 1) {
        setSlideDirection('forward');
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (desktopCurrentPage < totalPages - 1 && !isAnimating) {
        setIsScrollbarNavigation(false); // Use opacity fade for arrows
        setIsAnimating(true);
        setSlideDirection('forward');
        setTimeout(() => {
          setDesktopCurrentPage(desktopCurrentPage + 1);
          setIsAnimating(false);
        }, 300);
      }
    }
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
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 md:py-16 mt-2 md:mt-8 relative bg-gray-50">
        <div className="flex justify-between items-baseline mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl text-black font-extrabold" style={{ fontFamily: 'Jost, sans-serif' }}>
            Monthly Deals 
          </h2>
          <div className="flex-grow"></div>
          <Link
            href="/sales"
            className="text-xs sm:text-sm font-medium text-gray-500 hover:underline mt-1 flex items-center font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View all
          </Link>
        </div>

        <div
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
            `}
          </style>

          {(isMobile || isTablet) ? (
            <div className="show-horizontal-scroll pb-6 md:pb-2 px-6">
              <div className="flex flex-nowrap gap-4 sm:gap-6 -mx-6">
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
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#EF4444' }}>
                      SALE{product.discountPercentage ? ` -${product.discountPercentage}%` : ''}
                    </span>
                  </div>
                  <div className="pt-5 pb-0 flex flex-col">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <p className={`text-gray-500 text-xs text-left transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                        <Link
                          href={`/item-description/${product.id}`}
                          className={`hidden sm:block absolute top-0 left-0 w-full text-white py-3 px-3 transition-all duration-300 text-sm text-center rounded-sm border ${
                            hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                          }`}
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
          ) : (
            <div className="relative overflow-hidden w-full">
              {/* Navigation arrows - inside products container */}
              {!(isMobile || isTablet) && totalPages > 1 && (
                <>
                  <button
                    onClick={() => {
                      const oneCardWidth = getOneCardWidth();
                      const newPosition = Math.max(0, scrollPosition - oneCardWidth);
                      setIsScrollbarNavigation(true);
                      setScrollPosition(newPosition);
                    }}
                    disabled={scrollPosition <= 0}
                    className="absolute left-2 top-[calc(50%-32px)] sm:top-[calc(50%-48px)] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous"
                  >
                    <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => {
                      const maxScroll = getMaxScroll();
                      const oneCardWidth = getOneCardWidth();
                      const newPosition = Math.min(maxScroll, scrollPosition + oneCardWidth);
                      setIsScrollbarNavigation(true);
                      setScrollPosition(newPosition);
                    }}
                    disabled={scrollPosition >= getMaxScroll()}
                    className="absolute right-2 top-[calc(50%-32px)] sm:top-[calc(50%-48px)] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next"
                  >
                    <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
              <div 
                ref={scrollbarContainerRef}
                className="relative overflow-hidden w-full"
              >
                <div 
                  ref={productsContainerRef}
                  className="flex flex-nowrap gap-6 sm:gap-8"
                  style={{
                    transform: `translateX(-${scrollPosition}px)`,
                    willChange: 'transform',
                    transition: isDraggingScrollbar ? 'none' : 'transform 0.2s ease-out'
                  }}
                >
                  {allProducts.map((product) => (
                    <div 
                      key={product.id}
                      data-product-card
                      className="overflow-hidden relative flex flex-col w-full group flex-shrink-0"
                      style={{ width: 'calc(25% - 18px)', minWidth: 'calc(25% - 18px)' }}
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
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-md whitespace-nowrap z-0" style={{ backgroundColor: '#EF4444' }}>
                      SALE{product.discountPercentage ? ` -${product.discountPercentage}%` : ''}
                    </span>
                      </div>
                      <div className="pt-5 pb-0 flex flex-col">
                        <div className="space-y-1.5">
                          <div className="relative">
                            <p className={`text-gray-500 text-xs text-left transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category || 'Lighting'}</p>
                            <Link
                              href={`/item-description/${product.id}`}
                              className={`absolute top-0 left-0 w-full text-white py-3 px-3 transition-all duration-300 text-sm text-center block rounded-sm border ${
                                hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                              }`}
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
          )}
        </div>

        {/* Horizontal scrollbar navigation */}
        {!(isMobile || isTablet) && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="w-3/4 max-w-2xl">
            <style>
              {`
                .page-scrollbar-container {
                  width: 100%;
                  height: 4px;
                  background: rgba(0,0,0,0.06);
                  border-radius: 9999px;
                  position: relative;
                  cursor: pointer;
                  user-select: none;
                }
                .page-scrollbar-thumb {
                  height: 100%;
                  background: rgba(0,0,0,0.3);
                  border-radius: 9999px;
                  position: absolute;
                  transition: left 0.1s ease, width 0.1s ease, background 0.2s ease;
                  min-width: 40px;
                  cursor: grab;
                }
                .page-scrollbar-thumb:active {
                  cursor: grabbing;
                  background: rgba(0,0,0,0.5);
                }
                .page-scrollbar-thumb:hover {
                  background: rgba(0,0,0,0.45);
                }
                .page-scrollbar-container.dragging .page-scrollbar-thumb {
                  transition: none;
                }
              `}
            </style>
            <div 
              ref={scrollbarRef}
              className={`page-scrollbar-container ${isDraggingScrollbar ? 'dragging' : ''}`}
              onClick={(e) => {
                if (!isDraggingScrollbar && e.target === scrollbarRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Use requestAnimationFrame to ensure DOM is ready
                  requestAnimationFrame(() => {
                    if (scrollbarRef.current && scrollbarContainerRef.current && productsContainerRef.current) {
                      const rect = scrollbarRef.current.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                      
                      const containerWidth = scrollbarContainerRef.current.offsetWidth;
                      const contentWidth = productsContainerRef.current.scrollWidth;
                      const maxScroll = Math.max(0, contentWidth - containerWidth);
                      const newPosition = percentage * maxScroll;
                      
                      setIsScrollbarNavigation(true);
                      setScrollPosition(newPosition);
                    }
                  });
                }
              }}
              onMouseDown={(e) => {
                if (e.target !== scrollbarRef.current) {
                  setIsDraggingScrollbar(true);
                  e.preventDefault();
                }
              }}
            >
              <div 
                className="page-scrollbar-thumb"
                style={{
                  left: (() => {
                    if (!scrollbarContainerRef.current || !productsContainerRef.current || getMaxScroll() <= 0) return '0%';
                    const containerWidth = scrollbarContainerRef.current.offsetWidth;
                    const contentWidth = productsContainerRef.current.scrollWidth;
                    const thumbWidth = (containerWidth / contentWidth) * 100;
                    const maxLeft = 100 - thumbWidth;
                    const currentLeft = (scrollPosition / getMaxScroll()) * maxLeft;
                    return `${Math.min(Math.max(0, currentLeft), maxLeft)}%`;
                  })(),
                  width: `${scrollbarContainerRef.current && productsContainerRef.current ? (scrollbarContainerRef.current.offsetWidth / productsContainerRef.current.scrollWidth) * 100 : (1 / totalPages) * 100}%`
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (scrollbarRef.current && scrollbarContainerRef.current && productsContainerRef.current) {
                    setIsDraggingScrollbar(true);
                    setIsScrollbarNavigation(true);
                    
                    // Calculate initial mouse position relative to thumb
                    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
                    const thumbRect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - thumbRect.left;
                    
                    // Store initial values for smooth dragging
                    const initialScrollPosition = scrollPosition;
                    const initialMouseX = e.clientX;
                    const scrollbarWidth = scrollbarRect.width;
                    const containerWidth = scrollbarContainerRef.current.offsetWidth;
                    const contentWidth = productsContainerRef.current.scrollWidth;
                    const maxScroll = Math.max(0, contentWidth - containerWidth);
                    
                    // Update position based on mouse movement
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - initialMouseX;
                      const percentage = deltaX / scrollbarWidth;
                      const scrollDelta = percentage * maxScroll;
                      const newPosition = Math.max(0, Math.min(maxScroll, initialScrollPosition + scrollDelta));
                      setScrollPosition(newPosition);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                      setIsDraggingScrollbar(false);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }
                }}
              />
            </div>
            </div>
          </div>
        )}

      </section>
    </>
  );
}
