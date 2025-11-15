"use client";

import React, { useEffect, useRef, useState } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarDropdownOpen: boolean;
  setSidebarDropdownOpen: (open: boolean) => void;
  architecturalDropdownOpen: boolean;
  setArchitecturalDropdownOpen: (open: boolean) => void;
  mirrorsDropdownOpen: boolean;
  setMirrorsDropdownOpen: (open: boolean) => void;
  fansDropdownOpen: boolean;
  setFansDropdownOpen: (open: boolean) => void;
  selectCategoryOpen: boolean;
  setSelectCategoryOpen: (open: boolean) => void;
  selectedCategories: string[];
  handleCategorySelect: (category: string) => void;
  clearAllCategories: () => void;
  // Product-list parity
  priceRange?: { min: number; max: number };
  setPriceRange?: (range: { min: number; max: number }) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  maxPrice?: number;
  allProducts: Array<{ category?: string }>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  // unused preserved
  sidebarDropdownOpen,
  setSidebarDropdownOpen,
  architecturalDropdownOpen,
  setArchitecturalDropdownOpen,
  mirrorsDropdownOpen,
  setMirrorsDropdownOpen,
  fansDropdownOpen,
  setFansDropdownOpen,
  selectCategoryOpen,
  setSelectCategoryOpen,
  selectedCategories,
  handleCategorySelect,
  clearAllCategories,
  // used
  priceRange = { min: 0, max: 0 },
  setPriceRange = () => {},
  sortOption = 'Alphabetical, A-Z',
  setSortOption = () => {},
  maxPrice = 0,
  allProducts,
}) => {
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);

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

  const initialPriceRef = useRef<{ min: number; max: number } | null>(null);
  const initialSortRef = useRef<string | null>(null);

  // Capture initial values ONCE when opening, so we can detect changes correctly.
  useEffect(() => {
    if (isOpen) {
      initialPriceRef.current = { min: priceRange.min, max: priceRange.max };
      initialSortRef.current = sortOption;
    }
  }, [isOpen]);

  useEffect(() => {
    setMinInput(String(priceRange.min));
    setMaxInput(String(priceRange.max));
  }, [priceRange.min, priceRange.max]);

  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    setPriceRange({ ...priceRange, [field]: value });
  };

  const handleSliderChange = (field: 'min' | 'max', value: number) => {
    const next = { ...priceRange, [field]: value };
    if (field === 'min' && value > priceRange.max) next.max = value;
    if (field === 'max' && value < priceRange.min) next.min = value;
    setPriceRange(next);
  };

  const handleInputChange = (field: 'min' | 'max', value: string) => {
    if (field === 'min') setMinInput(value);
    if (field === 'max') setMaxInput(value);
    if (value === '') return;
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, Math.min(maxPrice, parsed));
    handlePriceChange(field, clamped);
  };

  const handleInputBlur = (field: 'min' | 'max') => {
    if (field === 'min' && minInput === '') {
      setMinInput('0');
      handlePriceChange('min', 0);
    }
    if (field === 'max' && maxInput === '') {
      setMaxInput(String(maxPrice));
      handlePriceChange('max', maxPrice);
    }
  };

  const minSliderPosition = maxPrice > 0 ? Math.max(0, Math.min(100, ((priceRange.min - 0) / (maxPrice - 0)) * 100)) : 0;
  const maxSliderPosition = maxPrice > 0 ? Math.max(0, Math.min(100, ((priceRange.max - 0) / (maxPrice - 0)) * 100)) : 100;

  const hasChanges = (() => {
    const initP = initialPriceRef.current;
    const initS = initialSortRef.current;
    if (!initP || initS == null) return false;
    return initP.min !== priceRange.min || initP.max !== priceRange.max || initS !== sortOption;
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 sm:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.30)' }}
      />
      {/* Bottom sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 h-[80vh] w-full bg-white z-50 sm:hidden shadow-2xl flex flex-col transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-6">
          <div className="origin-top scale-[1.05] sm:scale-100 transition-transform mx-3 sm:mx-0">
            {/* Categories */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <div className="w-full flex items-center justify-between text-sm text-black">
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Categories</span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllCategories}
                    className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium mb-2"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Clear Filters
                  </button>
                )}
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
            </div>

            {/* Price */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <div className="w-full flex items-center justify-between text-sm text-black">
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Price</span>
              </div>
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
                {/* Slider */}
                <div className="mt-5 relative h-4 max-w-full">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-black rounded-full" style={{ left: `${minSliderPosition}%`, width: `${maxSliderPosition - minSliderPosition}%` }} />
                  <input type="range" min="0" max={maxPrice} value={priceRange.min} onChange={(e) => handleSliderChange('min', parseInt(e.target.value))} className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
                  <input type="range" min="0" max={maxPrice} value={priceRange.max} onChange={(e) => handleSliderChange('max', parseInt(e.target.value))} className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer" style={{ zIndex: 3 }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md cursor-pointer" style={{ left: `calc(${minSliderPosition}% - 8px)` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md cursor-pointer" style={{ left: `calc(${maxSliderPosition}% - 8px)` }} />
                </div>
              </div>
            </div>

            {/* Sort by */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <div className="w-full flex items-center justify-between text-sm text-black">
                <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Sort by</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                {[
                  { label: 'Alphabetical, A-Z', value: 'Alphabetical, A-Z' },
                  { label: 'Alphabetical, Z-A', value: 'Alphabetical, Z-A' },
                  { label: 'Price, low to high', value: 'Price, Low to High' },
                  { label: 'Price, high to low', value: 'Price, High to Low' },
                  { label: 'Date, old to new', value: 'Date, old to new' },
                  { label: 'Date, new to old', value: 'Date, new to old' },
                ].map(option => (
                  <div key={option.label} className="flex items-center cursor-pointer" onClick={() => setSortOption(option.value)}>
                    <span className={`w-4 h-4 rounded-full border-2 mr-3 ${sortOption === option.value ? 'bg-black border-black' : 'bg-gray-200 border-gray-300'}`}></span>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-2 bg-transparent flex justify-center">
          <button
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-black text-white text-sm font-semibold uppercase active:scale-[0.99] transition hover:bg-gray-800 shadow-lg"
            style={{ fontFamily: 'Jost, sans-serif' }}
            onClick={onClose}
            aria-label={hasChanges ? 'View Results' : 'Close Filters'}
          >
            {hasChanges ? 'VIEW RESULTS' : 'CLOSE FILTERS'}
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;


