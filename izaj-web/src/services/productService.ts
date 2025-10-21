export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  mediaUrls?: string[];
  colors?: string[];
  description?: string;
  category?: string;
  stock?: number;
  status?: string;
}

import { InternalApiService, InternalProduct } from './internalApi';

// Transform internal product to legacy product format
const transformToLegacyProduct = (internalProduct: InternalProduct): Product => {
  console.log('🔍 productService: Transforming product:', {
    id: internalProduct.id,
    product_id: internalProduct.product_id,
    product_name: internalProduct.product_name,
    status: internalProduct.status
  });
  
  // Use product_id as the numeric ID, fallback to hash of UUID
  let numericId = parseInt(internalProduct.product_id);
  if (isNaN(numericId)) {
    // If product_id is not a number, create a numeric ID from the UUID
    numericId = parseInt(internalProduct.id.replace(/[^0-9]/g, '').slice(0, 8)) || 0;
  }
  
  // Use first media URL if available, otherwise fallback to image_url
  const primaryImage = internalProduct.media_urls && internalProduct.media_urls.length > 0 
    ? internalProduct.media_urls[0] 
    : (internalProduct.image_url || "/placeholder.jpg");
  
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
  
  const transformedProduct = {
    id: numericId,
    name: internalProduct.product_name,
    price: `₱${parseFloat(internalProduct.price.toString()).toLocaleString()}`,
    image: primaryImage,
    mediaUrls: internalProduct.media_urls || [],
    colors: ["black"], // Default color
    description: internalProduct.description,
    category: internalProduct.category,
    stock: getStockFromStatus(internalProduct.status),
    status: internalProduct.status || 'In Stock'
  };
  
  console.log('🔍 productService: Transformed product:', {
    id: transformedProduct.id,
    name: transformedProduct.name,
    stock: transformedProduct.stock,
    status: transformedProduct.status
  });
  
  return transformedProduct;
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('🔄 getAllProducts: Starting to fetch products...');
    
    // Use getProductsWithMedia to fetch products with their actual images
    const response = await InternalApiService.getProductsWithMedia({
      page: 1,
      limit: 100
      // Remove status filter to get all products
    });

    console.log('📦 getAllProducts: API response:', response);

    if (response.success) {
      const products = response.products.map(transformToLegacyProduct);
      console.log('✅ getAllProducts: Successfully transformed products:', products);
      // For testing: show all products, regardless of publish status
      // TODO: Change back to filter for published products only when products are properly published
      return products;
    } else {
      console.error('❌ getAllProducts: Failed to fetch products from internal API');
      return [];
    }
  } catch (error) {
    console.error('❌ getAllProducts: Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  const products = await getAllProducts();
  return products.find(product => product.id === id);
};