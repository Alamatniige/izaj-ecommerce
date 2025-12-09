# Production Environment Variables

Reference checklist for deploying the two apps.

## Railway – Admin/API (`izaj-desktop/izaj-desktop/backend/nodejs`)
Set these in Railway project variables:
- `NODE_ENV=production`
- `PORT` (Railway provides) and `HOST=0.0.0.0`
- `RAILWAY_PUBLIC_DOMAIN` (Railway provides; used for API base)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (service role)
- `SUPABASE_ANON_KEY` (if any anon usage)
- `SUPABASE_PRODUCT_URL`
- `SUPABASE_PRODUCT_KEY` (product DB)
- `FRONTEND_URL` (admin UI base; e.g., https://admin.yourdomain.com)
- `WEB_APP_URL` or `NEXT_PUBLIC_APP_URL` (customer site base; also for CORS/emails)
- `PYTHON_SERVICE_URL` (if the Python service is deployed separately)
- `PASSWORD_RESET_REDIRECT_URL` (optional override for reset links)
- Email/SMS:
  - `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
  - or Gmail fallback: `GMAIL_USER`, `GMAIL_APP_PASSWORD`
  - (If used) `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- Maintenance bootstrap (if script used):
  - `IT_MAINTENANCE_EMAIL`, `IT_MAINTENANCE_PASSWORD`

## Vercel – Ecommerce Web (`izaj-ecommerce/izaj-web`)
Set these in Vercel project environment variables:
- Public (NEXT_PUBLIC) for browser and server:
  - `NEXT_PUBLIC_APP_URL` (site URL, e.g., https://izaj-ecommerce.vercel.app)
  - `NEXT_PUBLIC_API_URL` (if API is separate; otherwise app URL + /api)
  - `NEXT_PUBLIC_SOCKET_URL` (point to Railway socket server, e.g., https://<railway-domain>)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_PRODUCT_URL`
  - `NEXT_PUBLIC_SITE_URL` (used in PayMongo callbacks; match site URL)
- Server-only secrets:
  - `SUPABASE_SERVICE_ROLE_KEY` (for webhooks needing elevated access)
  - `SUPABASE_PRODUCT_SERVICE_KEY` (if server-side product DB access)
  - `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`
  - `GMAIL_USER`, `GMAIL_APP_PASSWORD` (transactional emails)
  - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (if SMS used)
  - `NEWSLETTER_API_KEY` (for protected newsletter endpoint)
  - `DESKTOP_BACKEND_URL` (admin API base on Railway)

## Quick wiring
- Use the Railway deployed domain for `NEXT_PUBLIC_SOCKET_URL` and `DESKTOP_BACKEND_URL`.
- Use the Vercel production URL for `NEXT_PUBLIC_APP_URL` (and `NEXT_PUBLIC_SITE_URL`).
- Ensure Supabase URLs/keys are set for both main and product projects (anon + service).
- Pick one email path (SendGrid or Gmail) and provide the required keys.

