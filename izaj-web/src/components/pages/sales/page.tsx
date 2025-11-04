"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { InternalApiService } from '../../../services/internalApi';
import SalesSidebar from './SalesSidebar';
import SalesProductList from './SalesProductList';
import SalesSortModal from './SalesSortModal';
const SalesFilterDrawer = dynamic(() => import('./SalesFilterDrawer'), { ssr: false });

type SalesProduct = {
  description: string;
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  originalPriceFormatted?: string;
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
  // Filter and sort states
  const [sortOption, setSortOption] = useState<string>('Alphabetical, A-Z');
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [maxPrice, setMaxPrice] = useState<number>(0);
  
  // View and UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [isCarousel, setIsCarousel] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchParams = useSearchParams();
  
  // Product data states
  const [allProducts, setAllProducts] = useState<SalesProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SalesProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for mobile view
  useEffect(() => {
    const checkDevice = () => {
      setIsCarousel(window.innerWidth <= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Sales: Starting to fetch all products...');
        
        // Fetch all products, new products, and sales products
        const [allProductsData, newProductsData, salesProductsData] = await Promise.all([
          InternalApiService.getAllProducts(),
          InternalApiService.getNewProducts(),
          InternalApiService.getSalesProducts()
        ]);
        
        console.log('📦 Sales: Received all products:', allProductsData);
        console.log('📦 Sales: New products:', newProductsData);
        console.log('📦 Sales: Sales products:', salesProductsData);
        console.log('📦 Sales: Total products count:', allProductsData?.length || 0);
        
        // Debug: Log first few products to see the data structure
        if (allProductsData && allProductsData.length > 0) {
          console.log('🔍 Sales: Raw product data sample:', allProductsData.slice(0, 3));
          console.log('🔍 Sales: Sample product stock/status fields:', allProductsData.slice(0, 3).map(p => ({
            id: p.product_id,
            name: p.product_name,
            stock: (p as any).stock,
            status: (p as any).status
          })));
        }
        
        // Filter to only show products that are on sale
        const saleProductIds = salesProductsData.map(saleProduct => saleProduct.product_id);
        const saleProductsOnly = allProductsData.filter(product => 
          saleProductIds.includes(product.product_id)
        );

        // Transform only sale products
        const transformedProducts = saleProductsOnly.map((product, index) => {
          const productId = parseInt(product.product_id) || 0;
          const price = parseFloat(product.price.toString());
          
          // Check if product is new (multiple criteria)
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          // Product is new if it exists in the newProductsData array
          const isNew = newProductsData.some(newProduct => 
            newProduct.product_id === product.product_id
          );
          
          // Product is on sale if it exists in the salesProductsData array
          const isOnSale = salesProductsData.some(saleProduct => 
            saleProduct.product_id === product.product_id
          );
          
          // Find the sale product data which contains sale information
          const saleProductData = salesProductsData.find(saleProduct => 
            saleProduct.product_id === product.product_id
          );
          
          // Debug logging for all products to check badge logic
          console.log(`🔍 Sales Product ${index}: ${product.product_name}`, {
            productId: product.product_id,
            name: product.product_name,
            category: product.category,
            isNew: isNew,
            isOnSale: isOnSale,
            saleData: saleProductData ? (saleProductData as any).sale : null,
            inNewProductsList: newProductsData.some(np => np.product_id === product.product_id),
            inSalesProductsList: salesProductsData.some(sp => sp.product_id === product.product_id),
            newProductsCount: newProductsData.length,
            salesProductsCount: salesProductsData.length
          });
          
          // Calculate sale price based on percentage or fixed_amount
          const originalPrice = price;
          const saleDetails = (saleProductData as any)?.sale?.[0]; // Get sale details from salesProductsData
          let finalPrice = originalPrice;
          let originalPriceFormatted: string | undefined = undefined;
          
          if (saleDetails && isOnSale) {
            if (saleDetails.percentage) {
              // Calculate discount based on percentage
              const discountAmount = (originalPrice * saleDetails.percentage) / 100;
              finalPrice = originalPrice - discountAmount;
            } else if (saleDetails.fixed_amount) {
              // Calculate discount based on fixed amount
              finalPrice = Math.max(0, originalPrice - saleDetails.fixed_amount);
            }
            originalPriceFormatted = `₱${originalPrice.toLocaleString()}`;
          }
          
          return {
            id: (parseInt(product.product_id) || 0) + index, // Ensures unique ID
            name: product.product_name,
            description: product.description || '',
            price: finalPrice,
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
            image: product.image_url || '', // Ensures image is string
            mediaUrls: product.media_urls || [],
            colors: (product as any).colors || ["black"], // Handles missing colors property
            isOnSale: isOnSale,
            isNew: isNew,
            category: product.category,
            stock: (() => {
              // First check if there's a numeric stock field
              if (typeof (product as any).stock === 'number') {
                return (product as any).stock;
              }
              
              // Fallback to status field
              const normalizedStatus = (product as any).status?.toLowerCase() || '';
              switch (normalizedStatus) {
                case 'in stock':
                  return 10; // High stock
                case 'low stock':
                case 'low-stock': // Added for robustness
                  return 3; // Low stock
                case 'out of stock':
                case 'out-of-stock': // Added for robustness
                  return 0; // Out of stock
                default:
                  return 10; // Default to in stock
              }
            })(),
            originalPrice: isOnSale && originalPriceFormatted ? originalPrice : undefined,
            originalPriceFormatted: originalPriceFormatted
          };
        });

        console.log('✅ Sales: Sale products only:', saleProductsOnly.length);
        console.log('✅ Sales: Transformed products:', transformedProducts);
        console.log('✅ Sales: Total products after transformation:', transformedProducts.length);
        console.log('✅ Sales: New products in final list:', transformedProducts.filter(p => p.isNew).length);
        console.log('✅ Sales: Sales products in final list:', transformedProducts.filter(p => p.isOnSale).length);
        console.log('✅ Sales: Both new and sales products:', transformedProducts.filter(p => p.isNew && p.isOnSale).length);

        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // Calculate max price for price range
        const maxProductPrice = Math.max(...transformedProducts.map(p => p.price));
        setMaxPrice(maxProductPrice);
        setPriceRange({ min: 0, max: maxProductPrice });
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Sales: Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize selectedCategory from URL query param (e.g., ?category=Chandelier)
  useEffect(() => {
    const categoryFromUrl = searchParams?.get('category');
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [searchParams]);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }

    // Filter by availability
    if (availabilityFilter.length > 0) {
      filtered = filtered.filter(product => {
        if (availabilityFilter.includes('in-stock') && (product.stock || 0) > 0) {
          return true;
        }
        if (availabilityFilter.includes('out-of-stock') && (product.stock || 0) === 0) {
          return true;
        }
        return false;
      });
    }

    // Filter by price range
    if (priceRange.min > 0 || priceRange.max < maxPrice) {
      filtered = filtered.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Sort products
    switch (sortOption) {
      case 'Alphabetically, A-Z':
      case 'Alphabetical, A-Z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetically, Z-A':
      case 'Alphabetical, Z-A':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price, low to high':
      case 'Price, Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price, high to low':
      case 'Price, High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Date, old to new':
      case 'Date, Old to New':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'Date, new to old':
      case 'Date, New to Old':
        // Since we don't have date info, sort by ID (newer products have higher IDs)
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, availabilityFilter, priceRange, sortOption, maxPrice, selectedCategories]);

  // Handle category selection for sidebar
  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Remove category if already selected
        return prev.filter(cat => cat !== category);
      } else {
        // Add category if not selected
        return [...prev, category];
      }
    });
  };

  const handleColorSelect = (productId: number, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setSortModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-12 text-center pt-2">
            <h1 className="block text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-6 sm:mt-12 lg:mt-16" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
            Exclusive Deals
            </h1>
            
            {/* Horizontal line under title */}
            <div className="w-20 sm:w-24 h-0.5 bg-gray-800 mx-auto mb-5 sm:mb-8"></div>
            
            <div className="max-w-5xl mx-auto">
              <p className="text-gray-700 text-sm sm:text-lg mb-4 sm:mb-8 leading-snug sm:leading-relaxed px-2 sm:px-0" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                Welcome to IZAJ! Choose from a wide range of high quality decorative lighting products.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-white min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 pb-24 sm:pb-16 md:pb-12">
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

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <SalesSidebar
          selectedCategories={selectedCategories}
          handleCategorySelect={handleCategorySelect}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          maxPrice={maxPrice}
          allProducts={allProducts}
        />

        {/* Product List */}
        <SalesProductList
          filteredProducts={filteredProducts}
          viewMode={viewMode}
          selectedColors={selectedColors}
          isCarousel={isCarousel}
          handleColorSelect={handleColorSelect}
          handleViewModeChange={handleViewModeChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
          setSortModalOpen={setSortModalOpen}
          setFilterDrawerOpen={setFilterDrawerOpen}
        />
      </div>
      </main>

      {/* Mobile Bottom Controls: Show Filters */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-4 pb-3 pt-0 bg-transparent">
        <button
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-black text-white text-sm font-semibold uppercase active:scale-[0.99] transition hover:bg-gray-800 shadow-lg pointer-events-auto"
          onClick={() => setFilterDrawerOpen(true)}
          aria-label="Show Filters"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          SHOW FILTERS
        </button>
      </div>

      {/* Mobile Modals */}
      <SalesSortModal
        isOpen={sortModalOpen}
        onClose={() => setSortModalOpen(false)}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      <SalesFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sidebarDropdownOpen={true}
        setSidebarDropdownOpen={() => {}}
        architecturalDropdownOpen={false}
        setArchitecturalDropdownOpen={() => {}}
        mirrorsDropdownOpen={false}
        setMirrorsDropdownOpen={() => {}}
        fansDropdownOpen={false}
        setFansDropdownOpen={() => {}}
        selectCategoryOpen={true}
        setSelectCategoryOpen={() => {}}
        selectedCategories={selectedCategories}
        handleCategorySelect={handleCategorySelect}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortOption={sortOption}
        setSortOption={setSortOption}
        maxPrice={maxPrice}
        allProducts={allProducts}
      />
    </div>
    );
};

export default Sales;