"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

import CompactChat from '../../common/CompactChat';
import { getProductById } from '../../../services/productService';
import { useCartContext } from '../../../context/CartContext';
import { useFavoritesContext } from '../../../context/FavoritesContext';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';

interface ItemDescriptionProps {
  params: { id: string };
}

const ItemDescription: React.FC<ItemDescriptionProps> = ({ params }) => {
  const id = params?.id;
  const { addToCart, isLoading: cartLoading } = useCartContext();
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [mainImage, setMainImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [zoomStyle2, setZoomStyle2] = useState({});
  const imgRef = useRef<HTMLDivElement>(null);
  const imgRef2 = useRef<HTMLDivElement>(null);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    total_reviews: 0,
    average_rating: 0,
    five_star: 0,
    four_star: 0,
    three_star: 0,
    two_star: 0,
    one_star: 0
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('San Pablo City');
  const [isLoading, setIsLoading] = useState(true);

  // Stock status helper function
  const getStockStatus = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('out') || statusLower.includes('unavailable')) {
      return { status: 'Out of Stock', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-600', percentage: 0 };
    }
    if (statusLower.includes('low')) {
      return { status: 'Low Stock', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-600', percentage: 30 };
    }
    return { status: 'In Stock', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-600', percentage: 100 };
  };
  
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        console.log('🔄 ItemDescription: Fetching product with ID:', id);
        const found = await getProductById(Number(id));
        console.log('📦 ItemDescription: Found product:', found);
        
        if (found) {
          setProduct(found);
          setMainImage(found.image);
          setSelectedColor(found.colors?.[0] || 'Black');
          
          // Add to recently viewed
          addToRecentlyViewed({
            id: found.id,
            name: found.name,
            price: found.price,
            image: found.image,
            colors: found.colors
          });
          
          // Prefer multiple media URLs if available
          const mediaUrls = Array.isArray(found.mediaUrls) ? found.mediaUrls.filter(Boolean) : [];
          if (mediaUrls.length > 0) {
            setThumbnails(mediaUrls);
            setMainImage(mediaUrls[0]);
          } else if (found.image && typeof found.image === 'string' && found.image !== '/placeholder.jpg') {
            setThumbnails([found.image]);
          } else {
            setThumbnails(['/placeholder.jpg']);
          }
        } else {
          console.log('❌ ItemDescription: Product not found');
        }
      } catch (error) {
        console.error('❌ ItemDescription: Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id to prevent infinite re-renders

  const handleAddToCart = () => {
    if (!product) return;

    // Convert price from string (₱32,995) to number
    const priceString = product.price.replace(/[₱,]/g, '');
    const price = parseFloat(priceString);

    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: price,
      image: product.image,
      quantity: quantity,
      color: selectedColor,
      size: '120cm', // Default size since it's not in the product data
    });

    // Show success feedback
    alert(`${product.name} has been added to your cart!`);
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    // Convert price from string (₱32,995) to number
    const priceString = product.price.replace(/[₱,]/g, '');
    const price = parseFloat(priceString);

    toggleFavorite({
      productId: product.id.toString(),
      name: product.name,
      price: price,
      image: product.image,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef2.current) return;
    
    const { left, top, width, height } = imgRef2.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle2({
      backgroundImage: `url(${thumbnails[1] || thumbnails[0] || mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handleMouseLeave2 = () => {
    setZoomStyle2({});
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageModalOpen(true);
  };

  // Fetch reviews function
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews/${id}`);
      
      if (!response.ok) {
        console.warn(`Reviews API returned ${response.status}, showing empty state`);
        setReviews([]);
        setSummary({
          total_reviews: 0,
          average_rating: 0,
          five_star: 0,
          four_star: 0,
          three_star: 0,
          two_star: 0,
          one_star: 0
        });
        return;
      }

      const result = await response.json();

      if (result.success && result.data) {
        setReviews(result.data.reviews || []);
        setSummary(result.data.summary || {
          total_reviews: 0,
          average_rating: 0,
          five_star: 0,
          four_star: 0,
          three_star: 0,
          two_star: 0,
          one_star: 0
        });
      } else {
        setReviews([]);
        setSummary({
          total_reviews: 0,
          average_rating: 0,
          five_star: 0,
          four_star: 0,
          three_star: 0,
          two_star: 0,
          one_star: 0
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setSummary({
        total_reviews: 0,
        average_rating: 0,
        five_star: 0,
        four_star: 0,
        three_star: 0,
        two_star: 0,
        one_star: 0
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  if (!id) {
    return <div className="min-h-screen flex items-center justify-center">Invalid product ID</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Product Layout - Lucendi Style */}
        <div className="flex flex-col lg:flex-row gap-0 max-w-7xl mx-auto">
          
          {/* Left Column - Two Images Side by Side */}
          <div className="w-full lg:w-[70%] pr-0 lg:pr-8">
            <div className="flex gap-4">
              {/* First Image */}
              <div className="w-1/2">
                <div 
                  ref={imgRef}
                  className="relative overflow-hidden rounded-lg w-full bg-gray-50 cursor-pointer group flex items-center justify-center"
                  style={{ aspectRatio: '4/5', minHeight: '400px' }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleImageClick(mainImage)}
                >
                  <img
                    src={mainImage}
                    className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
                    alt="Product Image 1"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  
                  {/* Zoom overlay */}
                  {Object.keys(zoomStyle).length > 0 && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        ...zoomStyle,
                        backgroundRepeat: 'no-repeat',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Second Image */}
              <div className="w-1/2">
                <div 
                  ref={imgRef2}
                  className="relative overflow-hidden rounded-lg w-full bg-gray-50 cursor-pointer group flex items-center justify-center"
                  style={{ aspectRatio: '4/5', minHeight: '400px' }}
                  onMouseMove={handleMouseMove2}
                  onMouseLeave={handleMouseLeave2}
                  onClick={() => handleImageClick(thumbnails[1] || thumbnails[0] || mainImage)}
                >
                  <img
                    src={thumbnails[1] || thumbnails[0] || mainImage}
                    className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
                    alt="Product Image 2"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  
                  {/* Zoom overlay */}
                  {Object.keys(zoomStyle2).length > 0 && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        ...zoomStyle2,
                        backgroundRepeat: 'no-repeat',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="w-full lg:w-[30%]">
            {/* Product Information - Lucendi Style */}
            <div className="mb-8">
              {/* Brand/Category Line */}
              <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                {product.category || 'Uncategorized'}
              </p>
              
              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                {product.name}
              </h1>
              
              {/* Price */}
              <p className="text-2xl font-semibold text-black mb-6" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                {product.price} PHP
              </p>
              
              {/* Color Selection */}
              <div className="mb-6">
                <p className="text-sm text-black mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                  Color: <span className="font-normal">{selectedColor || product.colors?.[0] || 'Black'}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors?.map((color: string, index: number) => (
                    <div
                      key={index}
                      className={`w-6 h-6 border border-gray-300 rounded cursor-pointer hover:border-gray-500 transition-all ${
                        selectedColor === color ? 'border-gray-800 ring-1 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  {product.status || 'In Stock'}
                </p>
                
                {/* Stock Status Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getStockStatus(product.status || 'In Stock').color === 'red' 
                        ? 'bg-red-500' 
                        : getStockStatus(product.status || 'In Stock').color === 'orange'
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${getStockStatus(product.status || 'In Stock').percentage}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  {getStockStatus(product.status || 'In Stock').percentage}% available
                </p>
              </div>
              
              {/* Quantity Selector and Add to Cart Button */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    type="button"
                    className="px-3 py-2 text-black hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <span className="px-4 py-2 text-black font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 text-black hover:bg-gray-100"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
                
                {/* Add to Cart Button */}
                <button 
                  className="flex-1 bg-black text-white py-4 px-6 rounded font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                >
                  {cartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
              
              {/* Pickup Availability Section */}
              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon icon="material-symbols:check-circle" className="text-green-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                      Pickup available at <span className="font-semibold">173 1, San Pablo City, 4000 Laguna</span>
                    </p>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                      Usually ready in 2-4 days
                    </p>
                    <button className="text-xs text-orange-600 hover:text-orange-700 underline" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                      View store information
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative group ${
                      activeTab === 'description'
                        ? 'text-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                  >
                    <span className="relative">
                      Description
                      {/* Active underline */}
                      {activeTab === 'description' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                      )}
                      {/* Hover underline - only shows on hover when not active */}
                      {activeTab !== 'description' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      )}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative group ${
                      activeTab === 'reviews'
                        ? 'text-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                  >
                    <span className="relative">
                      Reviews
                      {/* Active underline */}
                      {activeTab === 'reviews' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                      )}
                      {/* Hover underline - only shows on hover when not active */}
                      {activeTab !== 'reviews' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      )}
                    </span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[120px]">
                  {activeTab === 'description' && (
                    <div>
                      {product.description ? (
                        <p className="text-sm text-black whitespace-pre-wrap" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{product.description}</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                          <li>Color: {selectedColor || product.colors?.[0] || 'Black'}</li>
                          <li>No additional description available</li>
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      {reviewsLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <Icon icon="mdi:loading" className="w-6 h-6 text-gray-400 animate-spin" />
                        </div>
                      ) : summary.total_reviews > 0 ? (
                        <div className="space-y-4">
                          {/* Rating Summary */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="text-center">
                                <h4 className="text-2xl font-bold text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700 }}>
                                  {summary.average_rating.toFixed(1)}
                                </h4>
                                <div className="flex items-center justify-center my-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon 
                                      key={i} 
                                      icon={i < Math.round(summary.average_rating) ? "mdi:star" : "mdi:star-outline"} 
                                      className="w-3 h-3 text-gray-800" 
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                  {summary.total_reviews} review{summary.total_reviews > 1 ? 's' : ''}
                                </p>
                              </div>
                              
                              {/* Rating Breakdown */}
                              <div className="flex-1">
                                <div className="space-y-1">
                                  {[
                                    { rating: 5, count: summary.five_star },
                                    { rating: 4, count: summary.four_star },
                                    { rating: 3, count: summary.three_star },
                                    { rating: 2, count: summary.two_star },
                                    { rating: 1, count: summary.one_star }
                                  ].map(({ rating, count }) => {
                                    const percentage = summary.total_reviews > 0 
                                      ? Math.round((count / summary.total_reviews) * 100) 
                                      : 0;
                                    return (
                                      <div key={rating} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600 w-4" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{rating}★</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gray-800 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-600 w-8" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                                          {percentage}%
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Reviews */}
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {reviews.slice(0, 3).map((review) => (
                              <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                      <Icon icon="qlementine-icons:user-16" className="w-3 h-3 text-gray-400" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Icon 
                                            key={i} 
                                            icon="mdi:star" 
                                            className={`w-2.5 h-2.5 ${
                                              i < review.rating ? 'text-gray-800' : 'text-gray-300'
                                            }`} 
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-700 line-clamp-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                      {review.comment}
                                    </p>
                                    {review.verified_purchase && (
                                      <span className="text-xs text-black mt-1 flex items-center gap-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                                        <Icon icon="mdi:check-circle" className="w-3 h-3" />
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <Icon icon="mdi:comment-text-outline" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>No reviews yet</p>
                          <p className="text-gray-400 text-xs" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  )}
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
              <CompactChat onClose={() => setIsChatModalOpen(false)} productName={product?.name} />
            </div>
          </div>
        </div>
      )}

      {/* Floating message icon button - bottom right (hidden when modal is open) */}
      {!isChatModalOpen && (
        <button
          aria-label="Open chat"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-black text-white p-4 shadow-lg hover:bg-gray-800 transition-all hover:scale-110"
          onClick={() => setIsChatModalOpen(true)}
        >
          <Icon icon="material-symbols:chat-outline-rounded" className="text-2xl" />
        </button>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white text-black rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <Icon icon="mdi:close" className="text-2xl" />
            </button>
            <img
              src={selectedImage}
              alt="Product Image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
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
      `}</style>
      
    </div>
  );
};

export default ItemDescription;