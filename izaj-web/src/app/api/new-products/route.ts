import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 /api/new-products: Starting to fetch new products...');
    
    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ /api/new-products: Missing Supabase Product credentials');
      return NextResponse.json({
        error: 'Supabase Product database not configured'
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);
    
    // Get products published within the last 90 days (increased for testing)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    console.log('🔍 Looking for products published since:', ninetyDaysAgo.toISOString());
    
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
        product_stock (
          display_quantity,
          last_sync_at
        )
      `)
      .eq('publish_status', true)
      .gte('inserted_at', ninetyDaysAgo.toISOString())
      .order('inserted_at', { ascending: false });

    if (error) {
      console.error('❌ /api/new-products: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ /api/new-products: Successfully fetched new products:', data?.length || 0);
    
    // If no new products found, get all published products for testing
    if (!data || data.length === 0) {
      console.log('🔄 No new products found, fetching all published products for testing...');
      const { data: allData, error: allError } = await supabase
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
          product_stock (
            display_quantity,
            last_sync_at
          )
        `)
        .eq('publish_status', true)
        .order('inserted_at', { ascending: false })
        .limit(5); // Limit to 5 for testing
      
      if (allError) {
        console.error('❌ /api/new-products: Error fetching all products:', allError);
        return NextResponse.json({ error: allError.message }, { status: 500 });
      }
      
      console.log('✅ /api/new-products: Fetched all products for testing:', allData?.length || 0);
      return NextResponse.json(allData || []);
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('❌ /api/new-products: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new products' },
      { status: 500 }
    );
  }
}
