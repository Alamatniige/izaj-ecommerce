'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PayMongoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const paymentLinkId = sessionStorage.getItem('paymongo_payment_link_id');
    const pendingOrderId = sessionStorage.getItem('pending_order_id');
    const paymentId = searchParams.get('payment_intent') || searchParams.get('id');
    const statusParam = searchParams.get('status');

    // Check URL parameters for payment status
    if (statusParam === 'paid' || statusParam === 'succeeded' || paymentId) {
      setStatus('success');
      toast.success('Payment successful!');
      
      // If there's a pending order, log it (webhook will update order status)
      if (pendingOrderId) {
        console.log('Order payment completed:', pendingOrderId);
      }
      
      // Clear session storage
      sessionStorage.removeItem('paymongo_payment_link_id');
      sessionStorage.removeItem('paymongo_payment_intent_id');
      sessionStorage.removeItem('pending_order_id');
      sessionStorage.removeItem('pending_order_total');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/orders?order_completed=true&payment=success');
      }, 2000);
    } else if (statusParam === 'failed' || statusParam === 'canceled') {
      setStatus('error');
      toast.error('Payment failed or was canceled');
      
      // Clear session storage
      sessionStorage.removeItem('paymongo_payment_link_id');
      sessionStorage.removeItem('paymongo_payment_intent_id');
      sessionStorage.removeItem('pending_order_id');
      sessionStorage.removeItem('pending_order_total');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/checkout?payment=failed');
      }, 2000);
    } else {
      // Check if redirected from PayMongo (they might redirect without status)
      // Wait a bit to see if status comes through
      setTimeout(() => {
        if (paymentLinkId || paymentId) {
          setStatus('success');
          toast.success('Payment processed!');
          
          // Clear session storage
          if (pendingOrderId) {
            sessionStorage.removeItem('pending_order_id');
            sessionStorage.removeItem('pending_order_total');
          }
          sessionStorage.removeItem('paymongo_payment_link_id');
          sessionStorage.removeItem('paymongo_payment_intent_id');
          
          setTimeout(() => {
            router.push('/orders?order_completed=true&payment=success');
          }, 2000);
        }
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we process your payment.
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600">
              Your payment could not be processed. Please try again.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

