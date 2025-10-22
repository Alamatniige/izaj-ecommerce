"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { InternalApiService } from '../../services/internalApi';

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  colors: string[];
  stock?: number;
};

interface ProductSuggestionsProps {
  title?: string;
  maxProducts?: number;
  excludeIds?: number[];
}

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  title = "You May Also Like",
  maxProducts = 5,
  excludeIds = []
}) => {
  console.log('🔍 ProductSuggestions: Component rendered with props:', { title, maxProducts, excludeIds });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch random products excluding new and sale products
  useEffect(() => {
    console.log('🔍 ProductSuggestions: useEffect triggered');
    
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 ProductSuggestions: Fetching products...');
        // Use getProductsWithMedia to get a broader set of products
        const response = await InternalApiService.getProductsWithMedia({
          page: 1,
          limit: 50 // Get more products to have options after filtering
        });
        const allProductsData = response.success ? response.products : [];
        console.log('🔍 ProductSuggestions: Received products:', allProductsData.length);
        console.log('🔍 ProductSuggestions: Raw products data:', allProductsData);
        console.log('🔍 ProductSuggestions: Product IDs from API:', allProductsData.map(p => parseInt(p.product_id) || 0));
        console.log('🔍 ProductSuggestions: Exclude IDs:', excludeIds);
        
        if (!allProductsData || allProductsData.length === 0) {
          console.log('🔍 ProductSuggestions: No products received from API');
          setProducts([]);
          setIsLoading(false);
          return;
        }
        
        // If we have very few products, show some even if they're in excludeIds
        let regularProducts;
        if (allProductsData.length <= excludeIds.length + 2) {
          // If we have very few products, show all but try to avoid duplicates
          console.log('🔍 ProductSuggestions: Few products available, showing some duplicates');
          regularProducts = allProductsData;
        } else {
          // Filter out products that are in excludeIds
          regularProducts = allProductsData.filter(product => {
            const productId = parseInt(product.product_id) || 0;
            return !excludeIds.includes(productId);
          });
        }
        
        console.log('🔍 ProductSuggestions: After filtering excludeIds:', regularProducts.length);
        
        // Shuffle and take random products
        const shuffledProducts = regularProducts.sort(() => Math.random() - 0.5);
        const selectedProducts = shuffledProducts.slice(0, maxProducts);
        console.log('🔍 ProductSuggestions: Selected products:', selectedProducts.length);
        
        // Transform to match Product type
        const transformedProducts: Product[] = selectedProducts.map(product => {
          const productId = parseInt(product.product_id) || 0;
          const price = parseFloat(product.price.toString());
          
          // Convert status to stock number for display logic
          const getStockFromStatus = (status: string): number => {
            const normalizedStatus = status?.toLowerCase() || '';
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
          };
          
          return {
            id: productId,
            name: product.product_name,
            price: `₱${price.toLocaleString()}`,
            image: product.media_urls?.[0] || "/placeholder.jpg",
            colors: ["black"],
            stock: getStockFromStatus(product.status)
          };
        });
        
        console.log('🔍 ProductSuggestions: Transformed products:', transformedProducts);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('❌ ProductSuggestions: Error fetching product suggestions:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [maxProducts, excludeIds]);

  if (isLoading) {
    console.log('🔍 ProductSuggestions: Loading state');
    return (
      <section className="container mx-auto px-1 sm:px-2 md:px-4 lg:px-6 py-8 max-w-[98%] relative">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-lg md:text-xl text-black font-playfair font-bold">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(maxProducts)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    console.log('🔍 ProductSuggestions: No products to display, showing fallback');
    return (
      <section className="container mx-auto px-1 sm:px-2 md:px-4 lg:px-6 py-8 max-w-[98%] relative">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-lg md:text-xl text-black font-playfair font-bold">
            {title}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No product suggestions available at the moment.</p>
        </div>
      </section>
    );
  }

  console.log('🔍 ProductSuggestions: Rendering with', products.length, 'products');

  return (
    <section className="container mx-auto px-1 sm:px-2 md:px-4 lg:px-6 py-8 max-w-[98%] relative">
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-lg md:text-xl text-black font-playfair font-bold">
          {title}
        </h2>
        <div className="flex-grow"></div>
        <Link
          href="/collection"
          className="text-sm font-medium text-gray-500 hover:underline mt-1 flex items-center font-lato"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden relative flex flex-col max-w-sm mx-auto w-full rounded-lg shadow-sm">
            <div className="relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={400}
                height={320}
                className="w-full h-56 sm:h-80 object-cover transition-all duration-300 hover:scale-110" 
              />
            </div>
            <div className="px-5 pt-4 pb-0 flex flex-col bg-white">
              <div className="space-y-1.5">
                <h3 className="font-bold text-gray-900 text-sm font-lora text-left line-clamp-2 leading-tight">{product.name}</h3>
                <p className="font-bold text-gray-900 text-base font-lora">{product.price}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  (product.stock || 0) > 5 ? 'bg-green-100 text-green-800' : 
                  (product.stock || 0) > 0 ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    (product.stock || 0) > 5 ? 'bg-green-500' : 
                    (product.stock || 0) > 0 ? 'bg-orange-500' : 
                    'bg-red-500'
                  }`}></span>
                  {(product.stock || 0) > 5 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                </div>
              </div>
              <Link href={`/item-description/${product.id}`} className="mt-3 w-full bg-black text-white py-2 px-3 hover:bg-gray-800 transition-colors duration-300 text-xs text-center block font-lora font-semibold rounded-md border border-black">
                VIEW DETAILS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSuggestions;
