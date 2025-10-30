import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    console.log('🔄 Internal Products API: Fetching directly from Supabase...', {
      page,
      limit,
      category,
      search,
      status
    });

    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ Internal Products API: Missing Supabase Product credentials');
      return NextResponse.json({
        success: true,
        products: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        timestamp: new Date().toISOString(),
        error: 'Supabase Product database not configured'
      });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        id,
        product_id,
        product_name,       
        price,
        status,
        category,
        branch,
        inserted_at,
        description,
        image_url,
        media_urls,
        publish_status,
        pickup_available
      `, { count: 'exact' })
      .eq('publish_status', true)
      .order('inserted_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search && search.trim()) {
      query = query.ilike('product_name', `%${search.trim()}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: products, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('❌ Internal Products API: Supabase fetch error:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch products from database',
        details: fetchError.message
      }, { status: 500 });
    }

    console.log(`✅ Internal Products API: Found ${products?.length || 0} products`);

    // Transform products to match expected format
    const transformedProducts = (products || []).map((product: any) => {
      console.log('🔍 API: Raw product from Supabase:', {
        id: product.id,
        product_name: product.product_name,
        status: product.status,
        pickup_available: product.pickup_available
      });
      
      // Parse media URLs if they exist
      let mediaUrls: string[] = [];
      if (product.media_urls) {
        try {
          if (Array.isArray(product.media_urls)) {
            mediaUrls = (product.media_urls as string[]).map((entry: string) =>
              typeof entry === 'string' && entry.startsWith('[')
                ? (JSON.parse(entry) as string[])
                : entry
            ).flat();
          } else if (typeof product.media_urls === 'string') {
            mediaUrls = JSON.parse(product.media_urls);
          }
        } catch (parseError) {
          console.warn('Error parsing media URLs for product:', product.id, parseError);
          mediaUrls = [];
        }
      }
      
      // Use first media URL as image_url if available, otherwise fallback to existing image_url
      const primaryImageUrl = mediaUrls.length > 0 ? mediaUrls[0] : (product.image_url || '');
      
      const transformedProduct = {
        id: product.id.toString(),
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        status: product.status,
        category: product.category,
        branch: product.branch,
        description: product.description || '',
        image_url: primaryImageUrl,
        media_urls: mediaUrls,
        publish_status: product.publish_status,
        pickup_available: product.pickup_available !== undefined ? product.pickup_available : true, // Default to true if not set
        display_quantity: 0, // We'll use status instead
        last_sync_at: product.inserted_at || new Date().toISOString(),
      };
      
      console.log('🔍 API: Transformed product:', {
        id: transformedProduct.id,
        product_name: transformedProduct.product_name,
        status: transformedProduct.status,
        pickup_available: transformedProduct.pickup_available
      });
      
      return transformedProduct;
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    console.log('✅ Internal Products API: Returning products:', {
      count: transformedProducts.length,
      total,
      totalPages
    });

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Internal Products API: Error:', error);
    
    return NextResponse.json({
      success: true,
      products: [],
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0,
      },
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to fetch products'
    });
  }
}
