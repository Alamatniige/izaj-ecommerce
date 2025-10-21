"use client";

import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import SalesSidebar from './SalesSidebar';
import SalesProductList from './SalesProductList';
import SalesFeaturedProducts from './SalesFeaturedProducts';
import ProductSuggestions from '@/components/common/ProductSuggestions';
import SalesSortModal from './SalesSortModal';
import SalesFilterDrawer from './SalesFilterDrawer';
import { getAllProducts } from '../../../services/productService';
import { InternalApiService } from '../../../services/internalApi';
 

type SalesProduct = {
  description: string;
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  mediaUrls?: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  size?: string;
  colors?: string[];
  category?: string;
  stock?: number;
};

interface SalesProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const Sales: React.FC<SalesProps> = ({ user: _user }) => {

  const [sortOption, setSortOption] = useState<string>('Alphabetical, A-Z');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProducts, setAllProducts] = useState<SalesProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SalesProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<SalesProduct[]>([]);
  const [currentMainPage, setCurrentMainPage] = useState(1);
  const [productsPerMainPage] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(true);
  const [architecturalDropdownOpen, setArchitecturalDropdownOpen] = useState(false);
  const [mirrorsDropdownOpen, setMirrorsDropdownOpen] = useState(false);
  const [fansDropdownOpen, setFansDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [, setDeals] = useState<{ id: number; title: string; oldPrice: string; newPrice: string; discount: string; image: string }[]>([]);
  
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [isCarousel, setIsCarousel] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(true);


  const handleColorSelect = (productId: number, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  // Check for mobile view
  useEffect(() => {
    const checkDevice = () => {
      setIsCarousel(window.innerWidth <= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);



  // Sample deals data
  useEffect(() => {
    const sampleDeals = [
      {
        id: 1,
        image: "/ceiling.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 2,
        image: "/chadelier.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 3,
        image: "/cluster.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 4,
        image: "/pendant.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 5,
        image: "/floor.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 6,
        image: "/floor.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 7,
        image: "/floor.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
      {
        id: 8,
        image: "/floor.jpg",
        title: "Aberdeen | Modern LED Chandelier",
        oldPrice: "₱16,995",
        newPrice: "₱15,995",
        discount: "10% off"
      },
    ];
    
    setDeals(sampleDeals);
  }, []);

  // Fetch sales products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Sales: Starting to fetch sales products...');
        const salesProductsData = await InternalApiService.getSalesProducts();
        console.log('📦 Sales: Received sales products:', salesProductsData);
        
        // Transform products to SalesProduct format
        const salesProducts: SalesProduct[] = salesProductsData.map((product, index) => {
          // Convert price from number to number
          const price = parseFloat(product.price.toString());
          
          // Get discount information from sale data
          const saleData = product.sale?.[0];
          const discountPercent = saleData?.percentage || 0;
          const fixedDiscount = saleData?.fixed_amount || 0;
          
          // Calculate original price based on discount type
          let originalPrice = price;
          if (discountPercent > 0) {
            originalPrice = Math.round(price / (1 - discountPercent / 100));
          } else if (fixedDiscount > 0) {
            originalPrice = price + fixedDiscount;
          }
          
          return {
            id: parseInt(product.product_id) || 0,
            name: product.product_name,
            description: product.description || `High-quality ${product.product_name.toLowerCase()} perfect for any space.`,
            price: originalPrice - (discountPercent > 0 ? (originalPrice * discountPercent / 100) : fixedDiscount),
            originalPrice: originalPrice,
            rating: 4 + (index % 2), // 4 or 5 stars
            reviewCount: 10 + (index % 20), // 10-29 reviews
            image: product.media_urls?.[0] || "/placeholder.jpg",
            mediaUrls: product.media_urls || [],
            colors: ["black"], // Default color
            isOnSale: true,
            isNew: false, // These are sales products, not new
            category: product.category,
            stock: (() => {
              const normalizedStatus = product.status?.toLowerCase() || '';
              switch (normalizedStatus) {
                case 'in stock':
                  return 10; // High stock
                case 'low stock':
                  return 3; // Low stock
                case 'out of stock':
                  return 0; // Out of stock
                default:
                  return 10; // Default to in stock
              }
            })()
          };
        });
        
        console.log('✅ Sales: Transformed products:', salesProducts);
        setAllProducts(salesProducts);
        setFilteredProducts(salesProducts);
      } catch (error) {
        console.error('❌ Sales: Error fetching sales products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to determine category from product name
  const getCategoryFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('chandelier')) return 'Chandelier';
    if (nameLower.includes('pendant')) return 'Pendant Lights';
    if (nameLower.includes('table') || nameLower.includes('lamp')) return 'Table Lamps';
    if (nameLower.includes('floor')) return 'Floor Lamps';
    if (nameLower.includes('wall')) return 'Wall Lamps';
    if (nameLower.includes('ceiling')) return 'Ceiling Lights';
    if (nameLower.includes('recessed') || nameLower.includes('downlight')) return 'Recessed Lights';
    if (nameLower.includes('track')) return 'Track Lighting';
    if (nameLower.includes('outdoor') || nameLower.includes('garden')) return 'Outdoor Lighting';
    if (nameLower.includes('bulb')) return 'Bulbs';
    if (nameLower.includes('led') && nameLower.includes('strip')) return 'LED Strips';
    if (nameLower.includes('spotlight')) return 'Spotlights';
    if (nameLower.includes('smart')) return 'Smart Lighting';
    if (nameLower.includes('emergency')) return 'Emergency Lighting';
    if (nameLower.includes('lantern')) return 'Lanterns';
    return 'Lighting';
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Filter products based on selected categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        selectedCategories.includes(product.category || '')
      );
      setFilteredProducts(filtered);
    }
    setCurrentMainPage(1); // Reset to first page when filtering
  }, [selectedCategories, allProducts]);

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setSortModalOpen(false);
    let sortedProducts = [...filteredProducts];
    switch(option) {
      case 'Alphabetical, A-Z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical, Z-A':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price, Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price, High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
    setCurrentMainPage(1); // Reset to first page when sorting
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Update displayed products for pagination
  useEffect(() => {
    const startIndex = (currentMainPage - 1) * productsPerMainPage;
    const endIndex = startIndex + productsPerMainPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentMainPage, productsPerMainPage]);

  // Calculate total pages for main product list
  const totalMainPages = Math.ceil(filteredProducts.length / productsPerMainPage);

  // Handle main page change
  const handleMainPageChange = (page: number) => {
    setCurrentMainPage(page);
  };

  // Show loading state while fetching products
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <style>
        {`
          @media (max-width: 767px) {
            .mobile-hide { display: none !important; }
            .mobile-center-main { margin-left: auto !important; margin-right: auto !important; float: none !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
          }
          @keyframes slideInLeft {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideInRight {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .slide-container {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease; }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
        `}
      </style>

      <div className="max-w-[94%] mx-auto px-5 sm:px-8">
      {/* Breadcrumb - hidden on screens below lg (1024px) */}
      <div className="hidden lg:block text-xs sm:text-sm text-black mb-4 sm:mb-6 pt-4 sm:pt-6">
        <a href="/" className="hover:underline">Home</a>
        <Icon icon="mdi:chevron-right" width="16" height="16" className="mx-1 inline-block align-middle" />
        <span>Sales</span>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <SalesSidebar
          sidebarDropdownOpen={sidebarDropdownOpen}
          setSidebarDropdownOpen={setSidebarDropdownOpen}
          architecturalDropdownOpen={architecturalDropdownOpen}
          setArchitecturalDropdownOpen={setArchitecturalDropdownOpen}
          mirrorsDropdownOpen={mirrorsDropdownOpen}
          setMirrorsDropdownOpen={setMirrorsDropdownOpen}
          fansDropdownOpen={fansDropdownOpen}
          setFansDropdownOpen={setFansDropdownOpen}
          selectedCategories={selectedCategories}
          handleCategorySelect={handleCategorySelect}
        />

        {/* Product List */}
        <SalesProductList
          filteredProducts={displayedProducts}
          viewMode={viewMode}
          selectedColors={selectedColors}
          isCarousel={isCarousel}
          handleColorSelect={handleColorSelect}
          handleViewModeChange={handleViewModeChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
          setSortModalOpen={setSortModalOpen}
          setFilterDrawerOpen={setFilterDrawerOpen}
          currentPage={currentMainPage}
          totalPages={totalMainPages}
          handlePageChange={handleMainPageChange}
        />
      </div>
      </div>

      {/* Featured Products Section */}
      <SalesFeaturedProducts />

      {/* Product Suggestions */}
      <ProductSuggestions 
        title="You May Also Like"
        maxProducts={5}
        excludeIds={displayedProducts.map(p => p.id)}
      />

      <SalesSortModal
        isOpen={sortModalOpen}
        sortOption={sortOption}
        onClose={() => setSortModalOpen(false)}
        onSortChange={handleSortChange}
      />

      <SalesFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sidebarDropdownOpen={sidebarDropdownOpen}
        setSidebarDropdownOpen={setSidebarDropdownOpen}
        architecturalDropdownOpen={architecturalDropdownOpen}
        setArchitecturalDropdownOpen={setArchitecturalDropdownOpen}
        mirrorsDropdownOpen={mirrorsDropdownOpen}
        setMirrorsDropdownOpen={setMirrorsDropdownOpen}
        fansDropdownOpen={fansDropdownOpen}
        setFansDropdownOpen={setFansDropdownOpen}
        selectCategoryOpen={selectCategoryOpen}
        setSelectCategoryOpen={setSelectCategoryOpen}
        selectedCategories={selectedCategories}
        handleCategorySelect={handleCategorySelect}
      />
    </div>
    );
};

export default Sales;