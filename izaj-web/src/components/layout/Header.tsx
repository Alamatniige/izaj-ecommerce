"use client";
// Capitalize first letter of each name
function capitalize(str: string) {
    if (!str) return '';
    return str.split(' ').map(name => 
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ).join(' ');
  }
  
  // Get initials from name
  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
  
  import React, { useState, useEffect, useRef } from 'react';
  import Link from 'next/link';
  import Image from 'next/image';
  import { useRouter, usePathname } from 'next/navigation';
  import { Icon } from '@iconify/react';
 
  import NotificationDropdown from '../common/NotificationDropdown';
  import LoginModal from '../common/LoginModal';
  import { useUserContext } from '../../context/UserContext';
  import { useCartContext } from '../../context/CartContext';
  
  interface User {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  }
  
  interface HeaderProps {
    user?: User | null;
    setIsAccountDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    isAccountDropdownOpen?: boolean;
    handleLogout?: () => void;
    setUser?: React.Dispatch<React.SetStateAction<User | null>>;
  }

  // Promotional banners
  const promoBanners = [
    { id: 1, text: "Monthly Sale is here! → Enjoy 10% OFF items for the month of June", color: "bg-black" },
    { id: 2, text: "Free Installation on Orders Above ₱10,000 → Within San Pablo City", color: "bg-gray-800" },
    { id: 3, text: "New Arrivals! → Check out our latest lighting fixtures collection", color: "bg-gray-900" },
  ];
  
  const Header: React.FC<HeaderProps> = ({
    user: propUser,
    setIsAccountDropdownOpen: propSetIsAccountDropdownOpen,
    isAccountDropdownOpen: propIsAccountDropdownOpen,
    handleLogout: propHandleLogout,
    setUser: propSetUser
  }) => {
    // Search functionality
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    // Use UserContext as primary source, props as fallback
    const { user: contextUser, logout: contextLogout } = useUserContext();
    const { cart } = useCartContext();
    const user = propUser !== undefined ? propUser : contextUser;
    const handleLogout = propHandleLogout || contextLogout;
    const pathname = usePathname();
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [cartBadgePulse, setCartBadgePulse] = useState(false);
  const [productsDropdownPosition, setProductsDropdownPosition] = useState(0);
  const [ripples, setRipples] = useState<Array<{x: number; y: number; id: number}>>([]);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [accountDropdownPosition, setAccountDropdownPosition] = useState<'right' | 'left' | 'center'>('center');
  const [isMobileAccountDropdownOpen, setIsMobileAccountDropdownOpen] = useState(false);
  
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLLIElement>(null);
  const productsDropdownContentRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLAnchorElement>(null);
  const cartPreviewRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const dropdownCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [headerOffsetTop, setHeaderOffsetTop] = useState(0);
  
  
    // Compute mobile breakpoint on client only to avoid SSR hydration mismatch
    useEffect(() => {
      setIsClient(true);
      const updateIsMobile = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      updateIsMobile();
      window.addEventListener('resize', updateIsMobile);
      return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

  
    // Measure header height/offset for mobile menu placement
    useEffect(() => {
      const updateHeaderOffset = () => {
        const headerBottom = headerRef.current ? headerRef.current.getBoundingClientRect().bottom : 0;
        const bannerBottom = bannerRef.current ? bannerRef.current.getBoundingClientRect().bottom : 0;
        // Use whichever extends lower; ensures banner + header are included when banner is visible
        setHeaderOffsetTop(Math.max(headerBottom, bannerBottom));
      };
      updateHeaderOffset();
      window.addEventListener('resize', updateHeaderOffset);
      window.addEventListener('scroll', updateHeaderOffset, { passive: true });
      return () => {
        window.removeEventListener('resize', updateHeaderOffset);
        window.removeEventListener('scroll', updateHeaderOffset);
      };
    }, [isMobileMenuOpen, isBannerDismissed, scrolled]);

    // Ensure mobile PRODUCTS dropdown and account dropdown close when the menu closes
    useEffect(() => {
      if (!isMobileMenuOpen) {
        setIsDropdownOpen(false);
        setIsMobileAccountDropdownOpen(false);
      }
    }, [isMobileMenuOpen]);

    // Enhance mobile menu UX: lock body scroll and close on Escape
    useEffect(() => {
      if (!isClient) return;
      const originalOverflow = document.body.style.overflow;
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = originalOverflow || '';
      }

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      };
      
      if (isMobileMenuOpen) {
        window.addEventListener('keydown', onKeyDown);
      }
      
      return () => {
        document.body.style.overflow = originalOverflow || '';
        window.removeEventListener('keydown', onKeyDown);
      };
    }, [isClient, isMobileMenuOpen]);
  
    // Scroll effects
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        setScrolled(scrollTop > 50);
        setScrollProgress(scrollPercent);
        
        // Close dropdown when scrolling
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isDropdownOpen]);

    // Rotating banner
    useEffect(() => {
      if (isBannerDismissed) return;
      
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % promoBanners.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [isBannerDismissed]);

    // Cart badge pulse animation when items change
    useEffect(() => {
      if (cart.totalItems > 0) {
        setCartBadgePulse(true);
        const timeout = setTimeout(() => setCartBadgePulse(false), 1000);
        return () => clearTimeout(timeout);
      }
    }, [cart.totalItems]);

    // Update dropdown position continuously
    useEffect(() => {
      const updatePosition = () => {
        if (productsDropdownRef.current) {
          const rect = productsDropdownRef.current.getBoundingClientRect();
          setProductsDropdownPosition(rect.bottom);
        }
      };
      
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }, []);

    // Update account dropdown position based on viewport
    useEffect(() => {
      const updateAccountDropdownPosition = () => {
        if (accountDropdownRef.current && !isMobile) {
          const rect = accountDropdownRef.current.getBoundingClientRect();
          const dropdownWidth = 256; // w-64 = 256px
          const viewportWidth = window.innerWidth;
          const padding = 16; // Safe margin from edges
          
          // Check if dropdown would overflow when centered
          const dropdownLeft = rect.left + (rect.width / 2) - (dropdownWidth / 2);
          const dropdownRight = dropdownLeft + dropdownWidth;
          
          if (dropdownLeft < padding) {
            // If it would overflow on the left, position it to the left
            setAccountDropdownPosition('left');
          } else if (dropdownRight > (viewportWidth - padding)) {
            // If it would overflow on the right, position it to the right
            setAccountDropdownPosition('right');
          } else {
            // Center it
            setAccountDropdownPosition('center');
          }
        }
      };
      
      // Update position when dropdown opens
      if (isAccountDropdownOpen) {
        updateAccountDropdownPosition();
      }
      
      window.addEventListener('resize', updateAccountDropdownPosition);
      
      return () => {
        window.removeEventListener('resize', updateAccountDropdownPosition);
      };
    }, [isAccountDropdownOpen, isMobile]);

    // Search function
    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search products from your API
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.products || []);
        } else {
          console.error('Search API failed:', response.status);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounced search
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (searchQuery.trim()) {
          handleSearch(searchQuery);
        } else {
          setSearchResults([]);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle search form submission
    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/product-list?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
        setShowSearchSuggestions(false);
      }
    };
  
    const handleLogoutClick = () => {
      // Clear auth token but keep user data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Call the logout handler
      handleLogout();
      
      // Close the dropdown
      setIsAccountDropdownOpen(false);
      
      // Navigate to home page
      router.push('/');
    };
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        
        if (accountDropdownRef.current && !accountDropdownRef.current.contains(target)) {
          setIsAccountDropdownOpen(false);
        }
        if (productsDropdownRef.current && !productsDropdownRef.current.contains(target) &&
            productsDropdownContentRef.current && !productsDropdownContentRef.current.contains(target)) {
          setIsDropdownOpen(false);
        }
        // Don't close mobile menu on outside click when menu is open - let backdrop handle it
        // This prevents conflicts between backdrop click and outside click handler
        if (cartPreviewRef.current && !cartPreviewRef.current.contains(target) &&
            cartIconRef.current && !cartIconRef.current.contains(target)) {
          setIsCartPreviewOpen(false);
        }
        if (searchRef.current && !searchRef.current.contains(target)) {
          setShowSearchSuggestions(false);
        }
      };

      // Only add listener when mobile menu is closed to avoid conflicts
      if (!isMobileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        // Clean up timer on unmount
        if (dropdownCloseTimer.current) {
          clearTimeout(dropdownCloseTimer.current);
        }
      };
    }, [setIsAccountDropdownOpen, isMobileMenuOpen]);
  
    // Handler for Home navigation
    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      router.push('/');
    };

    // Ripple effect handler
    const createRipple = (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, 600);
    };

    // Check if link is active
    const isLinkActive = (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname?.startsWith(href);
    };
  
    return (
      <>
        {/* Scroll Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-black via-gray-800 to-gray-600 z-[100] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Promotional Banner (included with header even when menu is open) */}
        {!isBannerDismissed && (
          <div 
            className={`${promoBanners[currentBannerIndex].color} text-white text-center py-2 md:py-3 flex items-center justify-center w-full relative transition-all duration-500 z-50`}
            style={{ minHeight: isMobile ? '36px' : '40px' }}
            ref={bannerRef}
          >
            <p className="text-xs md:text-sm px-3 md:px-12 w-full animate-fade-in font-medium" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.02em', lineHeight: isMobile ? '1.4' : '1.6', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
              {promoBanners[currentBannerIndex].text}
            </p>
            <button
              onClick={() => setIsBannerDismissed(true)}
              className="absolute right-2 md:right-4 text-white hover:text-gray-200 transition-colors duration-200"
              aria-label="Dismiss banner"
            >
              <Icon icon="mdi:close" width="20" height="20" />
            </button>
            
            {/* Banner indicators */}
            <div className="hidden md:flex absolute bottom-0 left-1/2 transform -translate-x-1/2 space-x-1 pb-1">
              {promoBanners.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentBannerIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
        </div>
          </div>
        )}

        <header 
          className={`bg-white px-4 lg:px-10 flex flex-col sticky top-0 ${isMobileMenuOpen ? 'z-[60]' : 'z-10'} transition-all duration-300 ${
            scrolled ? 'py-2 shadow-lg' : 'py-3 shadow-md'
          }`}
          ref={headerRef}
        >
             {/* Top Header Row */}
             <div className="flex items-center justify-between w-full relative">
            {/* Mobile Menu Button and Logo Container */}
            <div className="flex items-center space-x-4">
              <button 
                className={`lg:hidden relative z-[70] w-10 h-10 flex items-center justify-center text-black transition-all duration-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${
                  isMobileMenuOpen ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-7 h-7">
                  <Icon 
                    icon="mdi:menu" 
                    width="28" 
                    height="28"
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen 
                        ? 'opacity-0 rotate-90 scale-0' 
                        : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <Icon 
                    icon="mdi:close" 
                    width="28" 
                    height="28"
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen 
                        ? 'opacity-100 rotate-0 scale-100' 
                        : 'opacity-0 -rotate-90 scale-0'
                    }`}
                  />
                </div>
              </button>
  
              {/* Logo with animation */}
              <Link href="/" className="flex flex-col items-center lg:items-start flex-shrink-0 w-auto lg:w-full group absolute left-[56%] -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0 lg:transform-none">
                <div
                  className={`tracking-wide flex-shrink-0 leading-tight font-semibold transition-all duration-300 font-playfair ${
                    scrolled ? 'text-2xl lg:text-4xl' : 'text-3xl lg:text-6xl'
                  }`}
                  style={{
                    color: "#000000",
                    textShadow: "-2px 0px 2px rgba(0, 0, 0, 0.5)",
                    letterSpacing: "8px",
                    whiteSpace: "nowrap",
                    width: "100%",
                    display: "inline-block",
                    transform: "scale(0.95)",
                    transformOrigin: "left"
                  }}
                >
                  IZAJ
                  <Icon 
                    icon="mdi:lightbulb-on" 
                    className="inline-block ml-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    width={scrolled ? "20" : "28"}
                    height={scrolled ? "20" : "28"}
                  />
                </div>
              </Link>
            </div>
  
            {/* Right Section with Search, User, Notification, and Cart Icons */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Search Bar - Hidden on mobile */}
              <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl transition-all duration-300 ${
                scrolled ? 'max-w-md' : 'max-w-xl'
              }`} ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search products, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                    className={`w-full border border-gray-300 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-full transition-all duration-300  ${
                      scrolled ? 'py-2' : 'py-3'
                    }`}
                    style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.015em', lineHeight: '1.6' }}
                  />
                  <Icon 
                    icon="ic:outline-search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    width="20"
                    height="20"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Icon icon="mdi:close-circle" width="18" height="18" />
                    </button>
                  )}
                </form>

                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && (searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9997] animate-slide-down">
                    <div className="py-2">
                      {isSearching ? (
                        <div className="flex items-center justify-center px-4 py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                          <span className="ml-3 text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                            Searching...
                          </span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/item-description/${product.id}`}
                              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                              onClick={() => {
                                setShowSearchSuggestions(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-gray-400 transition-all duration-200 relative">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  unoptimized
                                />
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-800 group-hover:text-black transition-colors duration-200" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.015em', lineHeight: '1.5' }}>
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-500 capitalize" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '400', letterSpacing: '0.02em', lineHeight: '1.5' }}>
                                    {product.category}
                                  </p>
                                  {product.price && (
                                    <p className="text-xs font-semibold text-black" style={{ fontFamily: 'Jost, sans-serif' }}>
                                      ₱{product.price.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Icon 
                                icon="mdi:arrow-right" 
                                className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200"
                                width="20"
                                height="20"
                              />
                            </Link>
                          ))}
                        </>
                      ) : searchQuery.trim() && (
                        <div className="flex items-center justify-center px-4 py-8">
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>
                            No products found for "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </div>
                    {searchResults.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/product-list?search=${encodeURIComponent(searchQuery)}`);
                            setShowSearchSuggestions(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-sm text-black hover:text-gray-600 font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.025em', lineHeight: '1.6' }}
                        >
                          <Icon icon="mdi:magnify" width="18" height="18" />
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
  
              {/* Mobile Search Button */}
              <button 
                className="lg:hidden text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Icon icon="ic:outline-search" width="25" height="25" />
              </button>
  
              {/* Login/Signup Section with Icons */}
              <div className="flex items-center space-x-6 items-center">
                {/* User Icon or Account Dropdown */}
                {!isClient ? (
                  // Server-side rendering: always show the login button to avoid hydration mismatch
                  <div className="flex items-center justify-center relative group">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="flex items-center space-x-2 text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                      aria-label="Login"
                    >
                      <div className="w-7 h-7 flex items-center justify-center">
                        <Icon icon="lucide:user" width="28" height="28" />
                      </div>
                      <span className="hidden md:inline-block text-sm font-medium text-gray-700 opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.025em', lineHeight: '1.5' }}>
                      Hello! Log in
                      </span>
                    </button>
                  </div>
                ) : (
                  // Client-side rendering: use mobile detection and user state
                  isMobile ? null : (
                    !user ? (
                      <div className="flex items-center justify-center relative group">
                        <button
                          onClick={() => (isMobile ? router.push('/login') : setIsLoginModalOpen(true))}
                          className="flex items-center space-x-2 text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                          aria-label="Login"
                        >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <Icon icon="lucide:user" width="28" height="28" />
                        </div>
                        <span className="hidden md:inline-block text-sm font-medium text-gray-700 opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.025em', lineHeight: '1.5' }}>
                        Hello! Log in
                        </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center relative group" ref={accountDropdownRef}>
                        <button
                          onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                          className="flex items-center transition-all duration-300 hover:scale-110"
                          aria-haspopup="true"
                          aria-expanded={isAccountDropdownOpen}
                        >
                          <div className="w-7 h-7 flex items-center justify-center rounded-full overflow-hidden">
                            {user.profilePicture ? (
                              <Image 
                                src={user.profilePicture} 
                                alt="Profile" 
                                width={28}
                                height={28}
                                className="object-cover ring-2 ring-gray-200 hover:ring-gray-400 transition-all duration-200"
                                unoptimized
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold hover:shadow-lg transition-all duration-200">
                                {getInitials(user.firstName, user.lastName)}
                              </div>
                            )}
                          </div>
                          <div className="hidden md:flex flex-col ml-2 text-left">
                            <span
                              className="font-normal text-xs text-gray-500 leading-none "
                              style={{ fontFamily: 'Jost, sans-serif', letterSpacing: "0.02em" }}
                            >
                              Hello, {user ? `${capitalize((user.firstName || '').split(' ')[0])}` : 'Guest'}
                            </span>
                            <div className="flex items-center text-black">
                              <span
                                className="font-semibold text-base "
                                style={{ fontFamily: 'Jost, sans-serif', letterSpacing: "0.01em" }}
                              >
                                My Account
                              </span>
                              <Icon
                                icon="mdi:chevron-down"
                                width="20"
                                height="20"
                                className={`ml-1 text-black transition-transform duration-300 ${
                                  isAccountDropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                              />
                            </div>
                          </div>
                        </button>
  
                        {/* Account Dropdown - Enhanced - Desktop Only */}
                        {isAccountDropdownOpen && !isMobile && (
                          <div className={`absolute ${
                            accountDropdownPosition === 'center' ? 'left-1/2 transform -translate-x-1/2 origin-top' :
                            accountDropdownPosition === 'right' ? 'right-0 origin-top-right' :
                            'left-0 origin-top-left'} top-full mt-1 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-in`} style={{
                            maxWidth: 'calc(100vw - 2rem)',
                            zIndex: 999999,
                            position: 'absolute'
                          }}>
                            {/* User Info Header */}
                            <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                              <div className="flex items-center space-x-3">
                                {user.profilePicture ? (
                                  <Image 
                                    src={user.profilePicture} 
                                    alt="Profile" 
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover ring-2 ring-white shadow-md"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-lg font-bold shadow-md">
                                    {getInitials(user.firstName, user.lastName)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.015em', lineHeight: '1.5' }}>
                                    {capitalize(user.firstName)} {capitalize(user.lastName)}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '400', letterSpacing: '0.02em', lineHeight: '1.5' }}>{user.email}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="py-1">
                              <Link
                                href="/account"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5' }}
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <Icon icon="mdi:account-circle-outline" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                My Account
                              </Link>
                              
                              <Link
                                href="/orders"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5' }}
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <Icon icon="mdi:package-variant" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                My Orders
                              </Link>
                              
                              <Link
                                href="/favorites"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5' }}
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <Icon icon="mdi:heart-outline" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                My Favorites
                              </Link>
                              
                              <hr className="border-gray-200 my-1" />
                              <button
                                onClick={handleLogoutClick}
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all duration-200 group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.02em', lineHeight: '1.5' }}
                              >
                                <Icon icon="mdi:logout" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                Logout
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )
                )}
  
                {/* Heart Icon with Tooltip - REMOVED */}
                {/* <div className="flex items-center justify-center relative group">
                  {!isClient ? (
                    <>
                    <FavoritesDropdown 
                      user={null} 
                      onOpenAuthModal={() => setIsLoginModalOpen(true)}
                    />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        Favorites
                      </div>
                    </>
                  ) : (
                    isMobile ? (
                      <>
                      <button
                        onClick={() => {
                          if (user) {
                            router.push('/favorites');
                        } else {
                          setIsLoginModalOpen(true);
                        }
                        }}
                          className="text-black hover:text-orange-500 transition-all duration-200 hover:scale-110"
                        aria-label="Favorites"
                        id="favorites-icon"
                      >
                        <Icon icon="mdi:heart-outline" width="28" height="28" />
                      </button>
                      </>
                    ) : (
                      <>
                      <FavoritesDropdown 
                        user={user} 
                        onOpenAuthModal={() => setIsLoginModalOpen(true)}
                      />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          Favorites
                        </div>
                      </>
                    )
                  )}
                </div> */}

                {/* Notification Icon with Tooltip */}
                {!(isClient && isMobile) && (
                <div className="flex items-center justify-center relative group">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <NotificationDropdown 
                      user={!isClient ? null : user} 
                      onOpenAuthModal={() => (isMobile ? router.push('/login') : setIsLoginModalOpen(true))}
                    />
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                    Notifications
                  </div>
                </div>
                )}
  
                {/* Cart Icon with Enhanced Badge and Preview */}
                <div className="flex items-center justify-center relative group">
                  {!isClient ? (
                    <>
                    <button
                        onClick={() => (isMobile ? router.push('/login') : setIsLoginModalOpen(true))}
                        className="text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                    >
                      <div className="w-7 h-7 flex items-center justify-center">
                        <Icon
                          icon="mdi:cart-outline"
                          width="28"
                          height="28"
                        />
                      </div>
                    </button>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        Shopping Cart
                      </div>
                    </>
                  ) : (
                    user ? (
                      <>
                        <Link 
                          href="/cart" 
                          className="relative text-black hover:text-gray-600 transition-all duration-200 hover:scale-110" 
                          ref={cartIconRef} 
                          id="cart-icon"
                          onMouseEnter={() => !isMobile && setIsCartPreviewOpen(true)}
                        >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <Icon
                            icon="mdi:cart-outline"
                            width={isMobile ? "25" : "28"}
                            height={isMobile ? "25" : "28"}
                          />
                        </div>
                        {cart.totalItems > 0 && (
                            <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-gray-800 to-black text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg ${
                              cartBadgePulse ? 'animate-bounce' : ''
                            }`}>
                            {cart.totalItems}
                          </span>
                        )}
                      </Link>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          Cart ({cart.totalItems})
                        </div>

                        {/* Cart Preview Dropdown */}
                        {isCartPreviewOpen && cart.totalItems > 0 && !isMobile && (
                          <div 
                            ref={cartPreviewRef}
                            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-[9998] overflow-hidden border border-gray-200 top-full animate-scale-in"
                            onMouseLeave={() => setIsCartPreviewOpen(false)}
                          >
                            <div className="py-4 px-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                              <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg" style={{ fontFamily: 'Jost, sans-serif' }}>
                                <Icon icon="mdi:cart-outline" className="w-6 h-6 text-black" />
                                Shopping Cart
                              </h3>
                            </div>
                            <div className="max-h-80 overflow-y-auto p-6">
                              {cart.items.length > 0 ? (
                                <div className="space-y-4">
                                  {cart.items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 relative">
                                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain rounded-lg" unoptimized />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm truncate" style={{ fontFamily: 'Jost, sans-serif' }}>
                                          {item.name}
                                        </h4>
                                        <p className="text-gray-600 text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>
                                          Qty: {item.quantity}
                                        </p>
                                        <p className="font-bold text-black text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                                          ₱{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {cart.items.length > 3 && (
                                    <div className="text-center py-2">
                                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>
                                        +{cart.items.length - 3} more items
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <Icon icon="mdi:cart-outline" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    Your cart is empty
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  Total ({cart.totalItems} items):
                                </span>
                                <span className="font-bold text-black text-lg" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  ₱{cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                                </span>
                              </div>
                              <Link
                                href="/cart"
                                className="block w-full text-center px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-sm"
                                style={{ fontFamily: 'Jost, sans-serif' }}
                                onClick={() => setIsCartPreviewOpen(false)}
                              >
                                View Cart
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                      <button
                        onClick={() => setIsLoginModalOpen(true)}
                          className="text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                      >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <Icon
                            icon="mdi:cart-outline"
                            width={isMobile ? "25" : "28"}
                            height={isMobile ? "25" : "28"}
                          />
                        </div>
                      </button>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          Shopping Cart
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Mobile Search Bar - Only visible when search icon is clicked */}
          {isMobileSearchOpen && (
            <div className="lg:hidden mt-4 relative animate-slide-down" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="w-full border border-gray-300 pl-10 pr-10 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black rounded-full "
                  style={{ letterSpacing: '0.015em', lineHeight: '1.6' }}
                  autoFocus
                />
                <Icon 
                  icon="ic:outline-search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  width="20"
                  height="20"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    setSearchQuery('');
                    setShowSearchSuggestions(false);
                    setSearchResults([]);
                  }}
                >
                  <Icon icon="mdi:close" width="20" height="20" />
                </button>
              </form>

              {/* Mobile Search Suggestions */}
              {showSearchSuggestions && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9997] animate-slide-down">
                  <div className="py-2">
                    {isSearching ? (
                      <div className="flex items-center justify-center px-4 py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                        <span className="ml-3 text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
                          Searching...
                        </span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/item-description/${product.id}`}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => {
                              setShowSearchSuggestions(false);
                              setSearchQuery('');
                              setIsMobileSearchOpen(false);
                            }}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.015em', lineHeight: '1.5' }}>
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500 capitalize" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '400', letterSpacing: '0.02em', lineHeight: '1.5' }}>
                                  {product.category}
                                </p>
                                {product.price && (
                                  <p className="text-xs font-semibold text-black" style={{ fontFamily: 'Jost, sans-serif' }}>
                                    ₱{product.price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : searchQuery.trim() && (
                      <div className="flex items-center justify-center px-4 py-8">
                        <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>
                          No products found for "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/product-list?search=${encodeURIComponent(searchQuery)}`);
                          setShowSearchSuggestions(false);
                          setSearchQuery('');
                          setIsMobileSearchOpen(false);
                        }}
                        className="w-full text-sm text-black hover:text-gray-600 font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                        style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.025em', lineHeight: '1.6' }}
                      >
                        <Icon icon="mdi:magnify" width="18" height="18" />
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
  
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop (starts below header so header remains visible) */}
              <div 
                className="lg:hidden fixed left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 animate-fade-in transition-opacity duration-300"
                style={{ top: headerOffsetTop || 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
              />
              {/* Modal Content */}
              <div
                ref={mobileMenuRef}
                className="lg:hidden fixed left-0 w-full max-w-none h-[calc(100vh-var(--header-offset,0px))] bg-white z-50 shadow-xl overflow-y-auto menu-drop-in"
                style={{ top: headerOffsetTop || 0, ['--header-offset' as any]: `${headerOffsetTop || 0}px` }}
                onClick={(e) => {
                  // Prevent menu from closing when clicking inside
                  e.stopPropagation();
                }}
              >
                {/* Main header acts as the modal header; no internal header here */}
                {/* Navigation Menu - Scrollable */}
                <div className="h-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <nav className="pl-4 pr-8 py-6">
                    <ul className="space-y-0 divide-y divide-gray-200 rounded-lg overflow-hidden bg-white">
                      <li>
                        <Link
                          href="/"
                          className={`flex items-center px-4 py-4 text-base transition-all duration-200 font-bold ${
                            isLinkActive('/') 
                              ? 'bg-gray-100 text-black' 
                              : 'text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em', lineHeight: '1.5', fontSize: '0.85rem' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          HOME
                        </Link>
                      </li>
                      <li>
                        <button
                          className={`w-full flex items-center justify-between px-4 py-4 text-base transition-all duration-200 focus:outline-none font-bold ${
                            isDropdownOpen ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em', lineHeight: '1.5', fontSize: '0.85rem' }}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          aria-expanded={isDropdownOpen}
                          aria-controls="mobile-products-dropdown"
                        >
                          <div className="flex items-center text-black">
                            PRODUCTS
                          </div>
                          <Icon
                            icon="mdi:chevron-down"
                            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            width="20"
                            height="20"
                          />
                        </button>
                        <div
                          id="mobile-products-dropdown"
                          className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} bg-white`}
                        >
                          <ul className="py-1 divide-y divide-gray-200">
                            <li>
                              <Link
                                href="/product-list"
                                className="block px-6 py-3 text-sm text-gray-800 hover:text-black hover:bg-gray-50 transition-colors duration-200 font-medium"
                                style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.05em', lineHeight: '1.6' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                All Lighting Fixtures
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection"
                                className="block px-6 py-3 text-sm text-gray-800 hover:text-black hover:bg-gray-50 transition-colors duration-200 font-medium"
                                style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.05em', lineHeight: '1.6' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                New Arrivals
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sales"
                                className="block px-6 py-3 text-sm text-gray-800 hover:text-black hover:bg-gray-50 transition-colors duration-200 font-medium"
                                style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.05em', lineHeight: '1.6' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Special Offers
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <Link
                          href="/collection"
                          className={`flex items-center px-4 py-4 text-base transition-all duration-200 font-bold ${
                            isLinkActive('/collection') 
                              ? 'bg-gray-100 text-black' 
                              : 'text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em', lineHeight: '1.5', fontSize: '0.85rem' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          NEW
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/sales"
                          className={`flex items-center px-4 py-4 text-base transition-all duration-200 font-bold ${
                            isLinkActive('/sales') 
                              ? 'bg-gray-100 text-black' 
                              : 'text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em', lineHeight: '1.5', fontSize: '0.85rem' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          SALES
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/static/aboutus"
                          className={`flex items-center px-4 py-4 text-base transition-all duration-200 font-bold ${
                            isLinkActive('/static/aboutus') 
                              ? 'bg-gray-100 text-black' 
                              : 'text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em', lineHeight: '1.5', fontSize: '0.85rem' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          ABOUT US
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  {/* Bottom Section */}
                  <div className="pl-3 pr-4 sm:pl-4 sm:pr-8 py-4 md:py-6 border-t border-gray-200">
                    {user ? (
                      <div className="space-y-2">
                        <button
                          className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg cursor-pointer active:scale-[0.98] transition-all duration-200"
                          style={{ touchAction: 'manipulation' }}
                          onClick={() => setIsMobileAccountDropdownOpen(!isMobileAccountDropdownOpen)}
                          aria-label="Toggle Account Menu"
                          aria-expanded={isMobileAccountDropdownOpen}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            {user.profilePicture ? (
                                <Image 
                                  src={user.profilePicture} 
                                  alt="Profile" 
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover ring-2 ring-white flex-shrink-0"
                                  unoptimized
                                />
                            ) : (
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                                {getInitials(user.firstName, user.lastName)}
                              </div>
                            )}
                            <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.015em', lineHeight: '1.4' }}>
                                {capitalize(user.firstName)} {capitalize(user.lastName)}
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-600 truncate mt-0.5" style={{ fontFamily: 'Jost, sans-serif', fontWeight: '400', letterSpacing: '0.02em', lineHeight: '1.4' }}>{user.email}</p>
                            </div>
                          </div>
                          <Icon
                            icon="mdi:chevron-down"
                            className={`flex-shrink-0 ml-2 transition-transform duration-300 ${isMobileAccountDropdownOpen ? 'rotate-180' : ''}`}
                            width="20"
                            height="20"
                          />
                        </button>
                        
                        {/* Mobile Account Dropdown */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isMobileAccountDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="space-y-0.5 sm:space-y-1 pt-2">
                            <Link
                              href="/account"
                              className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 group min-h-[44px]"
                              style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5', touchAction: 'manipulation' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileAccountDropdownOpen(false);
                              }}
                            >
                              <Icon icon="mdi:account-circle-outline" className="h-5 w-5 sm:h-5 sm:w-5 mr-3 flex-shrink-0 group-active:scale-110 transition-transform duration-200" />
                              <span className="flex-1">My Account</span>
                            </Link>
                            
                            <Link
                              href="/orders"
                              className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 group min-h-[44px]"
                              style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5', touchAction: 'manipulation' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileAccountDropdownOpen(false);
                              }}
                            >
                              <Icon icon="mdi:package-variant" className="h-5 w-5 sm:h-5 sm:w-5 mr-3 flex-shrink-0 group-active:scale-110 transition-transform duration-200" />
                              <span className="flex-1">My Orders</span>
                            </Link>
                            
                            <Link
                              href="/favorites"
                              className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 group min-h-[44px]"
                              style={{ fontFamily: 'Jost, sans-serif', fontWeight: '500', letterSpacing: '0.015em', lineHeight: '1.5', touchAction: 'manipulation' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileAccountDropdownOpen(false);
                              }}
                            >
                              <Icon icon="mdi:heart-outline" className="h-5 w-5 sm:h-5 sm:w-5 mr-3 flex-shrink-0 group-active:scale-110 transition-transform duration-200" />
                              <span className="flex-1">My Favorites</span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Logout Button - Outside Dropdown */}
                        <button
                          onClick={() => {
                            handleLogoutClick();
                            setIsMobileMenuOpen(false);
                            setIsMobileAccountDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-red-500 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200 group min-h-[44px] mt-2"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: '600', letterSpacing: '0.02em', lineHeight: '1.5', touchAction: 'manipulation' }}
                        >
                          <Icon icon="mdi:logout" className="h-5 w-5 sm:h-5 sm:w-5 mr-3 flex-shrink-0 group-active:scale-110 transition-transform duration-200" />
                          <span className="flex-1 text-left">Logout</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                      <button
                        onClick={() => {
                            router.push('/login');
                          setIsMobileMenuOpen(false);
                        }}
                          className="w-full px-5 py-3 md:py-3.5 text-sm md:text-base font-bold tracking-widest text-white bg-black hover:bg-gray-900 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                          LOGIN
                      </button>
                        <button
                          onClick={() => {
                            router.push('/signup');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-5 py-3 md:py-3.5 text-sm md:text-base font-bold tracking-widest text-black bg-white border border-gray-300 hover:border-black rounded-lg md:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/10"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          SIGN UP
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Desktop Navbar - Hidden on mobile with enhanced animations - NOT STICKY */}
        <nav className={`hidden lg:block bg-white px-4 lg:px-10 transition-all duration-300 border-t border-gray-100 ${
          scrolled ? 'py-3' : 'py-4'
        }`} style={{ fontFamily: 'Jost, sans-serif', position: 'relative', zIndex: 1 }}>
            <ul className="flex justify-center items-center text-sm font-semibold relative" style={{gap: '3rem'}}>
              {/* HOME NAVIGATION */}
              <li className="flex items-center h-full relative">
                {/* Vertical Divider */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-4 w-px bg-gray-200" />
                
                <a
                  href="#home"
                  className={`px-8 py-4 flex items-center gap-4 relative transition-all duration-500 group ${
                    isLinkActive('/') 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={(e) => {
                    createRipple(e);
                    handleHomeClick(e);
                  }}
                  onMouseEnter={() => setHoveredNav('home')}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    letterSpacing: '0.15em',
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className={`relative z-10 font-bold transition-all duration-500 ${
                    isLinkActive('/') 
                      ? 'text-black' 
                      : 'text-gray-600 group-hover:text-black'
                  }`} style={{ 
                    fontSize: '0.85rem', 
                    lineHeight: '1.2',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    HOME
                  </span>
                  
                  {/* Minimal Underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-700 ${
                    hoveredNav === 'home' || isLinkActive('/') ? 'w-full' : 'w-0'
                  }`}></span>
                </a>
              </li>
  
              {/* Products Navigation with Dropdown */}
              <li className="flex items-center h-full relative group" ref={productsDropdownRef}>
                {/* Vertical Divider */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-4 w-px bg-gray-200" />
                
                <div
                  className={`px-8 py-4 flex items-center gap-4 relative transition-all duration-500 cursor-pointer ${
                    isLinkActive('/product-list') 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={(e) => {
                    createRipple(e);
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  onMouseEnter={() => {
                    if (dropdownCloseTimer.current) {
                      clearTimeout(dropdownCloseTimer.current);
                      dropdownCloseTimer.current = null;
                    }
                    setHoveredNav('products');
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    dropdownCloseTimer.current = setTimeout(() => {
                      setHoveredNav(null);
                      setIsDropdownOpen(false);
                    }, 200);
                  }}
                  style={{
                    letterSpacing: '0.15em',
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className={`relative z-10 font-bold transition-all duration-500 ${
                    isLinkActive('/product-list') 
                      ? 'text-black' 
                      : 'text-gray-600 group-hover:text-black'
                  }`} style={{ 
                    fontSize: '0.85rem', 
                    lineHeight: '1.2',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    PRODUCTS
                  </span>
                  
                  {/* Minimal Underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-700 ${
                    hoveredNav === 'products' || isLinkActive('/product-list') ? 'w-full' : 'w-0'
                  }`}></span>
                </div>

                {/* Full Width Luxury Dropdown */}
                {isDropdownOpen && (
                  <div 
                    ref={productsDropdownContentRef}
                    className="fixed top-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 transition-all duration-500"
                    style={{ 
                      zIndex: 9999,
                      top: '200px',
                      opacity: isDropdownOpen ? 1 : 0,
                      transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-20px)'
                    }}
                    onMouseEnter={() => {
                      if (dropdownCloseTimer.current) {
                        clearTimeout(dropdownCloseTimer.current);
                        dropdownCloseTimer.current = null;
                      }
                      setIsDropdownOpen(true);
                      setHoveredNav('products');
                    }}
                    onMouseLeave={() => {
                      dropdownCloseTimer.current = setTimeout(() => {
                        setIsDropdownOpen(false);
                        setHoveredNav(null);
                      }, 200);
                    }}
                  >
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Featured Categories */}
                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider" style={{ 
                              fontFamily: 'Jost, sans-serif',
                              letterSpacing: '0.2em'
                            }}>
                              Categories
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/product-list"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              All Products
                            </Link>
                            <Link
                              href="/product-list?category=ceiling"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Ceiling Lights
                            </Link>
                            <Link
                              href="/product-list?category=chandelier"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Chandeliers
                            </Link>
                            <Link
                              href="/product-list?category=pendant"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Pendant Lights
                            </Link>
                          </div>
                        </div>

                        {/* Additional Categories */}
                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider" style={{ 
                              fontFamily: 'Jost, sans-serif',
                              letterSpacing: '0.2em'
                            }}>
                              Lighting Types
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/product-list?category=floor"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Floor Lamps
                            </Link>
                            <Link
                              href="/product-list?category=wall"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Wall Lights
                            </Link>
                            <Link
                              href="/product-list?category=table"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Table Lamps
                            </Link>
                            <Link
                              href="/product-list?category=outdoor"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Outdoor Lighting
                            </Link>
                          </div>
                        </div>

                        {/* Special Collections */}
                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider" style={{ 
                              fontFamily: 'Jost, sans-serif',
                              letterSpacing: '0.2em'
                            }}>
                              Collections
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/collection"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              New Arrivals
                            </Link>
                            <Link
                              href="/sales"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Special Offers
                            </Link>
                            <Link
                              href="/product-list?sort=featured"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Featured Items
                            </Link>
                            <Link
                              href="/product-list?sort=popular"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Popular Items
                            </Link>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider" style={{ 
                              fontFamily: 'Jost, sans-serif',
                              letterSpacing: '0.2em'
                            }}>
                              Services
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/static/consultation"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Design Consultation
                            </Link>
                            <Link
                              href="/static/installation"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Installation Services
                            </Link>
                            <Link
                              href="/static/support"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Customer Support
                            </Link>
                            <Link
                              href="/static/contact"
                              className="block py-3 text-sm text-gray-700 hover:text-black transition-all duration-300 font-medium border-l-2 border-transparent hover:border-black hover:pl-4"
                              style={{ 
                                fontFamily: 'Jost, sans-serif',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              
              {/* NEW NAVIGATION */}
              <li className="flex items-center h-full relative">
                {/* Vertical Divider */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-4 w-px bg-gray-200" />
                
                <Link 
                  href="/collection" 
                  className={`px-8 py-4 flex items-center gap-4 relative transition-all duration-500 group ${
                    isLinkActive('/collection') 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={(e) => createRipple(e)}
                  onMouseEnter={() => setHoveredNav('new')}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    letterSpacing: '0.15em',
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className={`relative z-10 font-bold transition-all duration-500 ${
                    isLinkActive('/collection') 
                      ? 'text-black' 
                      : 'text-gray-600 group-hover:text-black'
                  }`} style={{ 
                    fontSize: '0.85rem', 
                    lineHeight: '1.2',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    NEW
                  </span>
                  
                  {/* Minimal Underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-700 ${
                    hoveredNav === 'new' || isLinkActive('/collection') ? 'w-full' : 'w-0'
                  }`}></span>
                </Link>
              </li>
              
              {/* SALES NAVIGATION */}
              <li className="flex items-center h-full relative">
                {/* Vertical Divider */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-4 w-px bg-gray-200" />
                
                <Link 
                  href="/sales" 
                  className={`px-8 py-4 flex items-center gap-4 relative transition-all duration-500 group ${
                    isLinkActive('/sales') 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={(e) => createRipple(e)}
                  onMouseEnter={() => setHoveredNav('sales')}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    letterSpacing: '0.15em',
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className={`relative z-10 font-bold transition-all duration-500 ${
                    isLinkActive('/sales') 
                      ? 'text-black' 
                      : 'text-gray-600 group-hover:text-black'
                  }`} style={{ 
                    fontSize: '0.85rem', 
                    lineHeight: '1.2',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    SALES
                  </span>
                  
                  {/* Minimal Underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-700 ${
                    hoveredNav === 'sales' || isLinkActive('/sales') ? 'w-full' : 'w-0'
                  }`}></span>
                </Link>
              </li>
              
              {/* ABOUT US NAVIGATION */}
              <li className="flex items-center h-full relative">
                <Link 
                  href="/static/aboutus" 
                  className={`px-8 py-4 flex items-center gap-4 relative transition-all duration-500 group ${
                    isLinkActive('/static/aboutus') 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={(e) => createRipple(e)}
                  onMouseEnter={() => setHoveredNav('about')}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    letterSpacing: '0.15em',
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className={`relative z-10 font-bold transition-all duration-500 ${
                    isLinkActive('/static/aboutus') 
                      ? 'text-black' 
                      : 'text-gray-600 group-hover:text-black'
                  }`} style={{ 
                    fontSize: '0.85rem', 
                    lineHeight: '1.2',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    ABOUT US
                  </span>
                  
                  {/* Minimal Underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-700 ${
                    hoveredNav === 'about' || isLinkActive('/static/aboutus') ? 'w-full' : 'w-0'
                  }`}></span>
                </Link>
              </li>
            </ul>
          </nav>

        {/* Mobile Bottom Navigation Bar temporarily disabled */}

        {/* Login Modal */}
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)} 
        />

        {/* Add custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes menu-drop {
            from {
              opacity: 0;
              transform: translateX(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes menu-drop-out {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(-100%);
            }
          }

          @keyframes slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes ripple {
            from {
              width: 0;
              height: 0;
              opacity: 0.5;
            }
            to {
              width: 100px;
              height: 100px;
              opacity: 0;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-ripple {
            animation: ripple 0.6s ease-out;
          }

          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }

          .animate-slide-in-left {
            animation: slide-in-left 0.3s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.2s ease-out;
          }

          .menu-drop-in {
            animation: menu-drop 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #000000;
          }
        `}</style>
      </>
    );
  };
  
  export { Header };