"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '@/components';
import { useCartContext, useFavoritesContext } from '@/context';
import { addToFavoritesWithAnimation } from '@/utils/cartAnimation';
import { formatCurrency } from '@/utils/helpers/format';
import { calculateShipping, calculateTax, calculateTotal } from '@/utils/calculations/cartCalculations';
import CompactChat from '@/components/common/CompactChat';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const { addFavorite, isFavorite } = useFavoritesContext();
  const router = useRouter();
  
  const [showShipping, setShowShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Philippines'
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const calculateSubtotal = () => {
    // Calculate subtotal using original price if available, otherwise use discounted price
    return cart.items.reduce((sum, item) => {
      const itemPrice = item.originalPrice !== undefined ? item.originalPrice : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return cart.items.reduce((sum, item) => {
      if (item.originalPrice !== undefined) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);
  };

  const getDiscountItems = () => {
    return cart.items.filter(item => item.originalPrice !== undefined && item.originalPrice > item.price);
  };

  const calculateTotalSavings = () => {
    const discount = calculateDiscount();
    const promo = promoDiscount;
    return discount + promo;
  };

  const handleCheckout = () => {
    try {
      if (shippingAddress.city) {
        localStorage.setItem('checkout_shipping_city', shippingAddress.city);
      }
      if (shippingAddress.province) {
        localStorage.setItem('checkout_shipping_province', shippingAddress.province);
      }
      if (appliedPromo) {
        localStorage.setItem('checkout_applied_promo', appliedPromo);
        localStorage.setItem('checkout_promo_discount', String(promoDiscount));
      }
    } catch (e) {
      // ignore storage failures
    }
    router.push('/checkout');
  };

  const hasShippingAddress = useMemo(() => {
    return Boolean((shippingAddress.street || '').trim() || (shippingAddress.city || '').trim() || (shippingAddress.province || '').trim() || (shippingAddress.postalCode || '').trim());
  }, [shippingAddress.street, shippingAddress.city, shippingAddress.province, shippingAddress.postalCode]);

  const normalizedLocation = useMemo(() => {
    const combined = `${shippingAddress.city || ''} ${shippingAddress.province || ''}`.toLowerCase();
    const cleaned = combined.replace(/city/g, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    if (cleaned.includes('san pablo')) return 'San Pablo City';
    if (cleaned.includes('quezon')) return 'Quezon';
    if (cleaned.includes('laguna')) return 'Laguna';
    if (cleaned.includes('cavite')) return 'Cavite';
    if (cleaned.includes('batangas')) return 'Batangas';
    if (cleaned.includes('camarines sur') || cleaned.includes('camarinesur')) return 'Camarines Sur';
    if (cleaned.includes('sorsogon')) return 'Sorsogon';
    if (cleaned.includes('la union') || cleaned.includes('launion')) return 'La Union';
    return '';
  }, [shippingAddress.city, shippingAddress.province]);

  const shippingFeeMaybe = useMemo(() => {
    if (!hasShippingAddress) return undefined;
    return calculateShipping(normalizedLocation);
  }, [hasShippingAddress, normalizedLocation]);
  const shippingFee = shippingFeeMaybe ?? 0;
  const subtotal = useMemo(() => calculateSubtotal(), [cart.items]);
  const productDiscount = useMemo(() => calculateDiscount(), [cart.items]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const computedTotal = useMemo(() => {
    const total = subtotal - productDiscount - promoDiscount + shippingFee + tax;
    return total < 0 ? 0 : total;
  }, [subtotal, productDiscount, promoDiscount, shippingFee, tax]);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    let discountValue = 0;
    if (!code) {
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }

    // Simple demo promo rules; extend as needed
    if (code === 'FREESHIP') {
      discountValue = shippingFee; // negate shipping (0 until address entered)
    } else if (code === 'SAVE100') {
      discountValue = 100;
    } else if (code === 'SAVE10') {
      discountValue = Math.round(subtotal * 0.10);
    } else {
      // unknown code
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }

    setAppliedPromo(code);
    setPromoDiscount(discountValue);
  };

  // Keep promo discount in sync if city/subtotal changes
  useEffect(() => {
    if (!appliedPromo) return;
    if (appliedPromo === 'FREESHIP') {
      setPromoDiscount(shippingFee);
    } else if (appliedPromo === 'SAVE10') {
      setPromoDiscount(Math.round(subtotal * 0.10));
    } else if (appliedPromo === 'SAVE100') {
      setPromoDiscount(100);
    }
  }, [appliedPromo, shippingFee, subtotal]);

  // Close contact info dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showContactInfo && !target.closest('.contact-info-dropdown')) {
        setShowContactInfo(false);
      }
    };

    if (showContactInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactInfo]);

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-[94%] mx-auto mt-6 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-black" style={{ fontFamily: 'Jost, sans-serif' }}>Your cart</h1>
        </div>
        <div className="mb-2 text-gray-600 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
          {cart.totalItems} product{cart.totalItems !== 1 ? 's' : ''} in total
        </div>
        <hr className="border-t border-gray-200 mb-5 md:mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 lg:py-24 px-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="mdi:cart-outline" width="48" height="48" className="text-gray-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Your cart is empty
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-8 max-w-md" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Start shopping to add items to your cart
                  </p>
                  
                  <button 
                    onClick={() => router.push('/product-list')}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div>
                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <Link key={item.id} href={`/item-description/${item.productId}`} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-100 bg-white relative hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all duration-300 group rounded-lg" style={{ scrollSnapAlign: 'start' }}>
                        <div className="w-20 h-20 sm:w-24 sm:h-28 flex-shrink-0 flex items-center justify-center overflow-hidden mt-1">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <p className="font-bold text-xs sm:text-sm lg:text-lg text-black group-hover:text-gray-700 line-clamp-2" style={{ fontFamily: 'Jost, sans-serif' }}>{item.name}</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                              {item.isSale && (() => {
                                // Calculate discount percentage
                                let discountPercentage: number | null = null;
                                if (item.originalPrice !== undefined && item.originalPrice > item.price) {
                                  const discount = ((item.originalPrice - item.price) / item.originalPrice) * 100;
                                  discountPercentage = Math.round(discount);
                                }
                                return (
                                  <span className="inline-block bg-red-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm shadow-md whitespace-nowrap" style={{ fontFamily: 'Jost, sans-serif', backgroundColor: '#EF4444' }}>
                                    SALE{discountPercentage ? ` -${discountPercentage}%` : ''}
                                  </span>
                                );
                              })()}
                              {item.isNew && (
                                <span className="inline-block bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm shadow-md whitespace-nowrap" style={{ fontFamily: 'Jost, sans-serif' }}>NEW</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-2 sm:mt-4 space-y-2 sm:space-y-0">
                            <div className="flex items-center border border-gray-300 overflow-hidden rounded" onClick={(e) => e.stopPropagation()}>
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuantityChange(item.id, Math.max(1, item.quantity - 1)); }} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
                                <Icon icon="mdi:minus" width="18" height="18" className="sm:w-5 sm:h-5" />
                              </button>
                              <span className="w-8 sm:w-8 text-center text-black font-medium text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>{item.quantity}</span>
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuantityChange(item.id, Math.min(10, item.quantity + 1)); }} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
                                <Icon icon="mdi:plus" width="18" height="18" className="sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between ml-1 sm:ml-2 min-h-[80px] sm:min-h-[96px]" style={{ minHeight: '80px' }}>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm lg:text-lg text-black" style={{ fontFamily: 'Jost, sans-serif' }}>{formatCurrency(item.price * item.quantity)}</p>
                            {item.originalPrice && (
                              <p className="text-[10px] sm:text-sm text-gray-500 line-through" style={{ fontFamily: 'Jost, sans-serif' }}>
                                {item.originalPrice !== undefined ? formatCurrency(item.originalPrice * item.quantity) : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex-grow"></div>
                          <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 flex flex-row space-x-1 sm:space-x-2 items-end z-10">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveItem(item.id); }} className="text-black hover:text-red-500 transition-colors flex items-center p-1.5 sm:p-2" aria-label="Remove">
                              <Icon icon="mdi:delete-outline" width="20" height="20" className="sm:w-6 sm:h-6" />
                            </button>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const originEl = e.currentTarget as HTMLElement;
                                const heartIconElement = document.getElementById('favorites-icon') || document.querySelector('[aria-label="Favorites"]') as HTMLElement | null;
                                if (originEl && heartIconElement) {
                                  await addToFavoritesWithAnimation(
                                    originEl,
                                    heartIconElement,
                                    () => addFavorite({ productId: item.productId, name: item.name, price: item.price, image: item.image })
                                  );
                                } else {
                                  addFavorite({ productId: item.productId, name: item.name, price: item.price, image: item.image });
                                }
                              }}
                              className="text-black hover:text-red-500 transition-colors flex items-center p-1.5 sm:p-2"
                              aria-label="Save for later"
                              title={isFavorite(item.productId) ? 'Already in favorites' : 'Save to favorites'}
                            >
                              <Icon icon={isFavorite(item.productId) ? 'mdi:heart' : 'mdi:heart-outline'} width="20" height="20" className={`sm:w-6 sm:h-6 ${isFavorite(item.productId) ? 'text-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white p-4 lg:p-8 border border-gray-200 shadow-sm rounded-xl">
                  <h2 className="text-lg lg:text-xl font-extrabold mb-4 lg:mb-5 text-black" style={{ fontFamily: 'Jost, sans-serif' }}>Order Summary</h2>
                  <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                    <div className="flex justify-between"><span className="text-gray-600 font-medium text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Subtotal</span><span className="font-semibold text-black text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>{formatCurrency(subtotal)}</span></div>
                    
                    {/* Discount Section - Below Subtotal */}
                    {productDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:tag-outline" className="text-green-600" width="16" height="16" />
                            <span className="text-green-700 font-semibold text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Discount</span>
                          </div>
                          {getDiscountItems().length > 0 && (
                            <p className="text-green-600 text-xs mt-0.5 ml-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                              {getDiscountItems().length} item{getDiscountItems().length > 1 ? 's' : ''} on sale
                            </p>
                          )}
                        </div>
                        <span className="text-green-700 font-bold text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>
                          -{formatCurrency(productDiscount)}
                        </span>
                      </div>
                    )}
                    
                    {promoDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-green-700 font-semibold text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Promo Discount</span>
                          {appliedPromo && (
                            <p className="text-green-600 text-xs mt-0.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                              Code: {appliedPromo}
                            </p>
                          )}
                        </div>
                        <span className="text-green-700 font-bold text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>-{formatCurrency(promoDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center relative">
                      <span className="text-gray-600 font-medium text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Shipping</span>
                      <div className="relative contact-info-dropdown">
                        <button
                          onClick={() => setShowContactInfo(!showContactInfo)}
                          className="font-semibold text-black text-xs lg:text-sm text-right hover:text-gray-700 transition-colors underline cursor-pointer"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          Contact IZAJ for shipping fee
                        </button>
                        {showContactInfo && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 animate-fade-in">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:account-circle" className="text-blue-600 text-xl" />
                                <h4 className="font-semibold text-blue-900 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>Contact IZAJ Lighting</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <a 
                                  href="tel:+63491234567" 
                                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
                                  style={{ fontFamily: 'Jost, sans-serif' }}
                                >
                                  <Icon icon="mdi:phone" className="text-lg" />
                                  <span>+63 (49) 123-4567</span>
                                </a>
                                <a 
                                  href="mailto:info@izajlighting.com" 
                                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
                                  style={{ fontFamily: 'Jost, sans-serif' }}
                                >
                                  <Icon icon="mdi:email" className="text-lg" />
                                  <span>info@izajlighting.com</span>
                                </a>
                                <a 
                                  href="https://facebook.com/izajlighting" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
                                  style={{ fontFamily: 'Jost, sans-serif' }}
                                >
                                  <Icon icon="mdi:facebook" className="text-lg" />
                                  <span>Facebook: IZAJ Lighting Centre</span>
                                </a>
                                <div className="flex items-start gap-2 text-gray-700 mt-3 pt-3 border-t border-blue-200" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  <Icon icon="mdi:map-marker" className="text-lg mt-0.5" />
                                  <div>
                                    <p className="font-medium">Address:</p>
                                    <p>173 1, San Pablo City, 4000 Laguna, Philippines</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-600 font-medium text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Tax (12% VAT)</span><span className="font-semibold text-black text-sm lg:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>{formatCurrency(tax)}</span></div>
                    <div className="border-t border-gray-300 pt-3 lg:pt-4 flex justify-between font-extrabold text-base lg:text-lg"><span className="text-black" style={{ fontFamily: 'Jost, sans-serif' }}>Total</span><span className="text-black" style={{ fontFamily: 'Jost, sans-serif' }}>{formatCurrency(computedTotal)}</span></div>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-black hover:bg-gray-800 text-white py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg shadow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                    <Icon icon="mdi:lock-outline" className="mr-2" />
                    PROCEED TO CHECKOUT
                  </button>
                  <p className="text-xs text-center mt-3 lg:mt-4 text-gray-500" style={{ fontFamily: 'Jost, sans-serif' }}>Taxes and shipping calculated at checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed z-[9999] bottom-4 right-4 md:bottom-6 md:right-6">
          {/* Compact chat window positioned where floating icon was */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-[340px] h-[520px] md:w-[380px] md:h-[560px] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat component */}
            <div className="h-full">
              <CompactChat onClose={() => setIsChatModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Floating chatbot icon button - bottom right (hidden when modal is open) */}
      {!isChatModalOpen && (
        <button
          aria-label="Open chatbot"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-black text-white p-4 shadow-lg hover:bg-gray-800 transition-all hover:scale-110"
          onClick={() => setIsChatModalOpen(true)}
        >
          <Icon icon="material-symbols:chat-outline-rounded" className="text-2xl" />
        </button>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>

    </div>
  );
}
