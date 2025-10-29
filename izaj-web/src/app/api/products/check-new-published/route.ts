import { NextRequest, NextResponse } from 'next/server';
import { NewsletterNotificationService } from '@/services/newsletterNotifications';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Check for newly published products
 * Monitors publish_status column - kapag nag-change from false to true = new product
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Checking for newly published products...');

    // Fetch products that are published (publish_status = true)
    // Order by most recently inserted
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, product_id, product_name, price, category, image_url, media_urls, inserted_at')
      .eq('publish_status', true)
      .order('inserted_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products', details: error },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      console.log('✅ No published products found');
      return NextResponse.json({
        success: true,
        message: 'No published products found',
        count: 0
      });
    }

    console.log(`📦 Found ${products.length} published product(s)`);

    // Transform products for email notification
    const productsForEmail = products.map(product => {
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

    console.log('📧 Sending notifications to subscribers...');

    // Send notifications to subscribers
    const result = await NewsletterNotificationService.notifyNewProducts(productsForEmail);

    return NextResponse.json({
      success: true,
      message: `Notifications sent for ${products.length} product(s)`,
      products: products.map(p => p.product_name),
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
 * GET endpoint for easy browser access
 */
export async function GET(request: NextRequest) {
  return POST(request);
}

