import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface SaleProduct {
  id: number;
  product_id: string;
  product_name: string;
  price: number;
  status: string;
  category: string;
  description?: string;
  image_url?: string;
  media_urls?: string[];
  on_sale: boolean;
  sale?: {
    id: number;
    sale_price: number;
    discount_percentage: number;
    start_date: string;
    end_date: string;
  };
}

export default function SaleItem() {
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [mainImage, setMainImage] = useState("/placeholder.jpg");
  const [zoomStyle, setZoomStyle] = useState({});
  const imgRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saleProduct, setSaleProduct] = useState<SaleProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real sale products from API
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        console.log('🔄 SaleItem: Fetching sale products...');
        const response = await fetch('/api/sales-products');
        
        if (!response.ok) {
          console.warn('Sales products API returned', response.status);
          return;
        }

        const products = await response.json();
        console.log('📦 SaleItem: Fetched sale products:', products);

        if (products && products.length > 0) {
          // Get the first sale product
          const product = products[0];
          setSaleProduct(product);
          
          // Set the main image
          const primaryImage = product.media_urls && product.media_urls.length > 0 
            ? product.media_urls[0] 
            : (product.image_url || "/placeholder.jpg");
          setMainImage(primaryImage);
        }
      } catch (error) {
        console.error('❌ SaleItem: Error fetching sale products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  // Don't render if loading or no sale product
  if (isLoading) {
    return (
      <section className="w-full bg-gray-50 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sale products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!saleProduct) {
    return null; // Don't render the section if no sale products
  }

  // Calculate sale price and discount
  const originalPrice = saleProduct.price;
  const salePrice = saleProduct.sale?.sale_price || originalPrice;
  const discountPercentage = saleProduct.sale?.discount_percentage || 0;
  const discountAmount = originalPrice - salePrice;

  const thumbnails = saleProduct.media_urls && saleProduct.media_urls.length > 0 
    ? saleProduct.media_urls.slice(0, 2) // Only take first 2 images
    : [saleProduct.image_url || "/placeholder.jpg"];

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

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .scrolling-text {
          animation: scroll 40s linear infinite;
          white-space: nowrap;
          display: inline-flex;
        }
      `}</style>
      
      <section className="w-full bg-gray-50 pt-2 pb-2 sm:pt-4 sm:pb-4 md:pt-6 md:pb-6">
        {/* Scrolling Banner  */}
        <div className="w-full py-10 overflow-hidden relative mb-8">
          <div className="scrolling-text inline-block text-2xl font-bold text-red-600 uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
            Clearance Sale Up to   {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Clearance Sale Up to {discountPercentage}% OFF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          {/* Main Product Layout - Exact same as item-description */}
          <div className="flex flex-col lg:flex-row gap-0 max-w-7xl mx-auto">
            
            {/* Left Column - Two Images Side by Side */}
            <div className="w-full lg:w-[70%] pr-0 lg:pr-8">
              <div className="space-y-4">
                {/* Two Images Side by Side */}
                <div className="flex gap-4">
                  {/* First Image */}
                  <div className="w-1/2">
                    <div 
                      ref={imgRef}
                      className="relative overflow-hidden rounded-lg w-full bg-gray-50 cursor-pointer group flex items-center justify-center"
                      style={{ aspectRatio: '3/4', minHeight: '400px' }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleImageClick(thumbnails[0])}
                    >
                      <Image
                        src={thumbnails[0]}
                        width={600}
                        height={400}
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

                  {/* Second Image (if exists) */}
                  {thumbnails[1] && (
                    <div className="w-1/2">
                      <div 
                        className="relative overflow-hidden rounded-lg w-full bg-gray-50 cursor-pointer group flex items-center justify-center"
                        style={{ aspectRatio: '3/4', minHeight: '400px' }}
                        onClick={() => handleImageClick(thumbnails[1])}
                      >
                        <Image
                          src={thumbnails[1]}
                          width={600}
                          height={400}
                          className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
                          alt="Product Image 2"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Product Details - Sticky - Same as item-description */}
            <div className="w-full lg:w-[30%] lg:sticky lg:top-8 lg:self-start lg:max-h-screen lg:overflow-y-auto scrollbar-hide">
              {/* Product Information - Lucendi Style - Same as item-description */}
              <div className="mb-8">
                {/* Brand/Category Line - Same as item-description */}
                <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  {saleProduct.category}
                </p>
                
                {/* Product Name - Same as item-description */}
                <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                  {saleProduct.product_name}
                </h1>
                
                {/* Price - Same as item-description but with sale styling */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-semibold text-red-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                      ₱{salePrice.toLocaleString()} PHP
                    </span>
                    <span className="text-lg text-gray-500 line-through" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                      ₱{originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>
                    You save ₱{discountAmount.toLocaleString()}!
                  </p>
                </div>
                
                {/* Color Selection - Same as item-description */}
                <div className="mb-6">
                  <p className="text-sm text-black mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                    Color: <span className="font-normal">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2">
                    {["Black", "Gold", "Silver", "Bronze"].map((color: string, index: number) => (
                      <div
                        key={index}
                        className={`w-6 h-6 border border-gray-300 rounded cursor-pointer hover:border-gray-500 transition-all ${
                          selectedColor === color ? 'border-gray-800 ring-1 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Stock Status - Same as item-description */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    {saleProduct.status}
                  </p>
                  
                  {/* Stock Status Bar - Same as item-description */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500 w-full"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    100% available
                  </p>
                </div>
                
                {/* Quantity Selector and Add to Cart Button - Same as item-description */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded h-10">
                    <button
                      type="button"
                      className="px-3 h-10 text-black hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="text-lg">−</span>
                    </button>
                    <span className="px-4 h-10 text-black font-medium flex items-center justify-center" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="px-3 h-10 text-black hover:bg-gray-100 flex items-center justify-center"
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                  
                  {/* Add to Cart Button - Same size as quantity selector with black background */}
                  <Link href={`/item-description/${saleProduct.product_id}`}>
                    <button 
                      className="flex-1 bg-black text-white h-10 px-6 rounded font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                    >
                      Add to Cart
                    </button>
                  </Link>
                </div>
                
                {/* View Product Details Link */}
                <div className="mb-6">
                  <Link href={`/item-description/${saleProduct.product_id}`}>
                    <span className="text-xs text-orange-600 hover:text-orange-700 underline cursor-pointer transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                      View Product Details
                    </span>
                  </Link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom spacing */}
      <div className="mb-8 sm:mb-12 md:mb-16"></div>

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
            <Image
              src={selectedImage}
              alt="Product Image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
