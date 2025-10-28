import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a Supabase client for client-side operations
 * Used in Client Components for real-time subscriptions
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

