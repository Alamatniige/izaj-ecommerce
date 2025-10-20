import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 /api/all-products: Starting to fetch all active products...');
    
    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ /api/all-products: Missing Supabase Product credentials');
      return NextResponse.json({
        error: 'Supabase Product database not configured'
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);
    
    // Get all active products with their sale information
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
      .order('inserted_at', { ascending: false });

    if (error) {
      console.error('❌ /api/all-products: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ /api/all-products: Successfully fetched all products:', data?.length || 0);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('❌ /api/all-products: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all products' },
      { status: 500 }
    );
  }
}