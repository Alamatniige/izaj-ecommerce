import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 /api/sales-products: Starting to fetch sales products...');
    
    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ /api/sales-products: Missing Supabase Product credentials');
      return NextResponse.json({
        error: 'Supabase Product database not configured'
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);
    
    // Get products that are currently on sale with active sale periods
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
        sale!inner(*)
      `)
      .eq('on_sale', true)
      .eq('publish_status', true)
      .lte('sale.start_date', new Date().toISOString())
      .gte('sale.end_date', new Date().toISOString());

    if (error) {
      console.error('❌ /api/sales-products: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ /api/sales-products: Successfully fetched sales products:', data);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('❌ /api/sales-products: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales products' },
      { status: 500 }
    );
  }
}
