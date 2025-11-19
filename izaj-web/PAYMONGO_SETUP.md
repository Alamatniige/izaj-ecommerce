# PayMongo Integration Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
# PayMongo TEST Keys (for development)
PAYMONGO_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
PAYMONGO_PUBLIC_KEY=pk_test_YOUR_TEST_PUBLIC_KEY
PAYMONGO_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# For production, use LIVE keys:
# PAYMONGO_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
# PAYMONGO_PUBLIC_KEY=pk_live_YOUR_LIVE_PUBLIC_KEY
# PAYMONGO_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
```

## Getting Your Test Keys

1. Go to [PayMongo Dashboard](https://dashboard.paymongo.com/)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Copy your **Test Secret Key** (starts with `sk_test_`)
5. Copy your **Test Public Key** (starts with `pk_test_`)

## Webhook Setup

### For Local Development (using ngrok or similar):

1. Install ngrok: `npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)
2. Start your Next.js app: `npm run dev`
3. In another terminal, run: `ngrok http 3002`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. In PayMongo Dashboard → **Settings** → **Webhooks**
6. Add webhook URL: `https://abc123.ngrok.io/api/webhooks/paymongo`
7. Select events: `payment.paid`, `payment.failed`, `payment.pending`
8. Copy the webhook secret and add to `.env.local`

### For Production:

1. Deploy your Next.js app (Vercel, Netlify, etc.)
2. In PayMongo Dashboard → **Settings** → **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhooks/paymongo`
4. Select events: `payment.paid`, `payment.failed`, `payment.pending`
5. Copy the webhook secret and add to production environment variables

## Test Card Numbers

Use these test cards in PayMongo test mode:

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 0002` | Declined payment |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0127` | Invalid CVC |

**For all test cards:**
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

## Switching to Live Mode

1. Get your **Live API Keys** from PayMongo Dashboard
2. Update `.env.local` with live keys:
   ```env
   PAYMONGO_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
   PAYMONGO_PUBLIC_KEY=pk_live_YOUR_LIVE_PUBLIC_KEY
   ```
3. Set up production webhook (see Webhook Setup above)
4. **Important:** Never commit live keys to git
5. Add live keys to your production environment variables (Vercel, Netlify, etc.)

## Security Best Practices

1. ✅ **Never expose secret keys** in frontend code
2. ✅ **Always use environment variables** for sensitive keys
3. ✅ **Verify webhook signatures** in production
4. ✅ **Use HTTPS** for all webhook endpoints
5. ✅ **Add `.env.local` to `.gitignore`** (should already be there)
6. ✅ **Use test keys** during development
7. ✅ **Rotate keys** if accidentally exposed

## API Routes

- **Create Payment Intent:** `POST /api/paymongo/payment-intent`
- **Webhook Handler:** `POST /api/webhooks/paymongo`

## Frontend Component

Use the `PayButton` component:

```tsx
import PayButton from '@/components/payments/PayButton';

<PayButton
  amount={50}
  currency="PHP"
  description="Test Payment"
  onSuccess={(paymentIntentId) => {
    console.log('Payment successful:', paymentIntentId);
  }}
  onError={(error) => {
    console.error('Payment error:', error);
  }}
/>
```

**Note:** The component will redirect to PayMongo's payment page. After payment, users are redirected back to `/paymongo-callback`.

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to a page with the PayButton component
3. Click "Pay ₱50"
4. Use test card `4242 4242 4242 4242`
5. Check webhook logs in your terminal
6. Verify payment intent creation in PayMongo Dashboard

## Troubleshooting

### "PAYMONGO_SECRET_KEY is not set"
- Make sure `.env.local` exists in project root
- Restart your dev server after adding env variables
- Check that variable name matches exactly

### Webhook not receiving events
- Verify webhook URL is accessible (use ngrok for local)
- Check webhook secret is correct
- Ensure events are selected in PayMongo dashboard
- Check server logs for errors

### Payment form not showing
- Check browser console for errors
- Verify PayMongo script is loading
- Ensure client_key is valid
- Check network tab for API errors

## Support

- [PayMongo Documentation](https://developers.paymongo.com/)
- [PayMongo API Reference](https://developers.paymongo.com/reference)
- [PayMongo Support](https://paymongo.com/contact)

