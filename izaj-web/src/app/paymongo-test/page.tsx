'use client';

import PayButton from '@/components/payments/PayButton';

export default function PayMongoTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            PayMongo Payment Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test PayMongo integration with test cards
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Test Payment
              </h2>
              <PayButton
                amount={100}
                currency="PHP"
                description="Test Payment - PayMongo Integration"
                onSuccess={(paymentIntentId) => {
                  console.log('Payment successful!', paymentIntentId);
                  alert(`Payment successful! Payment Intent ID: ${paymentIntentId}`);
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                }}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                <li>Click the "Pay ₱100" button</li>
                <li>Wait for payment intent to be created</li>
                <li>Payment form will open automatically</li>
                <li>Use test card numbers shown below</li>
                <li>Complete the payment to test the flow</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

