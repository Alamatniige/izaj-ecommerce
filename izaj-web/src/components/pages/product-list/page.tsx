"use client";

import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { getAllProducts } from '../../../services/productService';
import { InternalApiService } from '../../../services/internalApi';
import ProductListSidebar from './ProductListSidebar';
import ProductListMain from './ProductListMain';
import ProductListFeatured from './ProductListFeatured';
import ProductSuggestions from '@/components/common/ProductSuggestions';
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
  const [currentMainPage, setCurrentMainPage] = useState(1);
  const [productsPerMainPage] = useState(12);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(true);
  const [architecturalDropdownOpen, setArchitecturalDropdownOpen] = useState(false);
  const [mirrorsDropdownOpen, setMirrorsDropdownOpen] = useState(false);
  const [fansDropdownOpen, setFansDropdownOpen] = useState(false);
  const [] = useState(0);
  const [, setDeals] = useState<{ id: number; title: string; oldPrice: string; newPrice: string; discount: string; image: string }[]>([]);
  
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [isCarousel, setIsCarousel] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);



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
        
        // Fetch all products
        const allProductsData = await InternalApiService.getAllProducts();
        
        console.log('📦 ProductList: Received all products:', allProductsData);
        console.log('📦 ProductList: Total products count:', allProductsData?.length || 0);
        
        // Transform all products and categorize them
        const transformedProducts = allProductsData.map(product => {
          const productId = parseInt(product.product_id) || 0;
          const price = parseFloat(product.price.toString());
          
          // Check if product is new (multiple criteria)
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          // Product is new if:
          // 1. Published within last 90 days, OR
          // 2. Has "new" in the name, OR  
          // 3. Has "new" in the category, OR
          // 4. Published within last year (as fallback)
          const isNew = (
            new Date(product.inserted_at) >= ninetyDaysAgo ||
            product.product_name.toLowerCase().includes('new') ||
            product.category?.toLowerCase().includes('new') ||
            new Date(product.inserted_at) >= oneYearAgo
          );
          
          // Use real data only
          
          // Check if product is on sale - be more lenient for testing
          const isOnSale = product.on_sale === true || (product.sale && product.sale.length > 0);
          
          // Debug logging for products with badges
          if (isOnSale || isNew) {
            console.log(`🏷️ Product ${product.product_name}:`, {
              isNew: isNew,
              isOnSale: isOnSale,
              reason_new: isNew ? 'Has NEW criteria' : 'No NEW criteria',
              reason_sale: isOnSale ? 'Has SALE criteria' : 'No SALE criteria'
            });
          }
          let finalPrice = price;
          let originalPrice = price;
          
          if (isOnSale) {
            const saleData = product.sale[0];
          const discountPercent = saleData?.percentage || 0;
          const fixedDiscount = saleData?.fixed_amount || 0;
          
          // Calculate original price based on discount type
          if (discountPercent > 0) {
            originalPrice = Math.round(price / (1 - discountPercent / 100));
          } else if (fixedDiscount > 0) {
            originalPrice = price + fixedDiscount;
          }
          
            finalPrice = originalPrice - (discountPercent > 0 ? (originalPrice * discountPercent / 100) : fixedDiscount);
          }
          
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
    setCurrentMainPage(1); // Reset to first page when sorting changes
  };

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

  // Filter products based on selected categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      // If no categories selected, show all products
      setFilteredProducts(allProducts);
    } else {
      // Filter products by selected categories
      const filtered = allProducts.filter(product => 
        selectedCategories.includes(product.category)
      );
      setFilteredProducts(filtered);
    }
    setCurrentMainPage(1); // Reset to first page when filtering changes
  }, [selectedCategories, allProducts]);

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

  // Update displayed products based on current page
  useEffect(() => {
    const startIndex = (currentMainPage - 1) * productsPerMainPage;
    const endIndex = startIndex + productsPerMainPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentMainPage, productsPerMainPage]);

  // Calculate total pages
  const totalMainPages = Math.ceil(filteredProducts.length / productsPerMainPage);

  // Handle page change
  const handleMainPageChange = (page: number) => {
    setCurrentMainPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Breadcrumb - hidden on screens below lg (1024px) */}
      <div className="hidden lg:block text-xs sm:text-sm text-black mb-4 sm:mb-6 pt-4 sm:pt-6">
        <a href="/" className="hover:underline">Home</a>
        <Icon icon="mdi:chevron-right" width="16" height="16" className="mx-1 inline-block align-middle" />
        <span>Product List</span>
      </div>
      
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
          currentPage={currentMainPage}
          totalPages={totalMainPages}
          handlePageChange={handleMainPageChange}
        />
      </div>

      {/* Featured Products Section */}
      <ProductListFeatured />

      {/* Product Suggestions */}
      <ProductSuggestions 
        title="You May Also Like"
        maxProducts={5}
        excludeIds={displayedProducts.map(p => p.id)}
      />

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


