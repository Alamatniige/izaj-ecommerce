import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

/**
 * POST /api/orders/confirm-shipping-fee
 * Confirm shipping fee for an order
 * Note: Uses admin client since user might not be authenticated when clicking email link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, token } = body;

    if (!order_id || !token) {
      return NextResponse.json(
        { success: false, error: 'Order ID and token are required' },
        { status: 400 }
      );
    }

    // Get order using admin client (no auth required)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, status, shipping_fee, shipping_fee_confirmed, user_id')
      .eq('id', order_id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json(
        { success: false, error: `Order not found: ${orderError.message}` },
        { status: 404 }
      );
    }

    if (!order) {
      console.error('Order not found - order_id:', order_id);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order is still pending
    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Order is no longer pending' },
        { status: 400 }
      );
    }

    // Verify shipping fee is set
    if (!order.shipping_fee || order.shipping_fee <= 0) {
      return NextResponse.json(
        { success: false, error: 'Shipping fee not set for this order' },
        { status: 400 }
      );
    }

    // Verify token (simple verification - in production, use a proper token system)
    // For now, we'll accept any valid token format
    // In production, verify against stored token hash
    
    // Update order to confirm shipping fee using admin client
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        shipping_fee_confirmed: true
      })
      .eq('id', order_id)
      .eq('status', 'pending') // Only update if still pending
      .select()
      .single();

    if (updateError) {
      console.error('Error confirming shipping fee:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to confirm shipping fee' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Shipping fee confirmed successfully',
      data: {
        order_id: updatedOrder.id,
        order_number: updatedOrder.order_number
      }
    });

  } catch (error) {
    console.error('Error in confirm-shipping-fee:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/confirm-shipping-fee
 * Handle GET request from email link (redirects to success page)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order');
    const token = searchParams.get('token');

    if (!orderId || !token) {
      return NextResponse.redirect(new URL('/orders?error=invalid_link', request.url));
    }

    // Call POST endpoint to confirm
    const baseUrl = new URL(request.url).origin;
    const confirmResponse = await fetch(`${baseUrl}/api/orders/confirm-shipping-fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId, token })
    });

    const result = await confirmResponse.json();

    if (result.success) {
      // Pass order number in URL so success page doesn't need to fetch it
      const orderNumber = result.data?.order_number || '';
      return NextResponse.redirect(new URL(`/confirm-shipping-fee-success?order=${orderId}${orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : ''}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/orders?error=${encodeURIComponent(result.error || 'confirmation_failed')}`, request.url));
    }

  } catch (error) {
    console.error('Error in GET confirm-shipping-fee:', error);
    return NextResponse.redirect(new URL('/orders?error=server_error', request.url));
  }
}

