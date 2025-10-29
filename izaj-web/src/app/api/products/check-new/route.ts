import { NextRequest, NextResponse } from 'next/server';
import { NewsletterNotificationService } from '@/services/newsletterNotifications';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * This endpoint checks for new products uploaded in the last hour
 * and sends notifications to subscribers.
 * 
 * Call this periodically (e.g., every hour via cron job) or
 * trigger it manually after uploading products from izaj-desktop
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const hours = body.hours || 24; // Default to 24 hours instead of 1
    
    // Get the timestamp from N hours ago
    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - hours);

    console.log(`🔍 Checking for new products uploaded since (last ${hours} hours):`, timeAgo.toISOString());

    // Fetch recently uploaded products from Supabase
    const { data: newProducts, error } = await supabaseAdmin
      .from('products')
      .select('id, product_id, product_name, price, category, image_url, media_urls, inserted_at')
      .eq('publish_status', true)
      .gte('inserted_at', timeAgo.toISOString())
      .order('inserted_at', { ascending: false });

    if (error) {
      console.error('Error fetching new products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch new products' },
        { status: 500 }
      );
    }

    if (!newProducts || newProducts.length === 0) {
      console.log(`✅ No new products found in last ${hours} hours`);
      console.log('💡 Tip: Try checking last 7 days or more');
      return NextResponse.json({
        success: true,
        message: `No new products found in last ${hours} hours`,
        count: 0,
        tip: 'Products might be older than the check period'
      });
    }

    console.log(`📦 Found ${newProducts.length} new product(s)`);

    // Transform products for email notification
    const productsForEmail = newProducts.map(product => {
      // Parse media URLs
      let imageUrl = product.image_url || '';
      if (product.media_urls) {
        try {
          const mediaUrls = typeof product.media_urls === 'string' 
            ? JSON.parse(product.media_urls) 
            : product.media_urls;
          if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
            imageUrl = mediaUrls[0];
          }
        } catch (e) {
          console.warn('Failed to parse media URLs for product:', product.id);
        }
      }

      return {
        name: product.product_name,
        price: product.price,
        imageUrl: imageUrl,
        productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`,
        category: product.category
      };
    });

    // Send notifications to subscribers
    const result = await NewsletterNotificationService.notifyNewProducts(productsForEmail);

    return NextResponse.json({
      success: true,
      message: `Notifications sent for ${newProducts.length} new product(s)`,
      products: newProducts.map(p => p.product_name),
      notificationResult: result
    });

  } catch (error) {
    console.error('Error checking for new products:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to manually trigger the check
 */
export async function GET(request: NextRequest) {
  return POST(request);
}

