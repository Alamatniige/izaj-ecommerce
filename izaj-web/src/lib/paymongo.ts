/**
 * PayMongo API utility functions
 */

import crypto from 'crypto';

const PAYMONGO_API_BASE = 'https://api.paymongo.com/v1';

/**
 * Create a Payment Intent
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  description?: string;
  paymentMethodAllowed?: string[];
  metadata?: Record<string, any>;
}): Promise<{
  client_key: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}> {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error('PAYMONGO_SECRET_KEY is not configured');
  }

  const response = await fetch(`${PAYMONGO_API_BASE}/payment_intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: Math.round(params.amount * 100), // Convert to centavos
          currency: (params.currency || 'PHP').toUpperCase(),
          payment_method_allowed: params.paymentMethodAllowed || ['card', 'gcash', 'paymaya'],
          description: params.description || 'Payment',
          metadata: params.metadata || {}
        }
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.detail || 
      `PayMongo API error: ${response.status}`
    );
  }

  return {
    client_key: data.data.attributes.client_key,
    payment_intent_id: data.data.id,
    amount: params.amount,
    currency: params.currency || 'PHP'
  };
}

/**
 * Retrieve a Payment Intent
 */
export async function getPaymentIntent(paymentIntentId: string) {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error('PAYMONGO_SECRET_KEY is not configured');
  }

  const response = await fetch(`${PAYMONGO_API_BASE}/payment_intents/${paymentIntentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.detail || 
      `PayMongo API error: ${response.status}`
    );
  }

  return data.data;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');
    
    // PayMongo sends signature in format: timestamp,hex_signature
    const [, receivedSignature] = signature.split(',');
    
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
 * Test card numbers for PayMongo
 */
export const TEST_CARDS = {
  SUCCESS: '4242 4242 4242 4242',
  THREE_DS: '4000 0025 0000 3155',
  DECLINED: '4000 0000 0000 0002',
  INSUFFICIENT_FUNDS: '4000 0000 0000 9995',
  EXPIRED_CARD: '4000 0000 0000 0069',
  INVALID_CVC: '4000 0000 0000 0127'
} as const;

