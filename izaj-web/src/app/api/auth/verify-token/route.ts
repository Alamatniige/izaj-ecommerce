import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Debug endpoint to check if token exists
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get('token');
		const email = searchParams.get('email');

		if (!token && !email) {
			return NextResponse.json({ 
				error: 'Provide token or email' 
			}, { status: 400 });
		}

		const { data: users } = await supabaseAdmin.auth.admin.listUsers();
		
		if (token) {
			// Search by token
			const user = users?.users?.find(u => 
				u.user_metadata?.confirmationToken === token
			);

			if (user) {
				return NextResponse.json({
					found: true,
					email: user.email,
					hasToken: !!user.user_metadata?.confirmationToken,
					tokenMatch: user.user_metadata?.confirmationToken === token,
					expiry: user.user_metadata?.confirmationExpiry,
					confirmed: !!user.email_confirmed_at,
					metadata: user.user_metadata
				});
			} else {
				return NextResponse.json({
					found: false,
					message: 'No user found with that token',
					totalUsers: users?.users?.length || 0,
					usersWithTokens: users?.users?.filter(u => u.user_metadata?.confirmationToken).length || 0
				});
			}
		}

		if (email) {
			// Search by email
			const user = users?.users?.find(u => u.email === email);

			if (user) {
				return NextResponse.json({
					found: true,
					email: user.email,
					hasToken: !!user.user_metadata?.confirmationToken,
					token: user.user_metadata?.confirmationToken?.substring(0, 10) + '...',
					expiry: user.user_metadata?.confirmationExpiry,
					confirmed: !!user.email_confirmed_at,
					metadata: user.user_metadata
				});
			} else {
				return NextResponse.json({
					found: false,
					message: 'No user found with that email'
				});
			}
		}

	} catch (err) {
		console.error('Verify token error:', err);
		return NextResponse.json({ 
			error: 'Internal error',
			details: err instanceof Error ? err.message : 'Unknown error'
		}, { status: 500 });
	}
}

