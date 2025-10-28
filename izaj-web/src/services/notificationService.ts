import { createClient } from '@/lib/supabase/server';

export interface CreateNotificationParams {
  user_id: string;
  type: 'order' | 'promo' | 'review' | 'system' | 'favorite' | 'payment';
  title: string;
  message: string;
  link?: string;
  order_id?: string;
  order_number?: string;
}

/**
 * Create a notification for a user
 * This function can be used from server-side code (API routes, server actions, etc.)
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: params.user_id,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        order_id: params.order_id || null,
        order_number: params.order_number || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    throw error;
  }
}

/**
 * Create order status notification
 */
export async function createOrderStatusNotification(
  user_id: string,
  order_number: string,
  order_id: string,
  status: string
) {
  const messages: Record<string, { title: string; message: string }> = {
    pending: {
      title: 'Order Received',
      message: `Your order #${order_number} has been received and is being processed.`,
    },
    approved: {
      title: 'Order Approved',
      message: `Your order #${order_number} has been approved and will be shipped soon.`,
    },
    in_transit: {
      title: 'Order Shipped',
      message: `Your order #${order_number} has been shipped and is on its way!`,
    },
    complete: {
      title: 'Order Delivered',
      message: `Your order #${order_number} has been delivered. Thank you for shopping with us!`,
    },
    cancelled: {
      title: 'Order Cancelled',
      message: `Your order #${order_number} has been cancelled.`,
    },
  };

  const notificationData = messages[status] || {
    title: 'Order Update',
    message: `Your order #${order_number} status has been updated to ${status}.`,
  };

  return createNotification({
    user_id,
    type: 'order',
    title: notificationData.title,
    message: notificationData.message,
    link: `/orders`,
    order_id,
    order_number,
  });
}

/**
 * Create payment notification
 */
export async function createPaymentNotification(
  user_id: string,
  order_number: string,
  order_id: string,
  payment_status: string
) {
  const messages: Record<string, { title: string; message: string }> = {
    paid: {
      title: 'Payment Received',
      message: `Payment for order #${order_number} has been received successfully.`,
    },
    failed: {
      title: 'Payment Failed',
      message: `Payment for order #${order_number} has failed. Please try again.`,
    },
    refunded: {
      title: 'Payment Refunded',
      message: `Payment for order #${order_number} has been refunded.`,
    },
  };

  const notificationData = messages[payment_status] || {
    title: 'Payment Update',
    message: `Payment status for order #${order_number} has been updated.`,
  };

  return createNotification({
    user_id,
    type: 'payment',
    title: notificationData.title,
    message: notificationData.message,
    link: `/orders`,
    order_id,
    order_number,
  });
}

/**
 * Create promo notification
 */
export async function createPromoNotification(
  user_id: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    user_id,
    type: 'promo',
    title,
    message,
    link: link || '/sales',
  });
}

/**
 * Create favorite product back in stock notification
 */
export async function createFavoriteBackInStockNotification(
  user_id: string,
  product_name: string,
  product_id: string
) {
  return createNotification({
    user_id,
    type: 'favorite',
    title: 'Back in Stock',
    message: `Your favorite "${product_name}" is back in stock!`,
    link: `/item-description/${product_id}`,
  });
}

/**
 * Create review notification
 */
export async function createReviewNotification(
  user_id: string,
  product_name: string,
  message: string,
  link?: string
) {
  return createNotification({
    user_id,
    type: 'review',
    title: 'Review Update',
    message,
    link: link || '/reviews',
  });
}

/**
 * Create system notification
 */
export async function createSystemNotification(
  user_id: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    user_id,
    type: 'system',
    title,
    message,
    link,
  });
}

