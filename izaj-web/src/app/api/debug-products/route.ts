import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 /api/debug-products: Starting to debug products...');
    
    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ /api/debug-products: Missing Supabase Product credentials');
      return NextResponse.json({
        error: 'Supabase Product database not configured'
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);
    
    // Get ALL products to debug
    const { data: allProducts, error: allError } = await supabase
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
        is_published,
        on_sale,
        product_stock (
          display_quantity,
          last_sync_at
        )
      `)
      .order('inserted_at', { ascending: false })
      .limit(20);

    if (allError) {
      console.error('❌ /api/debug-products: Supabase error:', allError);
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    // Get published products (for website)
    const { data: publishedProducts, error: publishedError } = await supabase
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
        is_published,
        on_sale
      `)
      .eq('publish_status', true)
      .order('inserted_at', { ascending: false });

    if (publishedError) {
      console.error('❌ /api/debug-products: Published products error:', publishedError);
    }

    // Get products from last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const { data: recentProducts, error: recentError } = await supabase
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
        publish_status
      `)
      .eq('publish_status', true)
      .gte('inserted_at', fourteenDaysAgo.toISOString())
      .order('inserted_at', { ascending: false });

    if (recentError) {
      console.error('❌ /api/debug-products: Recent products error:', recentError);
    }

    console.log('✅ /api/debug-products: Debug data collected');

    return NextResponse.json({
      debug: {
        totalProducts: allProducts?.length || 0,
        publishedProducts: publishedProducts?.length || 0,
        recentProducts: recentProducts?.length || 0,
        fourteenDaysAgo: fourteenDaysAgo.toISOString(),
        currentTime: new Date().toISOString()
      },
      allProducts: allProducts || [],
      publishedProducts: publishedProducts || [],
      recentProducts: recentProducts || []
    });
  } catch (error) {
    console.error('❌ /api/debug-products: Error:', error);
    return NextResponse.json(
      { error: 'Failed to debug products' },
      { status: 500 }
    );
  }
}
