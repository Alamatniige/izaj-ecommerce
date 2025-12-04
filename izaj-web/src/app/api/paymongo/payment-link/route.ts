import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/paymongo/payment-link
 * Creates a Payment Link using PayMongo API v1
 * This is the recommended way for redirect-based payments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'PHP', description, metadata } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // PayMongo minimum amount is ₱100.00
    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least ₱100.00 (PayMongo minimum requirement)' },
        { status: 400 }
      );
    }

    // Get PayMongo secret key from environment
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    
    if (!secretKey) {
      console.error('❌ PAYMONGO_SECRET_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    // Get the base URL from environment or request
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://izaj-ecommerce.vercel.app';
    
    // Set redirect URL for PayMongo callback
    const redirectUrl = `${baseUrl}/paymongo-callback`;
    
    console.log('🔗 Creating payment link:', {
      baseUrl,
      redirectUrl,
      amount,
      metadata
    });

    // Create Payment Link
    // Note: PayMongo payment links use 'redirect' attribute for success/failed URLs
    const paymentLinkData = {
      data: {
        attributes: {
          amount: Math.round(amount * 100), // Convert to centavos
          currency: currency.toUpperCase(),
          description: description || 'Payment',
          metadata: metadata || {},
          // Add redirect URLs so PayMongo knows where to redirect after payment
          redirect: {
            success: redirectUrl,
            failed: `${baseUrl}/paymongo-callback?status=failed`
          }
        }
      }
    };
    
    console.log('📤 PayMongo Payment Link Request:', JSON.stringify(paymentLinkData, null, 2));

    const response = await fetch('https://api.paymongo.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
      },
      body: JSON.stringify(paymentLinkData)
    });

    const responseData = await response.json();
    
    console.log('📥 PayMongo Payment Link Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ PayMongo API Error:', responseData);
      return NextResponse.json(
        { 
          success: false, 
          error: responseData.errors?.[0]?.detail || 'Failed to create payment link',
          details: responseData.errors
        },
        { status: response.status }
      );
    }

    // Extract checkout URL from payment link
    const checkoutUrl = responseData.data.attributes.checkout_url;
    const paymentLinkId = responseData.data.id;
    
    console.log('✅ Payment link created successfully:', {
      paymentLinkId,
      checkoutUrl,
      redirectUrl: redirectUrl
    });

    return NextResponse.json({
      success: true,
      data: {
        checkout_url: checkoutUrl,
        payment_link_id: paymentLinkId,
        amount: amount,
        currency: currency
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

