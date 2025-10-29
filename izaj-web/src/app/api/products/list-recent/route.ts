import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Debug endpoint to see recent products in database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    
    // Get products from last N hours
    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - hours);

    console.log(`🔍 Fetching products from last ${hours} hours...`);
    console.log('Since:', timeAgo.toISOString());

    // Fetch recent products
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, product_id, product_name, price, category, inserted_at, publish_status')
      .eq('publish_status', true)
      .gte('inserted_at', timeAgo.toISOString())
      .order('inserted_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products', details: error },
        { status: 500 }
      );
    }

    console.log(`Found ${products?.length || 0} products`);

    return NextResponse.json({
      success: true,
      hours: hours,
      count: products?.length || 0,
      products: products?.map(p => ({
        id: p.id,
        name: p.product_name,
        price: p.price,
        category: p.category,
        inserted_at: p.inserted_at
      })) || []
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

