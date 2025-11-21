'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PayMongoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Log when component mounts
  console.log('🚀 PayMongo Callback Page loaded!');
  console.log('🔍 Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');

  // Function to update order with payment reference
  const updateOrderPaymentReference = async (orderId: string, paymentReference: string | null, paymentLinkId: string | null) => {
    console.log('🔄 updateOrderPaymentReference called:', { orderId, paymentReference, paymentLinkId });
    
    if (!paymentReference) {
      console.log('⚠️ No payment reference provided, trying to fetch from payment link...');
      
      // Try to get payment reference from payment link
      if (paymentLinkId) {
        try {
          console.log('🔍 Fetching payment from link:', paymentLinkId);
          const paymentResponse = await fetch(`/api/paymongo/get-payment?payment_link_id=${paymentLinkId}`);
          const paymentData = await paymentResponse.json();
          
          console.log('📦 Payment data response:', paymentData);
          
          if (paymentData.success && paymentData.data.payment_reference) {
            paymentReference = paymentData.data.payment_reference;
            console.log('✅ Found payment reference from payment link:', paymentReference);
          } else {
            console.error('❌ No payment reference in response:', paymentData);
          }
        } catch (error) {
          console.error('❌ Error fetching payment from link:', error);
        }
      } else {
        console.error('❌ No payment link ID available');
      }
    }

    if (!paymentReference) {
      console.error('❌ Could not find payment reference - cannot update order');
      console.error('❌ Debug info:', { orderId, paymentReference, paymentLinkId });
      return;
    }

    try {
      console.log('🔄 Updating order with payment reference:', { orderId, paymentReference });
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_reference: paymentReference
          // Do NOT set payment_status to 'paid' automatically - admin will mark as paid
        })
      });

      const data = await response.json();
      console.log('📦 Update order response:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('✅ Order updated with payment reference successfully!', data);
      } else {
        console.error('❌ Failed to update order:', data);
      }
    } catch (error) {
      console.error('❌ Error updating order payment reference:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered in PayMongo Callback Page');
    
    const paymentLinkId = sessionStorage.getItem('paymongo_payment_link_id');
    const pendingOrderId = sessionStorage.getItem('pending_order_id');
    
    console.log('📦 Session Storage:', {
      paymentLinkId,
      pendingOrderId,
      allSessionStorage: typeof window !== 'undefined' ? {
        paymongo_payment_link_id: sessionStorage.getItem('paymongo_payment_link_id'),
        pending_order_id: sessionStorage.getItem('pending_order_id'),
        pending_order_total: sessionStorage.getItem('pending_order_total')
      } : 'SSR'
    });
    
    // Log all URL params for debugging
    console.log('🔍 PayMongo Callback URL Params:', {
      allParams: Object.fromEntries(searchParams.entries()),
      payment_intent: searchParams.get('payment_intent'),
      id: searchParams.get('id'),
      payment_id: searchParams.get('payment_id'),
      status: searchParams.get('status'),
      fullUrl: typeof window !== 'undefined' ? window.location.href : 'SSR'
    });
    
    // Try multiple possible parameter names for payment reference
    const paymentId = 
      searchParams.get('payment_intent') || 
      searchParams.get('id') || 
      searchParams.get('payment_id') ||
      searchParams.get('payment_intent_id');
    const statusParam = searchParams.get('status');

    // Check URL parameters for payment status
    if (statusParam === 'paid' || statusParam === 'succeeded' || paymentId) {
      setStatus('success');
      toast.success('Payment successful!');
      
      console.log('✅ Payment successful - updating order...', {
        pendingOrderId,
        paymentId,
        paymentLinkId
      });
      
      // Update order with payment reference if we have order ID
      // Don't clear sessionStorage until after update
      if (pendingOrderId) {
        // Try to update with payment ID from URL, or fetch from payment link
        updateOrderPaymentReference(pendingOrderId, paymentId, paymentLinkId).then(() => {
          // Clear session storage after update attempt
          sessionStorage.removeItem('paymongo_payment_link_id');
          sessionStorage.removeItem('paymongo_payment_intent_id');
          sessionStorage.removeItem('pending_order_id');
          sessionStorage.removeItem('pending_order_total');
        });
      } else {
        console.error('❌ No pending order ID found in sessionStorage');
        // Clear session storage even if no order ID
        sessionStorage.removeItem('paymongo_payment_link_id');
        sessionStorage.removeItem('paymongo_payment_intent_id');
        sessionStorage.removeItem('pending_order_id');
        sessionStorage.removeItem('pending_order_total');
      }
      
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
      // Try to check payment status from payment link
      console.log('⚠️ No status in URL, checking payment link status...');
      
      if (paymentLinkId && pendingOrderId) {
        // Fetch payment link to check status
        fetch(`/api/paymongo/get-payment?payment_link_id=${paymentLinkId}`)
          .then(res => res.json())
          .then(paymentData => {
            console.log('📦 Payment link status check:', paymentData);
            
            // Check if payment was successful based on payment link data
            const hasPayments = paymentData.success && paymentData.data?.payments?.length > 0;
            
            if (hasPayments || paymentData.data?.payment_reference) {
              setStatus('success');
              toast.success('Payment processed!');
              
              // Update order with payment reference
              updateOrderPaymentReference(
                pendingOrderId, 
                paymentData.data?.payment_reference || paymentId, 
                paymentLinkId
              ).then(() => {
                // Clear session storage after update
                sessionStorage.removeItem('paymongo_payment_link_id');
                sessionStorage.removeItem('paymongo_payment_intent_id');
                sessionStorage.removeItem('pending_order_id');
                sessionStorage.removeItem('pending_order_total');
              });
              
              setTimeout(() => {
                router.push('/orders?order_completed=true&payment=success');
              }, 2000);
            } else {
              // Still processing or unknown status
              console.log('⏳ Payment status unknown, assuming success if redirected...');
              setStatus('success');
              toast.success('Payment processed!');
              
              if (pendingOrderId) {
                updateOrderPaymentReference(pendingOrderId, paymentId, paymentLinkId).then(() => {
                  sessionStorage.removeItem('paymongo_payment_link_id');
                  sessionStorage.removeItem('paymongo_payment_intent_id');
                  sessionStorage.removeItem('pending_order_id');
                  sessionStorage.removeItem('pending_order_total');
                });
              }
              
              setTimeout(() => {
                router.push('/orders?order_completed=true&payment=success');
              }, 2000);
            }
          })
          .catch(error => {
            console.error('❌ Error checking payment status:', error);
            // Assume success if we got redirected here
            setStatus('success');
            toast.success('Payment processed!');
            
            if (pendingOrderId) {
              updateOrderPaymentReference(pendingOrderId, paymentId, paymentLinkId).then(() => {
                sessionStorage.removeItem('paymongo_payment_link_id');
                sessionStorage.removeItem('paymongo_payment_intent_id');
                sessionStorage.removeItem('pending_order_id');
                sessionStorage.removeItem('pending_order_total');
              });
            }
            
            setTimeout(() => {
              router.push('/orders?order_completed=true&payment=success');
            }, 2000);
          });
      } else {
        // No payment link ID, just assume success if redirected
        console.log('⚠️ No payment link ID, assuming success...');
        setStatus('success');
        toast.success('Payment processed!');
        
        if (pendingOrderId) {
          updateOrderPaymentReference(pendingOrderId, paymentId, paymentLinkId).then(() => {
            sessionStorage.removeItem('paymongo_payment_link_id');
            sessionStorage.removeItem('paymongo_payment_intent_id');
            sessionStorage.removeItem('pending_order_id');
            sessionStorage.removeItem('pending_order_total');
          });
        }
        
        setTimeout(() => {
          router.push('/orders?order_completed=true&payment=success');
        }, 2000);
      }
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

