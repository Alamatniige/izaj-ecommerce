import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/lib/email-service';

// Alternative confirmation approach using profiles table
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get('token');

		console.log('🔍 [V2] Confirmation attempt with token:', token?.substring(0, 10) + '...');

		if (!token) {
			console.log('❌ [V2] No token provided');
			return NextResponse.json({
				success: false,
				error: 'No confirmation token provided'
			}, { status: 400 });
		}

		// Try to find user via profiles table + user_metadata join
		// This is more reliable than listUsers
		const { data: profiles, error: profileError } = await supabaseAdmin
			.from('profiles')
			.select('id, name')
			.limit(100);

		if (profileError) {
			console.error('❌ [V2] Error querying profiles:', profileError);
		}

		console.log(`📊 [V2] Found ${profiles?.length || 0} profiles`);

		// Now check each user's metadata via admin API
		let foundUser = null;

		if (profiles && profiles.length > 0) {
			for (const profile of profiles) {
				try {
					const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
					
					if (userData?.user?.user_metadata?.confirmationToken === token) {
						foundUser = userData.user;
						console.log('✅ [V2] User found:', foundUser.email);
						break;
					}
				} catch (err) {
					// Skip if user not found
					continue;
				}
			}
		}

		if (!foundUser) {
			console.log('❌ [V2] No user found with token');
			return NextResponse.json({
				success: false,
				error: 'Invalid or already used confirmation token'
			}, { status: 400 });
		}

		// Check if token expired
		const expiry = foundUser.user_metadata?.confirmationExpiry;
		if (expiry && new Date() > new Date(expiry)) {
			console.log('⏰ [V2] Token expired');
			return NextResponse.json({
				success: false,
				error: 'Confirmation link has expired'
			}, { status: 400 });
		}

		// Confirm the user
		console.log('📧 [V2] Confirming user email...');
		const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(foundUser.id, {
			email_confirmed_at: new Date().toISOString(),
			user_metadata: {
				...foundUser.user_metadata,
				confirmationToken: null,
				confirmationExpiry: null
			}
		});

		if (updateError) {
			console.error('❌ [V2] Update error:', updateError);
			return NextResponse.json({
				success: false,
				error: 'Failed to confirm email'
			}, { status: 500 });
		}

		console.log('✅ [V2] Email confirmed successfully for:', foundUser.email);

		// Send welcome email
		try {
			const userName = foundUser.user_metadata?.name || 'Valued Customer';
			await emailService.sendWelcomeEmail(foundUser.email, userName);
			console.log('📧 [V2] Welcome email sent to:', foundUser.email);
		} catch (welcomeError) {
			console.error('❌ [V2] Failed to send welcome email:', welcomeError);
			// Don't fail confirmation if welcome email fails
		}

		// Return success JSON (page will handle redirect)
		return NextResponse.json({
			success: true,
			message: 'Email confirmed successfully',
			email: foundUser.email
		}, { status: 200 });

	} catch (err) {
		console.error('[V2] Confirmation error:', err);
		return NextResponse.json({
			success: false,
			error: 'An error occurred while confirming your email'
		}, { status: 500 });
	}
}

