import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 /api/products/search: Starting product search...');
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query || query.trim() === '') {
      return NextResponse.json({ products: [] });
    }

    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ /api/products/search: Missing Supabase Product credentials');
      return NextResponse.json({
        error: 'Supabase Product database not configured'
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);
    
    // Search products in the database
    const { data, error } = await supabase
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
        on_sale,
        product_stock (
          display_quantity,
          last_sync_at
        ),
        sale(*)
      `)
      .eq('publish_status', true)
      .or(`product_name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .order('inserted_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ /api/products/search: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedProducts = (data || []).map(product => ({
      id: product.product_id, // Use product_id for navigation instead of id
      name: product.product_name,
      category: product.category,
      image: product.image_url || product.media_urls?.[0] || '/placeholder.jpg',
      price: product.price,
      description: product.description,
      onSale: product.on_sale,
      stock: product.product_stock?.[0]?.display_quantity || 0,
      sale: product.sale
    }));

    console.log('✅ /api/products/search: Found', transformedProducts.length, 'products for query:', query);
    
    return NextResponse.json({ 
      products: transformedProducts,
      total: transformedProducts.length,
      query: query
    });

  } catch (error) {
    console.error('❌ /api/products/search: Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
