import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * POST /api/orders/auto-complete
 * Auto-complete delivered orders that are older than 3 days and haven't been reviewed
 * This endpoint should be called periodically (via cron job or scheduled task)
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Calculate date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    console.log('🔍 [Auto-Complete] Looking for completed orders older than:', threeDaysAgo.toISOString());

    // Find completed orders older than 3 days (since delivered status was removed)
    const { data: ordersToComplete, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, status, completed_at')
      .eq('status', 'complete')
      .lt('completed_at', threeDaysAgo.toISOString());

    if (fetchError) {
      console.error('❌ [Auto-Complete] Error fetching orders:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    if (!ordersToComplete || ordersToComplete.length === 0) {
      console.log('✅ [Auto-Complete] No orders to auto-complete');
      return NextResponse.json({
        success: true,
        message: 'No orders to auto-complete',
        data: { count: 0 }
      });
    }

    console.log(`📦 [Auto-Complete] Found ${ordersToComplete.length} completed orders to process`);

    // Update orders to complete status
    const orderIds = ordersToComplete.map(o => o.id);
    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'complete',
        completed_at: new Date().toISOString()
      })
      .in('id', orderIds)
      .select('id, order_number');

    if (updateError) {
      console.error('❌ [Auto-Complete] Error updating orders:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update orders' },
        { status: 500 }
      );
    }

    console.log(`✅ [Auto-Complete] Successfully auto-completed ${updatedOrders?.length || 0} orders`);

    return NextResponse.json({
      success: true,
      message: `Auto-completed ${updatedOrders?.length || 0} orders`,
      data: {
        count: updatedOrders?.length || 0,
        orders: updatedOrders
      }
    });

  } catch (error: any) {
    console.error('❌ [Auto-Complete] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

