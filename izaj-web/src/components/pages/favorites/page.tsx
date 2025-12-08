"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useFavoritesContext } from '@/context/FavoritesContext';

const MyFavorites: React.FC = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesContext();
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingItem(productId);
    // Add a small delay for smooth animation
    setTimeout(() => {
      removeFavorite(productId);
      setRemovingItem(null);
    }, 200);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="bg-white min-h-screen px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8">

        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-black" style={{ fontFamily: 'Jost, sans-serif' }}>My Favorites</h1>
          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200 min-h-[40px] sm:min-h-[44px] flex-shrink-0"
              style={{ fontFamily: 'Jost, sans-serif', touchAction: 'manipulation' }}
            >
              <Icon icon="mdi:delete-outline" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
        
        <div className="mb-2 sm:mb-3 text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
          {favorites.length === 0 
            ? 'No items saved yet' 
            : `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved`
          }
        </div>
        <hr className="border-t border-gray-200 mb-4 sm:mb-6 md:mb-8" />

        {favorites.length === 0 ? (
          /* Empty State - Matching Cart Page Design */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-8">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="mdi:heart-outline" width="60" height="60" className="text-gray-300 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:exclamation" width="12" height="12" className="text-white sm:w-4 sm:h-4" />
                </div>
              </div>
              
              <div className="text-center max-w-md w-full px-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Your favorites list is empty
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed px-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Looks like you haven't added any items to your favorites yet. Start browsing to discover amazing lighting fixtures!
                </p>
                
                <div className="space-y-3 sm:space-y-4 w-full">
                  <button 
                    onClick={() => window.location.href = '/product-list'}
                    className="w-full bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-500 active:bg-orange-600 transition-all duration-300 transform active:scale-95 sm:hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg shadow-lg min-h-[48px] sm:min-h-[52px]"
                    style={{ fontFamily: 'Jost, sans-serif', touchAction: 'manipulation' }}
                  >
                    <Icon icon="mdi:lightbulb-on" className="mr-2 sm:mr-3" width="18" height="18" />
                    Browse Products
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/collection'}
                    className="w-full bg-gray-100 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center text-xs sm:text-sm md:text-base min-h-[44px] sm:min-h-[48px]"
                    style={{ fontFamily: 'Jost, sans-serif', touchAction: 'manipulation' }}
                  >
                    <Icon icon="mdi:star" className="mr-2" width="16" height="16" />
                    View New Arrivals
                  </button>
                </div>
                
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 w-full">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>How to save favorites:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] sm:text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>Click heart icon</span>
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] sm:text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>Save items you love</span>
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] sm:text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>Compare & purchase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Favorites Grid - Matching Product List Design */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {favorites.map((item, index) => (
              <div
                key={item.productId}
                className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 ${
                  removingItem === item.productId ? 'opacity-50 scale-95' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Remove Button - Always visible on mobile, hover on desktop */}
                  <button
                    onClick={() => handleRemoveFavorite(item.productId)}
                    disabled={removingItem === item.productId}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 min-h-[36px] sm:min-h-[40px]"
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Remove from favorites"
                  >
                    <Icon 
                      icon={removingItem === item.productId ? "mdi:loading" : "mdi:heart"} 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${removingItem === item.productId ? 'animate-spin' : ''}`} 
                    />
                  </button>
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      href={`/item-description/${item.productId}`}
                      className="bg-white text-black px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 transform translate-y-2 sm:group-hover:translate-y-0 text-sm sm:text-base"
                      style={{ fontFamily: 'Jost, sans-serif', touchAction: 'manipulation' }}
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-black transition-colors duration-200" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
                      ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Icon icon="mdi:star" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      <span className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>4.8</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/item-description/${item.productId}`}
                      className="flex-1 bg-black text-white text-center py-2.5 sm:py-2.5 px-3 sm:px-4 rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 font-medium text-xs sm:text-sm min-h-[44px] sm:min-h-[44px] flex items-center justify-center"
                      style={{ fontFamily: 'Jost, sans-serif', touchAction: 'manipulation' }}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(item.productId)}
                      disabled={removingItem === item.productId}
                      className="px-3 sm:px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:border-red-300 hover:text-red-500 hover:bg-red-50 active:bg-red-100 active:border-red-400 transition-all duration-200 min-h-[44px] sm:min-h-[44px] flex items-center justify-center"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Remove from favorites"
                    >
                      <Icon icon="mdi:heart-off" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  
                  {/* Added Date */}
                  {item.addedAt && (
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100" style={{ fontFamily: 'Jost, sans-serif' }}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyFavorites;


