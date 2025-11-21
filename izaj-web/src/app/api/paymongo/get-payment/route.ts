import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/paymongo/get-payment
 * Get payment details from PayMongo using payment link ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentLinkId = searchParams.get('payment_link_id');

    if (!paymentLinkId) {
      return NextResponse.json(
        { success: false, error: 'payment_link_id is required' },
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

    // Fetch payment link details
    const response = await fetch(`https://api.paymongo.com/v1/links/${paymentLinkId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
      }
    });

    const data = await response.json();

    // Log full response for debugging
    console.log('📦 PayMongo Payment Link Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ PayMongo API Error:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.errors?.[0]?.detail || 'Failed to fetch payment link'
        },
        { status: response.status }
      );
    }

    // Extract payment reference from the payment link
    // Priority: pm_reference_number (user-friendly reference) > payment ID
    let paymentReference = null;
    
    // Path 1: Get pm_reference_number from payment metadata (PRIORITY - this is what users see)
    const payments = data.data?.attributes?.payments || [];
    if (payments.length > 0) {
      const firstPayment = payments[0];
      
      // First, try to get pm_reference_number from metadata (this is the user-friendly reference)
      const pmReferenceNumber = firstPayment?.data?.attributes?.metadata?.pm_reference_number ||
                                firstPayment?.attributes?.metadata?.pm_reference_number ||
                                firstPayment?.data?.attributes?.external_reference_number ||
                                firstPayment?.attributes?.external_reference_number;
      
      if (pmReferenceNumber) {
        paymentReference = pmReferenceNumber;
        console.log('✅ Found pm_reference_number from payment metadata:', paymentReference);
      }
    }
    
    // Path 2: Also check reference_number from payment link attributes
    if (!paymentReference && data.data?.attributes?.reference_number) {
      paymentReference = data.data.attributes.reference_number;
      console.log('✅ Found reference_number from payment link:', paymentReference);
    }
    
    // Path 3: Fallback to payment ID if no reference number found
    if (!paymentReference && payments.length > 0) {
      const firstPayment = payments[0];
      paymentReference = firstPayment?.data?.id || 
                        firstPayment?.id || 
                        firstPayment?.attributes?.id;
      
      if (paymentReference) {
        console.log('⚠️ Using payment ID as fallback reference:', paymentReference);
      }
    }
    
    // Path 4: Check if payments is a direct array with different structure
    if (!paymentReference && Array.isArray(data.data?.attributes?.payments)) {
      const firstPayment = data.data.attributes.payments[0];
      const pmRef = firstPayment?.data?.attributes?.metadata?.pm_reference_number ||
                   firstPayment?.attributes?.metadata?.pm_reference_number;
      if (pmRef) {
        paymentReference = pmRef;
        console.log('✅ Found pm_reference_number from direct payments:', paymentReference);
      }
    }
    
    // Path 5: Check relationships (alternative PayMongo structure)
    if (!paymentReference && data.data?.relationships?.payments?.data) {
      const paymentData = data.data.relationships.payments.data;
      if (Array.isArray(paymentData) && paymentData.length > 0) {
        paymentReference = paymentData[0]?.id;
        if (paymentReference) {
          console.log('⚠️ Using payment ID from relationships as fallback:', paymentReference);
        }
      }
    }

    console.log('🔍 Final payment reference:', paymentReference);

    return NextResponse.json({
      success: true,
      data: {
        payment_link_id: paymentLinkId,
        payment_reference: paymentReference,
        payments: payments,
        metadata: data.data?.attributes?.metadata,
        full_response: data // Include full response for debugging
      }
    });

  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

