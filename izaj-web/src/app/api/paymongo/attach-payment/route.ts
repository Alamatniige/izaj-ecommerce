import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/paymongo/attach-payment
 * Attaches a payment method to a payment intent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_intent_id, payment_method_id } = body;

    if (!payment_intent_id || !payment_method_id) {
      return NextResponse.json(
        { success: false, error: 'payment_intent_id and payment_method_id are required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    // Attach payment method to payment intent
    const response = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${payment_intent_id}/attach`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
        },
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method: payment_method_id,
              client_key: body.client_key
            }
          }
        })
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ PayMongo API Error:', responseData);
      return NextResponse.json(
        { 
          success: false, 
          error: responseData.errors?.[0]?.detail || 'Failed to attach payment method',
          details: responseData.errors
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData.data
    });

  } catch (error) {
    console.error('❌ Error attaching payment method:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

