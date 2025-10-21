"use client";

import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { InternalApiService } from '../../../services/internalApi';

interface ProductListSidebarProps {
  sidebarDropdownOpen: boolean;
  setSidebarDropdownOpen: (open: boolean) => void;
  architecturalDropdownOpen: boolean;
  setArchitecturalDropdownOpen: (open: boolean) => void;
  mirrorsDropdownOpen: boolean;
  setMirrorsDropdownOpen: (open: boolean) => void;
  fansDropdownOpen: boolean;
  setFansDropdownOpen: (open: boolean) => void;
  selectedCategories: string[];
  handleCategorySelect: (category: string) => void;
  // New filter props
  availabilityFilter: string[];
  setAvailabilityFilter: (filter: string[]) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  maxPrice: number;
}

const ProductListSidebar: React.FC<ProductListSidebarProps> = ({
  sidebarDropdownOpen,
  setSidebarDropdownOpen,
  architecturalDropdownOpen,
  setArchitecturalDropdownOpen,
  mirrorsDropdownOpen,
  setMirrorsDropdownOpen,
  fansDropdownOpen,
  setFansDropdownOpen,
  selectedCategories,
  handleCategorySelect,
  availabilityFilter,
  setAvailabilityFilter,
  priceRange,
  setPriceRange,
  sortOption,
  setSortOption,
  maxPrice,
}) => {
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔄 ProductListSidebar: Fetching categories...');
        const categoriesData = await InternalApiService.getCategoriesWithCounts();
        console.log('📂 ProductListSidebar: Received categories:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('❌ ProductListSidebar: Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Group categories into sections
  const lightingFixtures = categories.filter(cat => 
    ['Ceiling Light', 'Chandelier', 'Pendant Light', 'Floor Lamp', 'Table Lamp', 'Wall Lamp'].includes(cat.category)
  );
  
  const architecturalLights = categories.filter(cat => 
    ['Track Lighting', 'Recessed Lighting', 'Spotlight', 'LED Strip'].includes(cat.category)
  );
  
  const outdoorLights = categories.filter(cat => 
    ['Outdoor Lighting', 'Lantern'].includes(cat.category)
  );
  
  const smartLights = categories.filter(cat => 
    ['Smart Lighting'].includes(cat.category)
  );
  
  const bulbs = categories.filter(cat => 
    ['Bulb'].includes(cat.category)
  );
  
  const emergencyLights = categories.filter(cat => 
    ['Emergency Light'].includes(cat.category)
  );
  
  // Minimalist sidebar UI states (for the screenshot-style design)
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);
  const [inStockCount, setInStockCount] = useState<number>(0);
  const [outOfStockCount, setOutOfStockCount] = useState<number>(0);

  // Handle availability filter changes
  const handleAvailabilityChange = (availability: string) => {
    if (availabilityFilter.includes(availability)) {
      setAvailabilityFilter(availabilityFilter.filter(item => item !== availability));
    } else {
      setAvailabilityFilter([...availabilityFilter, availability]);
    }
  };

  // Handle price range changes
  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    setPriceRange({
      ...priceRange,
      [field]: value
    });
  };

  // Handle slider changes
  const handleSliderChange = (field: 'min' | 'max', value: number) => {
    const newRange = {
      ...priceRange,
      [field]: value
    };
    
    // Ensure min doesn't exceed max and vice versa
    if (field === 'min' && value > priceRange.max) {
      newRange.max = value;
    } else if (field === 'max' && value < priceRange.min) {
      newRange.min = value;
    }
    
    setPriceRange(newRange);
  };

  // Handle input changes with validation
  const handleInputChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(maxPrice, numValue));
    handlePriceChange(field, clampedValue);
  };

  // Calculate slider positions (0-100%)
  const minSliderPosition = maxPrice > 0 ? ((priceRange.min - 0) / (maxPrice - 0)) * 100 : 0;
  const maxSliderPosition = maxPrice > 0 ? ((priceRange.max - 0) / (maxPrice - 0)) * 100 : 100;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const all = await InternalApiService.getAllProducts();
        let inStock = 0;
        let outStock = 0;
        (all || []).forEach((p: any) => {
          // Check both status field and stock field
          const status = (p.status || '').toLowerCase();
          const stock = p.stock || 0;
          
          // If status field exists, use it
          if (status) {
            if (status === 'out of stock') {
              outStock += 1;
            } else {
              inStock += 1;
            }
          } else {
            // Fallback to stock number
            if (stock > 0) {
              inStock += 1;
            } else {
              outStock += 1;
            }
          }
        });
        setInStockCount(inStock);
        setOutOfStockCount(outStock);
      } catch {
        setInStockCount(0);
        setOutOfStockCount(0);
      }
    };
    fetchCounts();
  }, []);
  return (
    <aside className="hidden lg:block w-full lg:w-1/6 p-0 sm:p-4 lg:p-6 lg:pl-0 lg:pr-4 mobile-hide sticky top-4 self-start">
      {/* Availability */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between text-sm text-black" onClick={() => setAvailabilityOpen(!availabilityOpen)}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Availability</span>
          <Icon icon={availabilityOpen ? 'mdi:minus' : 'mdi:plus'} width="18" height="18" />
        </button>
        {availabilityOpen && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-700 cursor-pointer" onClick={() => handleAvailabilityChange('in stock')}>
              <div className="flex items-center">
                <span className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  availabilityFilter.includes('in stock') 
                    ? 'bg-black border-black' 
                    : 'bg-gray-200 border-gray-300'
                }`}></span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>In stock</span>
              </div>
              <span className="text-gray-500 text-xs">{inStockCount}</span>
            </div>
            <div className="flex items-center justify-between text-gray-700 cursor-pointer" onClick={() => handleAvailabilityChange('out of stock')}>
                  <div className="flex items-center">
                <span className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  availabilityFilter.includes('out of stock') 
                    ? 'bg-black border-black' 
                    : 'bg-gray-200 border-gray-300'
                }`}></span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Out of stock</span>
              </div>
              <span className="text-gray-500 text-xs">{outOfStockCount}</span>
            </div>
                  </div>
        )}
      </div>

      {/* Price */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between text-sm text-black" onClick={() => setPriceOpen(!priceOpen)}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Price</span>
          <Icon icon={priceOpen ? 'mdi:minus' : 'mdi:plus'} width="18" height="18" />
        </button>
        {priceOpen && (
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 flex items-center">
                <span className="text-gray-500 mr-2">₱</span>
                <input 
                  value={priceRange.min} 
                  onChange={e => handleInputChange('min', e.target.value)} 
                  className="w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  type="number" 
                  min={0} 
                  max={maxPrice}
                />
              </div>
              <span className="text-gray-500">–</span>
              <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 flex items-center">
                <span className="text-gray-500 mr-2">₱</span>
                <input 
                  value={priceRange.max} 
                  onChange={e => handleInputChange('max', e.target.value)} 
                  className="w-full outline-none text-gray-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  type="number" 
                  min={0} 
                  max={maxPrice}
                />
              </div>
                  </div>
            {/* Functional range slider */}
            <div className="mt-5 relative h-4 max-w-full">
              {/* Track */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-300 rounded-full"></div>
              
              {/* Active range */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-black rounded-full"
                style={{
                  left: `${minSliderPosition}%`,
                  width: `${maxSliderPosition - minSliderPosition}%`
                }}
              ></div>
              
              {/* Min slider handle */}
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange.min}
                onChange={(e) => handleSliderChange('min', parseInt(e.target.value))}
                className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
              
              {/* Max slider handle */}
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange.max}
                onChange={(e) => handleSliderChange('max', parseInt(e.target.value))}
                className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer"
                style={{ zIndex: 3 }}
              />
              
              {/* Visual handles */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md cursor-pointer"
                style={{ left: `calc(${minSliderPosition}% - 8px)` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md cursor-pointer"
                style={{ left: `calc(${maxSliderPosition}% - 8px)` }}
              ></div>
            </div>
                      </div>
        )}
      </div>

      {/* Sort by */}
      <div className="pb-2">
        <button className="w-full flex items-center justify-between text-sm text-black" onClick={() => setSortOpen(!sortOpen)}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Sort by</span>
          <Icon icon={sortOpen ? 'mdi:minus' : 'mdi:plus'} width="18" height="18" />
        </button>
        {sortOpen && (
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            {['Alphabetically, A-Z','Alphabetically, Z-A','Price, low to high','Price, high to low','Date, old to new','Date, new to old'].map(option => (
              <div key={option} className="flex items-center cursor-pointer" onClick={() => setSortOption(option)}>
                <span className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  sortOption === option 
                    ? 'bg-black border-black' 
                    : 'bg-gray-200 border-gray-300'
                }`}></span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{option}</span>
              </div>
            ))}
                    </div>
        )}
                    </div>
    </aside>
  );
};

export default ProductListSidebar;


