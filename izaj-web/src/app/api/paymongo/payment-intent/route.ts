import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/paymongo/payment-intent
 * Creates a Payment Intent using PayMongo API v1
 * Supports: card, gcash, paymaya
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

    // Determine if using test or live mode
    const isTestMode = secretKey.startsWith('sk_test_');
    const baseUrl = isTestMode 
      ? 'https://api.paymongo.com/v1' 
      : 'https://api.paymongo.com/v1';

    // Create Payment Intent
    const paymentIntentData = {
      data: {
        attributes: {
          amount: Math.round(amount * 100), // Convert to centavos
          currency: currency.toUpperCase(),
          payment_method_allowed: ['card', 'gcash', 'paymaya'],
          description: description || 'Payment',
          metadata: metadata || {}
        }
      }
    };

    const response = await fetch(`${baseUrl}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
      },
      body: JSON.stringify(paymentIntentData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ PayMongo API Error:', responseData);
      return NextResponse.json(
        { 
          success: false, 
          error: responseData.errors?.[0]?.detail || 'Failed to create payment intent',
          details: responseData.errors
        },
        { status: response.status }
      );
    }

    // Extract client_key from payment intent
    const clientKey = responseData.data.attributes.client_key;
    const paymentIntentId = responseData.data.id;

    return NextResponse.json({
      success: true,
      data: {
        client_key: clientKey,
        payment_intent_id: paymentIntentId,
        amount: amount,
        currency: currency,
        mode: isTestMode ? 'test' : 'live'
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

