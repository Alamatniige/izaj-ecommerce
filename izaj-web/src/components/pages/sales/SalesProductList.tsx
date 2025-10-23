"use client";

import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getStockStatusFromStatus } from '../../../utils/helpers';

// Local product type for Sales page
type SalesProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  mediaUrls?: string[];
  colors?: string[];
  isOnSale?: boolean;
  isNew?: boolean;
  stock?: number;
  category?: string;
};

interface SalesProductListProps {
  filteredProducts: SalesProduct[];
  viewMode: 'grid' | 'list';
  selectedColors: { [key: number]: string };
  isCarousel: boolean;
  handleColorSelect: (productId: number, color: string) => void;
  handleViewModeChange: (mode: 'grid' | 'list') => void;
  sortOption: string;
  handleSortChange: (option: string) => void;
  setSortModalOpen: (open: boolean) => void;
  setFilterDrawerOpen: (open: boolean) => void;
}

const SalesProductList: React.FC<SalesProductListProps> = ({
  filteredProducts,
  viewMode,
  selectedColors,
  isCarousel,
  handleColorSelect,
  handleViewModeChange,
  sortOption,
  handleSortChange,
  setSortModalOpen,
  setFilterDrawerOpen,
}) => {
  // Image cycling states
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isImageTransitioning, setIsImageTransitioning] = useState<{ [key: number]: boolean }>({});

  // Handle hover events for image switching
  const handleMouseEnter = (productId: number) => {
    setHoveredProduct(productId);
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  const handleMouseLeave = (productId: number) => {
    setHoveredProduct(null);
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  // Get current image for a product
  const getCurrentImage = (product: SalesProduct) => {
    if (!product.mediaUrls || product.mediaUrls.length === 0) {
      return product.image;
    }
    
    const index = currentImageIndex[product.id] || 0;
    return product.mediaUrls[index] || product.image;
  };

  // Image cycling effect when hovering
  useEffect(() => {
    if (!hoveredProduct) return;

    const product = filteredProducts.find(p => p.id === hoveredProduct);
    if (!product || !product.mediaUrls || product.mediaUrls.length <= 1) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsImageTransitioning(prev => ({
        ...prev,
        [hoveredProduct]: true
      }));

      // After fade out, change image and fade in
      setTimeout(() => {
        setCurrentImageIndex(prev => {
          const currentIndex = prev[hoveredProduct] || 0;
          const nextIndex = (currentIndex + 1) % product.mediaUrls!.length;
          return {
            ...prev,
            [hoveredProduct]: nextIndex
          };
        });

        // Fade in
        setTimeout(() => {
          setIsImageTransitioning(prev => ({
            ...prev,
            [hoveredProduct]: false
          }));
        }, 50);
      }, 300); // Half of transition duration
    }, 1200); // Increased interval to account for fade time

    return () => clearInterval(interval);
  }, [hoveredProduct, filteredProducts]);
  return (
    <main className="w-full lg:w-5/6 p-0 sm:p-4 md:px-1 lg:px-1 mobile-center-main">

      {/* Product Grid/List - Responsive Design */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={`product-${index}`} 
              className="overflow-hidden relative flex flex-col w-full group"
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={() => handleMouseLeave(product.id)}
            >
              <div 
                className="relative overflow-hidden"
              >
                <Image 
                  src={getCurrentImage(product)} 
                  alt={product.name} 
                  width={400}
                  height={320}
                  className={`w-full h-64 sm:h-96 object-cover transition-all duration-300 hover:scale-110 ${
                    isImageTransitioning[product.id] ? 'opacity-0' : 'opacity-100'
                  }`} 
                />
                {/* Product Badges */}
                {/* NEW badge - only show if product is new and not on sale */}
                {product.isNew && !product.isOnSale && (
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap" style={{ backgroundColor: '#10B981' }}>NEW</span>
                )}
                {/* SALE badge - only show if product is on sale */}
                {product.isOnSale && (
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap" style={{ backgroundColor: '#EF4444' }}>SALE</span>
                )}
                
              </div>
              <div className="pt-5 pb-0 flex flex-col">
                <div className="space-y-1.5">
                  {product.category && (
                    <div className="relative">
                      <p className="text-gray-500 text-xs text-left group-hover:opacity-0 transition-opacity duration-300" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.category}</p>
                      <Link
                        href={`/item-description/${product.id}?source=sales`}
                        className="absolute top-0 left-0 w-full text-white py-3 px-3 hover:opacity-80 transition-all duration-300 text-sm text-center block rounded-sm border opacity-0 group-hover:opacity-100"
                        style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#423f3f', borderColor: '#423f3f', letterSpacing: '0.1em' }}
                      >
                        VIEW DETAILS
                      </Link>
                    </div>
                  )}
                  <h3 className="text-gray-900 text-base text-left line-clamp-2 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{product.name}</h3>
                  <p className="text-gray-900 text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>₱{product.price.toLocaleString()}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    (product.stock || 0) > 5 ? 'bg-green-100 text-green-800' : 
                    (product.stock || 0) > 0 ? 'bg-orange-100 text-orange-800' : 
                    'bg-red-100 text-red-800'
                  }`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${
                      (product.stock || 0) > 5 ? 'bg-green-500' : 
                      (product.stock || 0) > 0 ? 'bg-orange-500' : 
                      'bg-red-500'
                    }`}></span>
                    {(product.stock || 0) > 5 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={`product-list-${index}`}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative w-full lg:w-72 xl:w-80 h-80 lg:h-72 flex items-center justify-center p-4 bg-white">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 transform translate-y-4"
                    />
                  </div>
                </div>
               
               {/* Content Section */}
               <div className="flex-1 p-6 lg:p-8 flex flex-col">
                 <div className="flex-1">
                   {/* Product Name and Price */}
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex-1 mr-4">
                       <h3 className="font-bold text-xl lg:text-2xl text-gray-900 line-clamp-2 leading-tight mb-2">
                         {product.name}
                       </h3>
                       <p className="text-gray-600 text-sm lg:text-base line-clamp-2 leading-relaxed">
                         {product.description}
                       </p>
                     </div>
                     <div className="text-right flex-shrink-0">
                       <p className="text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                       <div className="flex items-center justify-end space-x-2 mt-2">
                         <div className={`w-3 h-3 rounded-full ${
                           (product.stock || 0) > 5 ? 'bg-green-500' : 
                           (product.stock || 0) > 0 ? 'bg-orange-500' : 
                           'bg-red-500'
                         }`}></div>
                         <span className={`text-sm font-medium ${
                           (product.stock || 0) > 5 ? 'text-green-600' : 
                           (product.stock || 0) > 0 ? 'text-orange-600' : 
                           'text-red-600'
                         }`}>
                           {(product.stock || 0) > 5 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                         </span>
                       </div>
                       <div className="flex items-center justify-end space-x-2 mt-2">
                         {/* NEW badge - only show if product is new and not on sale */}
                         {product.isNew && !product.isOnSale && (
                           <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md">
                             NEW
                           </div>
                         )}
                         {/* SALE badge - only show if product is on sale */}
                         {product.isOnSale && (
                           <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md">
                             SALE
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                   
                   {/* Colors */}
                   {product.colors && product.colors.length > 0 && (
                     <div className="mb-5">
                       <p className="text-sm font-medium text-gray-700 mb-3">Available Colors:</p>
                       <div className="flex items-center space-x-3">
                         {product.colors.map((color) => (
                           <button
                             key={color}
                             onClick={() => handleColorSelect(product.id, color)}
                             className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                               selectedColors[product.id] === color 
                                 ? 'border-gray-800 shadow-lg ring-2 ring-gray-300' 
                                 : 'border-gray-300 hover:border-gray-400'
                             }`}
                             style={{ backgroundColor: color }}
                             title={color.charAt(0).toUpperCase() + color.slice(1)}
                           />
                         ))}
                       </div>
                     </div>
                   )}
                   
                   
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                   <Link
                     href={`/item-description/${product.id}?source=sales`}
                     className="flex-1 bg-black text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2"
                   >
                     <Icon icon="mdi:eye" width="20" height="20" />
                     <span>View Details</span>
                   </Link>
                   <button className="flex-1 bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2">
                     <Icon icon="mdi:cart-plus" width="20" height="20" />
                     <span>Add to Cart</span>
                   </button>
                   <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center">
                     <Icon icon="mdi:heart-outline" width="20" height="20" />
                   </button>
                 </div>
               </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
};

export default SalesProductList;