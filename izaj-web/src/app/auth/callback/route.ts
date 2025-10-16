import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code');
	const next = searchParams.get('next') ?? '/';
	const type = searchParams.get('type');

	if (code) {
		const supabase = await getSupabaseServerClient();
		
		// Exchange code for session
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (error) {
			console.error('Auth callback error:', error);
			
			// Redirect to error page or login
			return NextResponse.redirect(
				new URL('/login?error=auth_callback_failed', request.url)
			);
		}

		// Handle different callback types
		if (type === 'recovery') {
			// Password reset flow - redirect to reset password page
			return NextResponse.redirect(new URL('/reset-password', request.url));
		}

		// Email confirmation or regular callback - redirect to success page or next URL
		if (type === 'signup' || searchParams.get('confirmation') === 'true') {
			return NextResponse.redirect(
				new URL('/login?confirmed=true', request.url)
			);
		}

		// Default redirect
		return NextResponse.redirect(new URL(next, request.url));
	}

	// No code provided, redirect to login
	return NextResponse.redirect(new URL('/login', request.url));
}
