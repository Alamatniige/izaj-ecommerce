import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/webhooks/paymongo
 * Handles PayMongo webhook events
 * Events: payment.paid, payment.failed, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('paymongo-signature');

    // Verify webhook signature if webhook secret is set
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else {
      // In test mode, log that signature verification is skipped
      console.log('⚠️ Webhook secret not configured - skipping signature verification (OK for test mode)');
    }

    const event = JSON.parse(body);

    // Log the event for debugging
    console.log('📦 PayMongo Webhook Event:', {
      type: event.data?.type,
      id: event.data?.id,
      attributes: event.data?.attributes
    });

    // Handle different event types
    switch (event.data?.type) {
      case 'payment.paid':
        await handlePaymentPaid(event.data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
      
      case 'payment.pending':
        await handlePaymentPending(event.data);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.data?.type}`);
    }

    return NextResponse.json({ 
      success: true,
      received: true 
    });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // PayMongo uses HMAC SHA256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');
    
    // PayMongo sends signature in format: timestamp,hex_signature
    const [timestamp, receivedSignature] = signature.split(',');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature)
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Handle payment.paid event
 */
async function handlePaymentPaid(eventData: any) {
  console.log('✅ Payment Paid:', {
    payment_intent_id: eventData.attributes?.data?.attributes?.payment_intent_id,
    amount: eventData.attributes?.data?.attributes?.amount,
    status: eventData.attributes?.data?.attributes?.status,
    payment_method: eventData.attributes?.data?.attributes?.payment_method?.type
  });

  // TODO: Update order status in database
  // Example:
  // await updateOrderPaymentStatus(
  //   eventData.attributes.data.attributes.payment_intent_id,
  //   'paid'
  // );
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(eventData: any) {
  console.log('❌ Payment Failed:', {
    payment_intent_id: eventData.attributes?.data?.attributes?.payment_intent_id,
    amount: eventData.attributes?.data?.attributes?.amount,
    status: eventData.attributes?.data?.attributes?.status,
    failure_code: eventData.attributes?.data?.attributes?.failure_code,
    failure_message: eventData.attributes?.data?.attributes?.failure_message
  });

  // TODO: Update order status in database
  // Example:
  // await updateOrderPaymentStatus(
  //   eventData.attributes.data.attributes.payment_intent_id,
  //   'failed'
  // );
}

/**
 * Handle payment.pending event
 */
async function handlePaymentPending(eventData: any) {
  console.log('⏳ Payment Pending:', {
    payment_intent_id: eventData.attributes?.data?.attributes?.payment_intent_id,
    amount: eventData.attributes?.data?.attributes?.amount,
    status: eventData.attributes?.data?.attributes?.status
  });

  // TODO: Update order status in database if needed
}

