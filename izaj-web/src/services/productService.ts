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
  
  return {
    id: numericId,
    name: internalProduct.product_name,
    price: `₱${parseFloat(internalProduct.price.toString()).toLocaleString()}`,
    image: primaryImage,
    mediaUrls: internalProduct.media_urls || [],
    colors: ["black"], // Default color
    description: internalProduct.description,
    category: internalProduct.category,
    stock: internalProduct.display_quantity || 0,
    status: internalProduct.status || 'In Stock'
  };
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