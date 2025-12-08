export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  mediaUrls?: string[];
  colors?: string[];
  description?: string;
  category?: string;
  stock?: number;
  status?: string;
  pickup_available?: boolean;
  isOnSale?: boolean;
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
    price: `₱${parseFloat(internalProduct.price.toString()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    image: primaryImage,
    mediaUrls: internalProduct.media_urls || [],
    colors: ["black"], // Default color
    description: internalProduct.description,
    category: internalProduct.category,
    stock: getStockFromStatus(internalProduct.status),
    status: internalProduct.status || 'In Stock',
    pickup_available: internalProduct.pickup_available
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
    
    // Fetch from all-products API which includes sale data
    const response = await fetch('/api/all-products');

    if (!response.ok) {
      console.error('❌ getAllProducts: Failed to fetch from all-products API');
      return [];
    }

    const allProductsData = await response.json();
    console.log('📦 getAllProducts: Fetched products with sale data:', allProductsData?.length || 0);

    // Transform products with sale price calculation
    const products = (allProductsData || []).map((productData: any) => {
      // Use product_id as the numeric ID, fallback to hash of UUID
      let numericId = parseInt(productData.product_id);
      if (isNaN(numericId)) {
        numericId = parseInt(productData.id.replace(/[^0-9]/g, '').slice(0, 8)) || 0;
      }

      // Use first media URL if available, otherwise fallback to image_url
      const primaryImage = productData.media_urls && productData.media_urls.length > 0 
        ? productData.media_urls[0] 
        : (productData.image_url || "/placeholder.jpg");

      // Use real stock quantity when available; fall back to status mapping
      const getStockFromStatus = (status: string): number => {
        const normalizedStatus = status?.toLowerCase() || '';
        switch (normalizedStatus) {
          case 'in stock':
            return 10;
          case 'low stock':
            return 3;
          case 'out of stock':
            return 0;
          default:
            return 10;
        }
      };
      const realStockQuantity: number | undefined = productData?.product_stock?.display_quantity;

      // Calculate sale price based on percentage or fixed_amount
      // Only apply sale price if product is actually on sale
      const originalPrice = parseFloat(productData.price.toString());
      const isOnSale = productData.on_sale === true;
      const saleDetails = productData.sale?.[0]; // Sale is an array, get first element
      let finalPrice = originalPrice;
      let originalPriceFormatted = `₱${originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      // Only apply sale price if product is marked as on_sale and has sale details
      if (isOnSale && saleDetails) {
        if (saleDetails.percentage) {
          // Calculate discount based on percentage
          const discountAmount = (originalPrice * saleDetails.percentage) / 100;
          finalPrice = originalPrice - discountAmount;
        } else if (saleDetails.fixed_amount) {
          // Calculate discount based on fixed amount
          finalPrice = Math.max(0, originalPrice - saleDetails.fixed_amount);
        }
      }

      return {
        id: numericId,
        name: productData.product_name,
        price: `₱${finalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        originalPrice: (isOnSale && saleDetails) ? originalPriceFormatted : undefined,
        image: primaryImage,
        mediaUrls: productData.media_urls || [],
        colors: ["black"], // Default color
        description: productData.description,
        category: productData.category,
        stock: typeof realStockQuantity === 'number' ? realStockQuantity : getStockFromStatus(productData.status),
        status: productData.status || 'In Stock',
        pickup_available: productData.pickup_available,
        isOnSale: isOnSale
      };
    });

    console.log('✅ getAllProducts: Successfully transformed products:', products.length);
    return products;
  } catch (error) {
    console.error('❌ getAllProducts: Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  const products = await getAllProducts();
  return products.find(product => product.id === id);
};