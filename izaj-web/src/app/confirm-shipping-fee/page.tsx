'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function ConfirmShippingFeePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your confirmation...');

  useEffect(() => {
    const confirmShippingFee = async () => {
      try {
        const orderId = searchParams.get('order');
        const token = searchParams.get('token');

        if (!orderId || !token) {
          setStatus('error');
          setMessage('Invalid confirmation link. Missing required parameters.');
          setTimeout(() => {
            router.push('/orders?error=invalid_link');
          }, 3000);
          return;
        }

        // Call the API endpoint
        const response = await fetch('/api/orders/confirm-shipping-fee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId, token })
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Shipping fee confirmed successfully! Redirecting...');
          
          // Redirect to success page with order number
          const orderNumber = result.data?.order_number || '';
          const redirectUrl = `/confirm-shipping-fee-success?order=${orderId}${orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : ''}`;
          
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to confirm shipping fee. Redirecting...');
          setTimeout(() => {
            router.push(`/orders?error=${encodeURIComponent(result.error || 'confirmation_failed')}`);
          }, 3000);
        }
      } catch (error) {
        console.error('Error confirming shipping fee:', error);
        setStatus('error');
        setMessage('An error occurred. Redirecting...');
        setTimeout(() => {
          router.push('/orders?error=server_error');
        }, 3000);
      }
    };

    confirmShippingFee();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:loading" className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              Confirming Shipping Fee...
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:check-circle" className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              Success!
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:alert-circle" className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
              Error
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Jost, sans-serif' }}>
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

