import { NextRequest, NextResponse } from 'next/server';
import { NewsletterNotificationService } from '@/services/newsletterNotifications';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Check for new sales
 * Monitors on_sale column - kapag nag-change from false to true = new sale
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Checking for new sales...');

    // Fetch products that are on sale (on_sale = true)
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, product_id, product_name, price, category, image_url, media_urls, inserted_at')
      .eq('on_sale', true)
      .order('inserted_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching sales products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch sales products', details: error },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      console.log('✅ No products on sale found');
      return NextResponse.json({
        success: true,
        message: 'No products on sale found',
        count: 0
      });
    }

    console.log(`🎉 Found ${products.length} product(s) on sale`);

    // Transform products for sale notification
    const saleProducts = products.map(product => {
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

    // Get first product for sale details
    const firstProduct = products[0];
    
    // Send sale notification
    await NewsletterNotificationService.notifySales({
      title: 'New Products on Sale! 🎉',
      description: `We have ${products.length} exciting product(s) on sale. Check them out now!`,
      discount: 'Special Offer',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    });

    console.log('📧 Sale notifications sent to subscribers');

    return NextResponse.json({
      success: true,
      message: `Sale notifications sent for ${products.length} product(s)`,
      products: products.map(p => p.product_name),
      saleDetails: {
        title: 'New Products on Sale! 🎉',
        productCount: products.length
      }
    });

  } catch (error) {
    console.error('Error checking for sales:', error);
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

