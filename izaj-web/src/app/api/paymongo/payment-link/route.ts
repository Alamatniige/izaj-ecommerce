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

    // Create Payment Link
    const paymentLinkData = {
      data: {
        attributes: {
          amount: Math.round(amount * 100), // Convert to centavos
          currency: currency.toUpperCase(),
          description: description || 'Payment',
          metadata: metadata || {}
        }
      }
    };

    const response = await fetch('https://api.paymongo.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
      },
      body: JSON.stringify(paymentLinkData)
    });

    const responseData = await response.json();

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

