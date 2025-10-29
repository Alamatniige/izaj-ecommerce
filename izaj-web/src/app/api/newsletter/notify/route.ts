import { NextRequest, NextResponse } from 'next/server';
import { NewsletterNotificationService } from '@/services/newsletterNotifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, products, saleDetails } = body;

    // Basic authentication check (you can add proper auth later)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.NEWSLETTER_API_KEY || 'your-secret-key'}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!type || (type !== 'new_products' && type !== 'sales')) {
      return NextResponse.json(
        { success: false, error: 'Invalid notification type. Use "new_products" or "sales"' },
        { status: 400 }
      );
    }

    if (type === 'new_products' && !products) {
      return NextResponse.json(
        { success: false, error: 'Products are required for new_products notification' },
        { status: 400 }
      );
    }

    if (type === 'sales' && !saleDetails) {
      return NextResponse.json(
        { success: false, error: 'Sale details are required for sales notification' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'new_products') {
      await NewsletterNotificationService.notifyNewProducts(products);
      result = { message: `Notifications sent for ${products.length} product(s)` };
    } else {
      await NewsletterNotificationService.notifySales(saleDetails);
      result = { message: `Sales notification sent: ${saleDetails.title}` };
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

