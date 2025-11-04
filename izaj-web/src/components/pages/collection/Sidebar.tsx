"use client";

import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';

interface SidebarProps {
  selectedCategories: string[];
  handleCategorySelect: (category: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  maxPrice: number;
  allProducts: Array<{ category?: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategories,
  handleCategorySelect,
  priceRange,
  setPriceRange,
  sortOption,
  setSortOption,
  maxPrice,
  allProducts,
}) => {
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  // Minimalist sidebar UI states (for the screenshot-style design)
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');

  // Calculate categories from available products
  useEffect(() => {
    const categoryCounts: { [key: string]: number } = {};
    allProducts.forEach(product => {
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });
    
    const categoriesWithCounts = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
    
    setCategories(categoriesWithCounts);
  }, [allProducts]);

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
    if (field === 'min') setMinInput(value);
    if (field === 'max') setMaxInput(value);
    if (value === '') return;
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    const clampedValue = Math.max(0, Math.min(maxPrice, parsed));
    handlePriceChange(field, clampedValue);
  };

  const handleInputBlur = (field: 'min' | 'max') => {
    if (field === 'min') {
      if (minInput === '') {
        setMinInput('0');
        handlePriceChange('min', 0);
      }
    } else {
      if (maxInput === '') {
        setMaxInput(String(maxPrice));
        handlePriceChange('max', maxPrice);
      }
    }
  };

  // Calculate slider positions (0-100%)
  const minSliderPosition = maxPrice > 0 ? Math.max(0, Math.min(100, ((priceRange.min - 0) / (maxPrice - 0)) * 100)) : 0;
  const maxSliderPosition = maxPrice > 0 ? Math.max(0, Math.min(100, ((priceRange.max - 0) / (maxPrice - 0)) * 100)) : 100;

  useEffect(() => {
    setMinInput(String(priceRange.min));
    setMaxInput(String(priceRange.max));
  }, [priceRange.min, priceRange.max]);

  // no availability counts needed

  return (
    <aside className="hidden lg:block w-full lg:w-1/6 p-0 sm:p-4 lg:p-6 lg:pl-0 lg:pr-4 mobile-hide sticky top-4 self-start">
      
      {/* Categories */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between text-sm text-black" onClick={() => setCategoriesOpen(!categoriesOpen)}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Categories</span>
          <Icon icon={categoriesOpen ? 'mdi:minus' : 'mdi:plus'} width="18" height="18" />
        </button>
        {categoriesOpen && (
          <div className="mt-3 space-y-2 text-sm">
            {categories.map(({ category, count }) => {
              const selected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-md transition ${selected ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'}`}
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  <span>{category}</span>
                  <span className={`text-xs ${selected ? 'text-white' : 'text-gray-500'}`}>({count})</span>
                </button>
              );
            })}
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
                  value={minInput} 
                  onChange={e => handleInputChange('min', e.target.value)} 
                  onBlur={() => handleInputBlur('min')}
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
                  value={maxInput} 
                  onChange={e => handleInputChange('max', e.target.value)} 
                  onBlur={() => handleInputBlur('max')}
                  className="w-full outline-none text-gray-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  type="number" 
                  min={0} 
                  max={maxPrice}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => { setPriceRange({ min: 0, max: maxPrice }); setMinInput('0'); setMaxInput(String(maxPrice)); }}
                className="text-xs text-gray-600 underline hover:text-gray-800"
              >
                Reset to all prices
              </button>
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

export default Sidebar;