"use client";

import React, { useState, useEffect, useCallback } from "react";
import { InternalApiService } from '../../../services/internalApi';
import ProductListSidebar from './ProductListSidebar';
import ProductListMain from './ProductListMain';
import ProductListSortModal from './ProductListSortModal';
import ProductListFilterDrawer from './ProductListFilterDrawer';

type Product = {
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

interface ProductListProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const ProductList: React.FC<ProductListProps> = ({ user }) => {

  const [sortOption, setSortOption] = useState<string>('Alphabetical, A-Z');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(true);
  const [architecturalDropdownOpen, setArchitecturalDropdownOpen] = useState(false);
  const [mirrorsDropdownOpen, setMirrorsDropdownOpen] = useState(false);
  const [fansDropdownOpen, setFansDropdownOpen] = useState(false);
  // Removed unused state
  const [, setDeals] = useState<{ id: number; title: string; oldPrice: string; newPrice: string; discount: string; image: string }[]>([]);
  
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [isCarousel, setIsCarousel] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // New filter states for sidebar
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>('');



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
    ];
    
    setDeals(sampleDeals);
  }, []);

  // Fetch products from internal API (all products)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 ProductList: Starting to fetch all products...');
        
        // Fetch all products, new products, and sales products
        const [allProductsData, newProductsData, salesProductsData] = await Promise.all([
          InternalApiService.getAllProducts(),
          InternalApiService.getNewProducts(),
          InternalApiService.getSalesProducts()
        ]);
        
        console.log('📦 ProductList: Received all products:', allProductsData);
        console.log('📦 ProductList: New products:', newProductsData);
        console.log('📦 ProductList: Sales products:', salesProductsData);
        console.log('📦 ProductList: Total products count:', allProductsData?.length || 0);
        
        // Debug: Log first few products to see the data structure
        if (allProductsData && allProductsData.length > 0) {
          console.log('🔍 ProductList: Raw product data sample:', allProductsData.slice(0, 3));
          console.log('🔍 ProductList: Sample product stock/status fields:', allProductsData.slice(0, 3).map(p => ({
            id: p.product_id,
            name: p.product_name,
            stock: (p as unknown as { stock?: number }).stock,
            status: (p as unknown as { status?: string }).status
          })));
        }
        
        // Transform all products and categorize them
        type ApiProduct = {
          product_id: string;
          product_name: string;
          price: number | string;
          category?: string;
          description?: string;
          media_urls?: string[];
          status?: string;
          stock?: number;
        };

        const transformedProducts = (allProductsData as ApiProduct[]).map((product, index) => {
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
          
          // Use real data only
          
          // Product is on sale if it exists in the salesProductsData array
          const isOnSale = salesProductsData.some(saleProduct => 
            saleProduct.product_id === product.product_id
          );
          
          // Debug logging for all products to check badge logic
          console.log(`🔍 Product ${index}: ${product.product_name}`, {
            productId: product.product_id,
            name: product.product_name,
            category: product.category,
            isNew: isNew,
            isOnSale: isOnSale,
            inNewProductsList: newProductsData.some(np => np.product_id === product.product_id),
            inSalesProductsList: salesProductsData.some(sp => sp.product_id === product.product_id),
            newProductsCount: newProductsData.length,
            salesProductsCount: salesProductsData.length
          });
          let finalPrice = price;
          let originalPrice = price;
          
          // Sale logic removed until sale property is available
          // if (isOnSale) {
          //   // Sale calculation logic will be added when sale property is available
          // }
          
          return {
              id: productId,
              name: product.product_name,
              description: product.description || '',
            price: finalPrice,
            originalPrice: isOnSale ? originalPrice : undefined,
              rating: 4.5, // Default rating
              reviewCount: 0, // Default review count
              image: product.media_urls?.[0] || "/placeholder.jpg",
              mediaUrls: product.media_urls || [],
              colors: ["black"], // Default color
            isOnSale: isOnSale,
            isNew: isNew,
              category: product.category || getCategoryFromName(product.product_name),
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
        
        console.log('✅ ProductList: Transformed products:', transformedProducts);
        console.log('✅ ProductList: Total products after transformation:', transformedProducts.length);
        console.log('✅ ProductList: New products in final list:', transformedProducts.filter(p => p.isNew).length);
        console.log('✅ ProductList: Sales products in final list:', transformedProducts.filter(p => p.isOnSale).length);
        console.log('✅ ProductList: Both new and sales products:', transformedProducts.filter(p => p.isNew && p.isOnSale).length);
        
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('❌ ProductList: Error fetching products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    setSortModalOpen(false);
    let sortedProducts = [...filteredProducts];
    switch(option) {
      case 'Best selling':
        // Sort by rating and review count (best selling approximation)
        sortedProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
      case 'Alphabetically, A-Z':
      case 'Alphabetical, A-Z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetically, Z-A':
      case 'Alphabetical, Z-A':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price, low to high':
      case 'Price, Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price, high to low':
      case 'Price, High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'Date, old to new':
        // Sort by ID (assuming higher ID = newer)
        sortedProducts.sort((a, b) => a.id - b.id);
        break;
      case 'Date, new to old':
        // Sort by ID (assuming higher ID = newer)
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  }, [filteredProducts]);

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Get unique categories with counts
  const getCategoriesWithCounts = () => {
    const categoryCounts: { [key: string]: number } = {};
    allProducts.forEach(product => {
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });
    return categoryCounts;
  };

  // Get maximum price from all products
  const getMaxPrice = useCallback(() => {
    if (allProducts.length === 0) return 282000; // fallback
    return Math.max(...allProducts.map(product => product.price));
  }, [allProducts]);

  // Update price range when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      const maxPrice = getMaxPrice();
      setPriceRange(prev => ({
        min: prev.min,
        max: maxPrice
      }));
    }
  }, [allProducts, getMaxPrice]);

  // Handle category selection for header
  const handleHeaderCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(''); // Deselect if same category
    } else {
      setSelectedCategory(category); // Select new category
    }
  };

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

  // Filter products based on selected categories, availability, and price
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by header category selection (takes priority)
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    } else if (selectedCategories.length > 0) {
      // Filter by sidebar categories if no header category selected
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }

    // Filter by availability
    if (availabilityFilter.length > 0) {
      filtered = filtered.filter(product => {
        const stock = product.stock || 0;
        const isInStock = stock > 0;
        const isOutOfStock = stock === 0;
        
        if (availabilityFilter.includes('in stock') && isInStock) return true;
        if (availabilityFilter.includes('out of stock') && isOutOfStock) return true;
        return false;
      });
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

      setFilteredProducts(filtered);
  }, [selectedCategory, selectedCategories, availabilityFilter, priceRange, allProducts]);

  // Apply sorting when sort option changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      handleSortChange(sortOption);
    }
  }, [sortOption, filteredProducts]);

  // Helper function to determine category from product name
  const getCategoryFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('chandelier')) return 'Chandelier';
    if (nameLower.includes('pendant')) return 'Pendant Light';
    if (nameLower.includes('table') || nameLower.includes('lamp')) return 'Table Lamp';
    if (nameLower.includes('floor')) return 'Floor Lamp';
    if (nameLower.includes('wall')) return 'Wall Lamp';
    if (nameLower.includes('ceiling')) return 'Ceiling Light';
    if (nameLower.includes('recessed') || nameLower.includes('downlight')) return 'Recessed Lighting';
    if (nameLower.includes('track')) return 'Track Lighting';
    if (nameLower.includes('outdoor') || nameLower.includes('garden')) return 'Outdoor Lighting';
    if (nameLower.includes('bulb')) return 'Bulb';
    if (nameLower.includes('led') && nameLower.includes('strip')) return 'LED Strip';
    if (nameLower.includes('spotlight')) return 'Spotlight';
    if (nameLower.includes('smart')) return 'Smart Lighting';
    if (nameLower.includes('emergency')) return 'Emergency Light';
    if (nameLower.includes('lantern')) return 'Lantern';
    return 'Lighting';
  };

  // Update displayed products - show all products since pagination is removed
  useEffect(() => {
    setDisplayedProducts(filteredProducts);
  }, [filteredProducts]);


  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
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
      <main className="bg-white min-h-screen px-4 sm:px-8 md:px-16 lg:px-24">
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

      {/* Header Section - Full Width */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-8 sm:mt-12 lg:mt-16" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
          All Products
        </h1>
        
        {/* Horizontal line under title */}
        <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
        
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-700 text-base sm:text-lg mb-8 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
            Welcome to IZAJ! Choose from a wide range of high quality decorative lighting products.
          </p>
          
          {/* Category Selection */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 mb-4">

              <span className="text-gray-700 font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Choose By Categories:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(getCategoriesWithCounts()).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => handleHeaderCategorySelect(category)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {category} <span className="text-gray-500">({count})</span>
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Product Section with Sidebar */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <ProductListSidebar
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
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          maxPrice={getMaxPrice()}
        />

        {/* Product List */}
        <ProductListMain
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


      <ProductListSortModal
        isOpen={sortModalOpen}
        sortOption={sortOption}
        onClose={() => setSortModalOpen(false)}
        onSortChange={handleSortChange}
      />

      <ProductListFilterDrawer
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
      </main>
    </div>
    );
};

export default ProductList;


