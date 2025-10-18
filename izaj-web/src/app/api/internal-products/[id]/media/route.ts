import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Product Database configuration
const SUPABASE_PRODUCT_URL = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_URL || process.env.SUPABASE_PRODUCT_URL;
const SUPABASE_PRODUCT_KEY = process.env.SUPABASE_PRODUCT_SERVICE_KEY || process.env.SUPABASE_PRODUCT_KEY;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    console.log('🔄 Product Media API: Fetching media for product:', id);

    // Check if Supabase credentials are configured
    if (!SUPABASE_PRODUCT_URL || !SUPABASE_PRODUCT_KEY) {
      console.error('❌ Product Media API: Missing Supabase Product credentials');
      return NextResponse.json({
        success: false,
        mediaUrls: [],
        timestamp: new Date().toISOString(),
        error: 'Supabase Product database not configured'
      });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_PRODUCT_URL, SUPABASE_PRODUCT_KEY);

    // Fetch media URLs from Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('media_urls')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Product Media API: Supabase fetch error:', error);
      return NextResponse.json({
        success: false,
        mediaUrls: [],
        timestamp: new Date().toISOString(),
        error: 'Failed to fetch product media from database',
        details: error.message
      });
    }

    if (!product || !product.media_urls) {
      console.log('⚠️ Product Media API: No media URLs found for product:', id);
      return NextResponse.json({
        success: true,
        mediaUrls: [],
        timestamp: new Date().toISOString(),
      });
    }

    // Parse media URLs (they might be stored as JSON string or array)
    let mediaUrls: string[] = [];
    try {
      if (Array.isArray(product.media_urls)) {
        mediaUrls = product.media_urls.map((entry) =>
          typeof entry === 'string' && entry.startsWith('[')
            ? JSON.parse(entry) // if stringified array, parse it
            : entry
        ).flat();
      } else if (typeof product.media_urls === 'string') {
        mediaUrls = JSON.parse(product.media_urls);
      }
    } catch (parseError) {
      console.error('❌ Product Media API: Error parsing media URLs:', parseError);
      mediaUrls = [];
    }

    console.log('✅ Product Media API: Returning media URLs:', mediaUrls);

    return NextResponse.json({
      success: true,
      mediaUrls,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Product Media API: Error:', error);
    return NextResponse.json({
      success: false,
      mediaUrls: [],
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch media'
    });
  }
}