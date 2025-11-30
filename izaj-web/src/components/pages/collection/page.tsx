"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getAllProducts } from '../../../services/productService';
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
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();


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




  // Fetch products and exclude those on sale
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Collection: Starting to fetch products (excluding sale items)...');
        
        // Fetch all products using productService which includes isOnSale flag
        const products = await getAllProducts();
        console.log('📦 Collection: Fetched products:', products?.length || 0);
        
        // Filter out products that are on sale
        const productsNotOnSale = products.filter(product => {
          const isOnSale = product.isOnSale === true;
          if (isOnSale) {
            console.log(`🚫 Collection: Excluding product on sale: ${product.name}`);
          }
          return !isOnSale; // Only include if NOT on sale
        });
        
        console.log('📦 Collection: Products NOT on sale:', productsNotOnSale.length);

        // Transform products to collection format
        const transformedProducts: CollectionProduct[] = productsNotOnSale.map((product) => {
          // Parse price from formatted string (e.g., "₱1,234" -> 1234)
          const priceString = product.price.replace(/[₱,]/g, '');
          const price = parseFloat(priceString) || 0;

          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: price,
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
            image: product.image || '',
            mediaUrls: product.mediaUrls || [],
            colors: product.colors || ["black"],
            isOnSale: false, // Already filtered out, so always false
            isNew: false, // Will be determined separately if needed
            category: product.category,
            stock: product.stock || 0
          };
        });
        
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('❌ Collection: Error fetching products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize selectedCategories from URL query param (e.g., ?category=Chandelier or multiple categories)
  useEffect(() => {
    const categoriesFromUrl = searchParams?.getAll('category');
    if (categoriesFromUrl && categoriesFromUrl.length > 0) {
      const decodedCategories = categoriesFromUrl.map(cat => decodeURIComponent(cat));
      setSelectedCategories(decodedCategories);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  // Get maximum price from all products
  const getMaxPrice = useCallback(() => {
    if (allProducts.length === 0) return 282000; // fallback
    return Math.ceil(Math.max(...allProducts.map(product => product.price)));
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
    const updatedCategories = (() => {
      if (selectedCategories.includes(category)) {
        // Remove category if already selected
        return selectedCategories.filter(cat => cat !== category);
      } else {
        // Add category if not selected
        return [...selectedCategories, category];
      }
    })();
    
    setSelectedCategories(updatedCategories);
    
    // Update URL with selected categories
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing category parameters
    const allCategories = params.getAll('category');
    allCategories.forEach(() => {
      params.delete('category');
    });
    
    // Add multiple category parameters if there are any selected
    if (updatedCategories.length > 0) {
      updatedCategories.forEach(cat => {
        params.append('category', encodeURIComponent(cat));
      });
    }
    
    // Update URL
    const newUrl = updatedCategories.length > 0 
      ? `${pathname}?${params.toString()}` 
      : pathname;
    router.push(newUrl);
  };

  // Clear all category filters
  const clearAllCategories = () => {
    setSelectedCategories([]);
    
    // Update URL to remove category parameters
    const params = new URLSearchParams(searchParams?.toString() || '');
    // Remove all category parameters
    const allCategories = params.getAll('category');
    allCategories.forEach(() => {
      params.delete('category');
    });
    
    // Update URL
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
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

    // Filter by selected categories
    if (selectedCategories.length > 0) {
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
  }, [allProducts, availabilityFilter, priceRange, selectedCategories, sortOption]);



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
          selectedCategories={selectedCategories}
          handleCategorySelect={handleCategorySelect}
          clearAllCategories={clearAllCategories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          maxPrice={maxPrice}
          allProducts={allProducts}
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
          clearAllCategories={clearAllCategories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          maxPrice={maxPrice}
          allProducts={allProducts}
        />
      </main>
    </div>
    );
};

export default Collection;


