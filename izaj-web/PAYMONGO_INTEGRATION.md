# PayMongo Integration - Complete Package

## 📁 Folder Structure

```
izaj-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── paymongo/
│   │   │   │   └── payment-intent/
│   │   │   │       └── route.ts          # Creates payment intent
│   │   │   └── webhooks/
│   │   │       └── paymongo/
│   │   │           └── route.ts          # Webhook handler
│   │   ├── paymongo-test/
│   │   │   └── page.tsx                  # Test page
│   │   └── paymongo-callback/
│   │       └── page.tsx                  # Payment callback page
│   ├── components/
│   │   └── payments/
│   │       └── PayButton.tsx             # Payment button component
│   └── lib/
│       └── paymongo.ts                   # PayMongo utilities
├── PAYMONGO_SETUP.md                     # Setup instructions
└── PAYMONGO_INTEGRATION.md               # This file
```

## 🔑 Environment Variables

Create `.env.local` in project root:

```env
# PayMongo TEST Keys
PAYMONGO_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
PAYMONGO_PUBLIC_KEY=pk_test_YOUR_TEST_PUBLIC_KEY
PAYMONGO_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Optional: Public key for frontend (if needed)
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_YOUR_TEST_PUBLIC_KEY
```

## 🚀 Quick Start

1. **Get Test Keys:**
   - Sign up at [PayMongo Dashboard](https://dashboard.paymongo.com/)
   - Go to Settings → API Keys
   - Copy Test Secret Key and Test Public Key

2. **Add to `.env.local`:**
   ```env
   PAYMONGO_SECRET_KEY=sk_test_...
   PAYMONGO_PUBLIC_KEY=pk_test_...
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Test Payment:**
   - Navigate to `http://localhost:3002/paymongo-test`
   - Click "Pay ₱50"
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)

## 📝 API Routes

### 1. Create Payment Intent
**Endpoint:** `POST /api/paymongo/payment-intent`

**Request:**
```json
{
  "amount": 50,
  "currency": "PHP",
  "description": "Test Payment",
  "metadata": {
    "order_id": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "client_key": "pi_xxx",
    "payment_intent_id": "pi_xxx",
    "amount": 50,
    "currency": "PHP",
    "mode": "test"
  }
}
```

### 2. Webhook Handler
**Endpoint:** `POST /api/webhooks/paymongo`

**Events Handled:**
- `payment.paid` - Payment successful
- `payment.failed` - Payment failed
- `payment.pending` - Payment pending

## 🧪 Test Cards

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |
| `4000 0000 0000 0002` | ❌ Declined payment |
| `4000 0000 0000 9995` | 💰 Insufficient funds |
| `4000 0000 0000 0069` | ⏰ Expired card |
| `4000 0000 0000 0127` | 🔒 Invalid CVC |

**For all cards:**
- Expiry: Any future date
- CVV: Any 3 digits
- ZIP: Any 5 digits

## 🔄 Payment Flow

1. User clicks "Pay ₱50"
2. Frontend calls `/api/paymongo/payment-intent`
3. Backend creates payment intent with PayMongo API
4. Backend returns `client_key` to frontend
5. Frontend redirects to PayMongo payment page
6. User completes payment on PayMongo
7. PayMongo redirects to `/paymongo-callback`
8. Webhook receives payment event
9. Order status updated (if integrated)

## 🔐 Security

✅ **Implemented:**
- Secret keys stored in environment variables
- Webhook signature verification (when secret is set)
- Server-side payment intent creation
- No secret keys exposed to frontend

⚠️ **Best Practices:**
- Never commit `.env.local` to git
- Use test keys for development
- Verify webhook signatures in production
- Use HTTPS for all webhook endpoints

## 🌐 Webhook Setup

### Local Development (ngrok)

1. Install ngrok: `npm install -g ngrok`
2. Start dev server: `npm run dev`
3. In another terminal: `ngrok http 3002`
4. Copy HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. In PayMongo Dashboard → Settings → Webhooks
6. Add URL: `https://abc123.ngrok.io/api/webhooks/paymongo`
7. Select events: `payment.paid`, `payment.failed`, `payment.pending`
8. Copy webhook secret to `.env.local`

### Production

1. Deploy your app (Vercel, Netlify, etc.)
2. In PayMongo Dashboard → Settings → Webhooks
3. Add URL: `https://yourdomain.com/api/webhooks/paymongo`
4. Select events and copy webhook secret
5. Add to production environment variables

## 🔄 Switching to Live Mode

1. Get Live API Keys from PayMongo Dashboard
2. Update `.env.local`:
   ```env
   PAYMONGO_SECRET_KEY=sk_live_...
   PAYMONGO_PUBLIC_KEY=pk_live_...
   ```
3. Set up production webhook
4. **Never commit live keys to git**
5. Add to production environment variables

## 📦 Files Created

1. **`src/app/api/paymongo/payment-intent/route.ts`**
   - Creates payment intent
   - Returns client_key

2. **`src/app/api/webhooks/paymongo/route.ts`**
   - Handles webhook events
   - Verifies signatures
   - Logs events

3. **`src/components/payments/PayButton.tsx`**
   - Payment button component
   - Creates payment intent
   - Redirects to PayMongo

4. **`src/app/paymongo-test/page.tsx`**
   - Test page for payments

5. **`src/app/paymongo-callback/page.tsx`**
   - Payment callback handler

6. **`src/lib/paymongo.ts`**
   - PayMongo utility functions

## 🐛 Troubleshooting

### "PAYMONGO_SECRET_KEY is not set"
- Check `.env.local` exists
- Restart dev server
- Verify variable name matches exactly

### Payment form not redirecting
- Check browser console for errors
- Verify payment intent was created
- Check network tab for API errors

### Webhook not receiving events
- Verify webhook URL is accessible
- Check webhook secret is correct
- Ensure events are selected in dashboard
- Check server logs

## 📚 Resources

- [PayMongo Documentation](https://developers.paymongo.com/)
- [PayMongo API Reference](https://developers.paymongo.com/reference)
- [PayMongo Support](https://paymongo.com/contact)

## ✅ Checklist

- [x] Payment intent creation API
- [x] Webhook handler
- [x] Frontend payment component
- [x] Test page
- [x] Callback page
- [x] Environment setup
- [x] Documentation
- [x] Test card numbers
- [x] Security best practices

## 🎯 Next Steps

1. Integrate with order system
2. Update order status on webhook events
3. Add payment history
4. Implement retry logic
5. Add payment notifications

---

**Ready for capstone demo!** 🚀

