'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface PayButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}


export default function PayButton({
  amount,
  currency = 'PHP',
  description = 'Payment',
  onSuccess,
  onError,
  className = ''
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async () => {
    setLoading(true);
    
    try {
      // Use Payment Link instead of Payment Intent for better redirect flow
      const response = await fetch('/api/paymongo/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          metadata: {
            source: 'ecommerce-store',
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment link');
      }

      toast.success('Redirecting to payment page...');
      
      // Redirect to PayMongo checkout URL
      // Store payment link ID for callback
      sessionStorage.setItem('paymongo_payment_link_id', data.data.payment_link_id);
      
      // Redirect to PayMongo checkout
      window.location.href = data.data.checkout_url;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error creating payment link:', error);
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        onClick={createPaymentIntent}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating payment...' : `Pay ₱${amount.toFixed(2)}`}
      </button>


      {/* Test Card Info */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">Test Cards:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p><strong>Success:</strong> 4242 4242 4242 4242</p>
          <p><strong>3DS:</strong> 4000 0025 0000 3155</p>
          <p><strong>Declined:</strong> 4000 0000 0000 0002</p>
          <p className="mt-2 text-gray-500">Expiry: Any future date | CVV: Any 3 digits</p>
        </div>
      </div>
    </div>
  );
}

