"use client";

import { useState, useEffect } from 'react';
import { Product, ProductFilter, ProductSort } from '../types';
import { InternalApiService, InternalProduct } from '../services/internalApi';

// Transform internal product to izaj-web product format
const transformProduct = (internalProduct: InternalProduct): Product => {
  // Use media_urls if available, otherwise fallback to image_url
  const images = internalProduct.media_urls && internalProduct.media_urls.length > 0 
    ? internalProduct.media_urls 
    : (internalProduct.image_url ? [internalProduct.image_url] : []);
    
  return {
    id: internalProduct.id,
    name: internalProduct.product_name,
    description: internalProduct.description || '',
    price: parseFloat(internalProduct.price.toString()) || 0,
    images: images,
    category: internalProduct.category || 'Uncategorized',
    brand: 'IZAJ', // Default brand
    rating: 4.5, // Default rating
    reviewCount: 0, // Default review count
    stock: internalProduct.display_quantity || 0,
    sku: internalProduct.product_id,
    tags: [internalProduct.category].filter(Boolean),
    isNew: false,
    isOnSale: false,
    isFeatured: false,
    createdAt: new Date(internalProduct.last_sync_at),
    updatedAt: new Date(internalProduct.last_sync_at),
  };
};

export const useProducts = (filters?: ProductFilter, sort?: ProductSort) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from internal API
      const response = await InternalApiService.getProducts({
        page: 1,
        limit: 100,
        category: filters?.category,
        search: filters?.search,
        status: 'active',
      });

      if (response.success) {
        let transformedProducts = response.products.map(transformProduct);

        // Apply additional client-side filters
        if (filters) {
          if (filters.brand) {
            transformedProducts = transformedProducts.filter(p => p.brand === filters.brand);
          }
          if (filters.minPrice !== undefined) {
            transformedProducts = transformedProducts.filter(p => p.price >= filters.minPrice!);
          }
          if (filters.maxPrice !== undefined) {
            transformedProducts = transformedProducts.filter(p => p.price <= filters.maxPrice!);
          }
          if (filters.rating !== undefined) {
            transformedProducts = transformedProducts.filter(p => p.rating >= filters.rating!);
          }
          if (filters.inStock) {
            transformedProducts = transformedProducts.filter(p => p.stock > 0);
          }
        }

        // Apply sorting
        if (sort) {
          transformedProducts.sort((a, b) => {
            const aValue = a[sort.field];
            const bValue = b[sort.field];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sort.direction === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sort.direction === 'asc' 
                ? aValue - bValue
                : bValue - aValue;
            }
            
            return 0;
          });
        }

        setProducts(transformedProducts);
      } else {
        throw new Error('Failed to fetch products from internal API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      console.error('Error fetching products:', err);
      
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters?.category, filters?.search, filters?.brand, filters?.minPrice, filters?.maxPrice, filters?.rating, filters?.inStock, sort]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
