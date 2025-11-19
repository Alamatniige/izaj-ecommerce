'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function ConfirmShippingFeeSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order');
  const orderNumberFromUrl = searchParams.get('orderNumber');
  const [orderNumber, setOrderNumber] = useState<string | null>(orderNumberFromUrl);

  useEffect(() => {
    // Use order number from URL if available (passed from confirmation endpoint)
    // Don't try to fetch if not in URL to avoid auth errors
    if (orderNumberFromUrl) {
      setOrderNumber(orderNumberFromUrl);
    }
    // If no order number in URL, we'll just show generic message
    // This avoids auth errors when user clicks email link without being logged in
  }, [orderNumberFromUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:check-circle" className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
          Shipping Fee Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
          {orderNumber ? (
            <>Your shipping fee for order <strong>#{orderNumber}</strong> has been confirmed successfully.</>
          ) : (
            <>Your shipping fee has been confirmed successfully.</>
          )}
        </p>
        
        <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
          Your order will now be approved by the admin. You will receive updates via email.
        </p>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            View My Orders
          </Link>
          
          <Link
            href="/product-list"
            className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

