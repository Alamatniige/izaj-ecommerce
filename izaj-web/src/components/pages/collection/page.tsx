"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import { InternalApiService } from '../../../services/internalApi';
import ProductList from '@/components/pages/collection/ProductList';
import SortModal from '@/components/pages/collection/SortModal';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/pages/collection/Sidebar';
const FilterDrawer = dynamic(() => import('@/components/pages/collection/FilterDrawer'), { ssr: false });
 

// Local product type for Collection page
type CollectionProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  mediaUrls?: string[];
  colors?: string[];
  isOnSale?: boolean;
  isNew?: boolean;
  category?: string;
  stock?: number;
};

// Price range type
interface PriceRange {
  min: number;
  max: number;
}

// Availability filter type - changed to array to match product-list
type AvailabilityFilter = string[];


interface CollectionProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const Collection: React.FC<CollectionProps> = ({ }) => {

  const [sortOption, setSortOption] = useState<string>('Alphabetical, A-Z');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProducts, setAllProducts] = useState<CollectionProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CollectionProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<CollectionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [isCarousel, setIsCarousel] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // New filter states
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const searchParams = useSearchParams();


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




  // Fetch products from internal API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const serviceProducts = await InternalApiService.getAllProducts();

        type ApiProduct = {
          product_name: string;
          description?: string;
          price: number | string;
          image_url?: string;
          media_urls?: string[];
          category?: string;
          status?: string;
          stock?: number;
          colors?: string[];
        };

        // Transform service products to collection products
        const transformedProducts: CollectionProduct[] = (serviceProducts as any[]).map((product, index) => {
          // Align ID generation with productService.transformToLegacyProduct
          // Prefer numeric product_id; fallback to numeric hash from UUID `id`
          let numericId = parseInt(product.product_id);
          if (isNaN(numericId)) {
            numericId = parseInt(String(product.id).replace(/[^0-9]/g, '').slice(0, 8)) || index + 1;
          }

          return {
            id: numericId,
            name: product.product_name,
            description: product.description || '',
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
            image: product.image_url || '',
            mediaUrls: product.media_urls || [],
            colors: product.colors || ["black"],
            isOnSale: false, // Default
            isNew: (
              product.product_name.toLowerCase().includes('new') ||
              product.category?.toLowerCase().includes('new') ||
              (product.description || '').toLowerCase().includes('new')
            ),
            category: product.category,
            stock: (() => {
              // First check if there's a numeric stock field
              if (typeof product.stock === 'number') {
                return product.stock;
              }
              
              // Fallback to status field
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
        
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize selectedCategory from URL query param (e.g., ?category=Chandelier)
  useEffect(() => {
    const categoryFromUrl = searchParams?.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Get maximum price from all products
  const getMaxPrice = useCallback(() => {
    if (allProducts.length === 0) return 282000; // fallback
    return Math.max(...allProducts.map(product => product.price));
  }, [allProducts]);

  // Update price range when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      const maxPrice = getMaxPrice();
      setMaxPrice(maxPrice);
      setPriceRange(prev => ({
        min: prev.min,
        max: maxPrice
      }));
    }
  }, [allProducts, getMaxPrice]);

  // Get categories with counts
  const getCategoriesWithCounts = () => {
    const categoryCounts: { [key: string]: number } = {};
    allProducts.forEach(product => {
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });
    return categoryCounts;
  };

  // Handle header category selection
  const handleHeaderCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  // Handle sort change
  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    setSortModalOpen(false);
  }, [setSortOption, setSortModalOpen]);

  // Apply sorting when sortOption changes
  useEffect(() => {
    handleSortChange(sortOption);
  }, [sortOption, handleSortChange]);

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Handle category selection
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

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by availability
    if (availabilityFilter.includes('in stock')) {
      filtered = filtered.filter(product => (product.stock || 0) > 0);
    }
    if (availabilityFilter.includes('out of stock')) {
      filtered = filtered.filter(product => (product.stock || 0) === 0);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by header category selection (takes priority)
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    } else if (selectedCategories.length > 0) {
      // Filter by sidebar categories if no header category selected
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }

    // Apply sorting
    switch(sortOption) {
      case 'Alphabetical, A-Z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical, Z-A':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price, Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price, High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Date, new to old':
        // For now, keep original order (can be enhanced with actual date data)
        break;
      case 'Date, old to new':
        // For now, keep original order (can be enhanced with actual date data)
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, availabilityFilter, priceRange, selectedCategory, selectedCategories, sortOption]);



  // Update displayed products - show all products since pagination is removed
  useEffect(() => {
    setDisplayedProducts(filteredProducts);
  }, [filteredProducts]);

  {/* Main Content */}
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="bg-white min-h-screen px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">Loading products...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
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

      {/* Header Section - Full Width (mobile responsive) */}
      <div className="mb-6 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-6 sm:mt-12 lg:mt-16" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
          Featured Collection
        </h1>
        
        {/* Horizontal line under title */}
        <div className="w-20 sm:w-24 h-0.5 bg-gray-800 mx-auto mb-5 sm:mb-8"></div>
        
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-700 text-sm sm:text-lg mb-4 sm:mb-8 leading-snug sm:leading-relaxed px-2 sm:px-0" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
            Welcome to IZAJ! Choose from a wide range of high quality decorative lighting products.
          </p>
          
          {/* Category Selection */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
              <span className="text-gray-700 font-semibold text-sm sm:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Choose By Categories:</span>
            </div>
            {/* Mobile: horizontal scroll list; Desktop: wrap */}
            <div className="sm:hidden -mx-4 px-4 overflow-x-auto pb-2">
              <div className="flex flex-nowrap gap-2">
                {Object.entries(getCategoriesWithCounts()).map(([category, count]) => (
                  <button
                    key={category}
                    onClick={() => handleHeaderCategorySelect(category)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md ${selectedCategory === category ? 'bg-black text-white border border-black' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {category} <span className="text-gray-500">({count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:flex flex-wrap justify-center gap-2">
              {Object.entries(getCategoriesWithCounts()).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => handleHeaderCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${selectedCategory === category ? 'bg-black text-white border border-black' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {category} <span className="text-gray-500">({count})</span>
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Bottom Controls: Show Filtering */}
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

      {/* Product Section with Sidebar */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          maxPrice={maxPrice}
        />

        {/* Product List */}
        <ProductList
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
        />
      </div>

        <SortModal
          isOpen={sortModalOpen}
          sortOption={sortOption}
          onClose={() => setSortModalOpen(false)}
          onSortChange={handleSortChange}
        />

        <FilterDrawer
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
        />
      </main>
    </div>
    );
};

export default Collection;


