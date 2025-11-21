import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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

    // Log the FULL event structure for debugging
    console.log('📦 PayMongo Webhook Event (FULL):', JSON.stringify(event, null, 2));
    console.log('📦 PayMongo Webhook Event (Summary):', {
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
  // Log the FULL eventData structure for debugging
  console.log('✅ Payment Paid - FULL eventData:', JSON.stringify(eventData, null, 2));
  
  console.log('✅ Payment Paid (Summary):', {
    payment_intent_id: eventData.attributes?.data?.attributes?.payment_intent_id,
    amount: eventData.attributes?.data?.attributes?.amount,
    status: eventData.attributes?.data?.attributes?.status,
    payment_method: eventData.attributes?.data?.attributes?.payment_method?.type
  });

  try {
    // Try multiple paths to get metadata - PayMongo structure can vary
    const metadata = 
      eventData.attributes?.data?.attributes?.metadata ||
      eventData.attributes?.metadata ||
      eventData.metadata;
    
    console.log('🔍 Metadata extracted:', JSON.stringify(metadata, null, 2));
    
    const orderId = metadata?.order_id;
    
    // Try multiple paths to get payment reference
    const paymentReference = 
      eventData.attributes?.data?.attributes?.payment_intent_id ||
      eventData.attributes?.data?.id ||
      eventData.attributes?.id ||
      eventData.id;

    console.log('🔍 Extracted values:', {
      orderId,
      paymentReference,
      metadataPath1: eventData.attributes?.data?.attributes?.metadata,
      metadataPath2: eventData.attributes?.metadata,
      metadataPath3: eventData.metadata
    });

    // If orderId not found, try to get it from payment link metadata
    let finalOrderId = orderId;
    if (!finalOrderId) {
      console.log('⚠️ Order ID not found in payment metadata, trying to fetch from payment link...');
      
      // Try to get payment link ID from the payment attributes
      const paymentLinkId = 
        eventData.attributes?.data?.attributes?.source?.id ||
        eventData.attributes?.data?.attributes?.payment_intent?.attributes?.payment_method_allowed ||
        eventData.attributes?.payment_link_id;
      
      if (paymentLinkId) {
        console.log('🔍 Found payment link ID:', paymentLinkId);
        
        // Fetch payment link to get metadata
        const secretKey = process.env.PAYMONGO_SECRET_KEY;
        if (secretKey) {
          try {
            const linkResponse = await fetch(`https://api.paymongo.com/v1/links/${paymentLinkId}`, {
              headers: {
                'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
              }
            });
            
            if (linkResponse.ok) {
              const linkData = await linkResponse.json();
              const linkMetadata = linkData.data?.attributes?.metadata;
              finalOrderId = linkMetadata?.order_id;
              console.log('✅ Found order_id from payment link:', finalOrderId);
            }
          } catch (error) {
            console.error('❌ Error fetching payment link:', error);
          }
        }
      }
    }

    if (!finalOrderId) {
      console.error('❌ No order_id found in payment metadata or payment link');
      console.error('❌ Full eventData structure:', JSON.stringify(eventData, null, 2));
      return;
    }

    if (!paymentReference) {
      console.error('❌ No payment reference found in event data');
      console.error('❌ Full eventData structure:', JSON.stringify(eventData, null, 2));
      return;
    }

    // Update order with payment reference
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log('🔧 Attempting to update order:', {
      orderId: finalOrderId,
      paymentReference,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing (using anon key)'
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_reference: paymentReference,
        payment_status: 'paid'
      })
      .eq('id', finalOrderId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating order with payment reference:', updateError);
      console.error('❌ Update error details:', JSON.stringify(updateError, null, 2));
    } else {
      console.log('✅ Order updated with payment reference:', {
        orderId: finalOrderId,
        paymentReference,
        order: updatedOrder
      });
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentPaid:', error);
  }
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

  try {
    // Extract order_id from metadata
    const metadata = eventData.attributes?.data?.attributes?.metadata;
    const orderId = metadata?.order_id;
    
    // Extract payment reference
    const paymentReference = 
      eventData.attributes?.data?.attributes?.payment_intent_id ||
      eventData.attributes?.data?.id ||
      eventData.id;

    if (!orderId) {
      console.error('❌ No order_id found in payment metadata');
      return;
    }

    // Update order with payment reference even if failed
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_reference: paymentReference,
        payment_status: 'failed'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating order with payment reference:', updateError);
    } else {
      console.log('✅ Order updated with payment reference (failed):', {
        orderId,
        paymentReference,
        order: updatedOrder
      });
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentFailed:', error);
  }
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

  try {
    // Extract order_id from metadata
    const metadata = eventData.attributes?.data?.attributes?.metadata;
    const orderId = metadata?.order_id;
    
    // Extract payment reference
    const paymentReference = 
      eventData.attributes?.data?.attributes?.payment_intent_id ||
      eventData.attributes?.data?.id ||
      eventData.id;

    if (!orderId) {
      console.error('❌ No order_id found in payment metadata');
      return;
    }

    // Update order with payment reference for pending payments
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_reference: paymentReference,
        payment_status: 'pending'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating order with payment reference:', updateError);
    } else {
      console.log('✅ Order updated with payment reference (pending):', {
        orderId,
        paymentReference,
        order: updatedOrder
      });
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentPending:', error);
  }
}

