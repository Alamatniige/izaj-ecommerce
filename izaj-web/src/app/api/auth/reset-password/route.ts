import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type ResetPasswordBody = {
	token?: string;
	password: string;
	confirmPassword: string;
};

// Password strength validation
function validatePassword(password: string): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	if (password.length < 8) {
		errors.push('Password must be at least 8 characters long');
	}
	
	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain at least one uppercase letter');
	}
	
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain at least one lowercase letter');
	}
	
	if (!/\d/.test(password)) {
		errors.push('Password must contain at least one number');
	}
	
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push('Password must contain at least one special character');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<ResetPasswordBody>;
		
		// Validate required fields
		if (!body?.password || !body?.confirmPassword) {
			return NextResponse.json({ 
				error: 'Password and confirm password are required' 
			}, { status: 400 });
		}
		
		// Validate password match
		if (body.password !== body.confirmPassword) {
			return NextResponse.json({ 
				error: 'Passwords do not match' 
			}, { status: 400 });
		}
		
		// Validate password strength
		const passwordValidation = validatePassword(body.password);
		if (!passwordValidation.isValid) {
			return NextResponse.json({ 
				error: 'Password does not meet requirements',
				details: passwordValidation.errors
			}, { status: 400 });
		}

		let userId: string | null = null;

		// Method 1: Token-based reset (from email link with custom token)
		if (body.token) {
			console.log('🔑 Verifying reset token:', body.token.substring(0, 10) + '...');

			// Use profiles-based lookup (same as confirm-v2)
			const { data: profiles } = await supabaseAdmin
				.from('profiles')
				.select('id, name')
				.limit(100);

			console.log(`📊 Found ${profiles?.length || 0} profiles for reset`);

			let user = null;

			if (profiles && profiles.length > 0) {
				for (const profile of profiles) {
					try {
						const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
						
						if (userData?.user?.user_metadata?.resetToken === body.token) {
							user = userData.user;
							console.log('✅ User found with reset token:', user.email);
							break;
						}
					} catch (err) {
						continue;
					}
				}
			}

			if (!user) {
				console.log('❌ No user found with reset token');
				console.log('📝 Token provided:', body.token.substring(0, 20) + '...');
				return NextResponse.json({ 
					error: 'Invalid or expired reset token' 
				}, { status: 400 });
			}

			// Check if token expired
			const expiry = user.user_metadata?.resetTokenExpiry;
			if (expiry && new Date() > new Date(expiry)) {
				console.log('⏰ Reset token expired');
				console.log('   Expired at:', expiry);
				console.log('   Current time:', new Date().toISOString());
				return NextResponse.json({ 
					error: 'Reset link has expired. Please request a new one.' 
				}, { status: 400 });
			}

			console.log('✅ Reset token valid for:', user.email);
			userId = user.id;

			// Clear reset token after use
			await supabaseAdmin.auth.admin.updateUserById(user.id, {
				user_metadata: {
					...user.user_metadata,
					resetToken: null,
					resetTokenExpiry: null
				}
			});
			
			console.log('🗑️ Reset token cleared from user metadata');
		} else {
			// Method 2: Session-based reset (user already logged in via Supabase magic link)
			const supabase = await getSupabaseServerClient();
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError || !user) {
				return NextResponse.json({ 
					error: 'Invalid or expired reset session. Please request a new reset link.' 
				}, { status: 401 });
			}

			userId = user.id;
		}

		if (!userId) {
			return NextResponse.json({ 
				error: 'Unable to verify reset request' 
			}, { status: 401 });
		}
		
		// Update the user's password using admin API
		const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
			password: body.password
		});
		
		if (updateError) {
			console.error('Password update error:', updateError);
			return NextResponse.json({ 
				error: 'Failed to update password. Please try again.' 
			}, { status: 500 });
		}

		console.log('✅ Password updated successfully for user:', userId);
		
		// Log successful password reset
		try {
			await supabaseAdmin
				.from('audit_logs')
				.insert({
					user_id: userId,
					action: 'password_reset_complete',
					details: { method: body.token ? 'custom_token' : 'session_reset' },
					ip_address: request.headers.get('x-forwarded-for') || 'unknown',
					user_agent: request.headers.get('user-agent') || 'unknown'
				});
		} catch (logError) {
			console.error('Audit log error:', logError);
			// Don't fail the request if logging fails
		}
		
		return NextResponse.json({ 
			success: true,
			message: 'Password has been reset successfully. You can now log in with your new password.'
		}, { status: 200 });
		
	} catch (err) {
		console.error('Unexpected reset password error:', err);
		return NextResponse.json({ 
			error: 'An unexpected error occurred' 
		}, { status: 500 });
	}
}
