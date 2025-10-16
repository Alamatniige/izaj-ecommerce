import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/lib/email-service';
import { randomBytes } from 'crypto';

type ForgotPasswordBody = {
	identifier: string; // email or phone
};

// Check if string looks like a phone number
function isPhone(value: string): boolean {
	const digits = value.replace(/\D/g, '');
	return digits.length >= 10 && digits.length <= 13 && /^[+\d\s\-()]+$/.test(value);
}

// Normalize phone to 63XXXXXXXXXX format
function normalizePhone(phone: string): string {
	const digits = phone.replace(/\D/g, '');
	
	if (digits.length === 10 && digits.startsWith('9')) {
		return `63${digits}`;
	} else if (digits.length === 11 && digits.startsWith('0')) {
		return `63${digits.slice(1)}`;
	} else if (digits.length === 12 && digits.startsWith('63')) {
		return digits;
	}
	
	return digits;
}

// Find email by phone number
async function findEmailByPhone(phone: string): Promise<string | null> {
	const normalized = normalizePhone(phone);
	
	// Try profiles table first
	const { data: profile } = await supabaseAdmin
		.from('profiles')
		.select('id')
		.eq('phone', normalized)
		.maybeSingle();

	if (profile?.id) {
		const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
		return userData?.user?.email || null;
	}

	// Fallback: search in user_metadata
	const { data: users } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 1000
	});

	const user = users?.users?.find(u => {
		const metaPhone = u?.user_metadata?.phone;
		if (!metaPhone) return false;
		
		const metaNormalized = normalizePhone(metaPhone.toString());
		return metaNormalized === normalized;
	});

	return user?.email || null;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<ForgotPasswordBody>;
		
		console.log('🔍 Forgot password request for:', body?.identifier);
		
		if (!body?.identifier) {
			return NextResponse.json({ 
				error: 'Email or phone is required' 
			}, { status: 400 });
		}

		const identifier = body.identifier.trim();
		let email = identifier;

		// If identifier looks like a phone, find the associated email
		if (isPhone(identifier)) {
			console.log('📱 Detected phone number, looking up email...');
			const foundEmail = await findEmailByPhone(identifier);
			if (!foundEmail) {
				console.log('❌ No user found with phone:', identifier);
				// Don't reveal if user exists for security
				return NextResponse.json({ 
					message: 'If an account with that email or phone exists, we\'ve sent a password reset link.'
				}, { status: 200 });
			}
			email = foundEmail;
			console.log('✅ Found email for phone:', email);
		}

		// Try alternative method: Query profiles table first
		console.log('🔍 Looking for user with email:', email);
		
		// Method 1: Try profiles table (more reliable)
		const { data: profiles } = await supabaseAdmin
			.from('profiles')
			.select('id, name')
			.limit(100);

		console.log(`📊 Found ${profiles?.length || 0} profiles in database`);

		let user = null;
		
		if (profiles && profiles.length > 0) {
			// Find user by checking each profile's auth data
			for (const profile of profiles) {
				try {
					const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
					if (userData?.user?.email?.toLowerCase() === email.toLowerCase()) {
						user = userData.user;
						console.log('✅ User found:', user.email);
						break;
					}
				} catch (err) {
					continue;
				}
			}
		}

		if (!user) {
			console.log('❌ No user found with email:', email);
			// Don't reveal if user exists for security
			return NextResponse.json({ 
				message: 'If an account with that email or phone exists, we\'ve sent a password reset link.'
			}, { status: 200 });
		}

		// Generate custom reset token
		const resetToken = randomBytes(32).toString('hex');
		const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

		console.log('🔑 Generated reset token for:', user.email);

		// Store reset token in user metadata
		const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
			user_metadata: {
				...user.user_metadata,
				resetToken,
				resetTokenExpiry: resetExpiry.toISOString()
			}
		});

		if (updateError) {
			console.error('❌ Failed to save reset token:', updateError);
			// Continue anyway, don't reveal error
		} else {
			console.log('💾 Reset token saved for user:', user.email);
		}

		// Send password reset email via Gmail SMTP
		try {
			const userName = user.user_metadata?.name || 'User';
			await emailService.sendPasswordResetEmail(email, resetToken, userName);
			console.log('✅ Password reset email sent to:', email);
		} catch (emailError) {
			console.error('❌ Failed to send reset email:', emailError);
			// Don't reveal error for security
		}

		// Log the attempt for audit
		try {
			await supabaseAdmin
				.from('audit_logs')
				.insert({
					user_id: email,
					action: 'password_reset_request',
					details: { 
						method: isPhone(identifier) ? 'phone' : 'email',
						success: true
					},
					ip_address: request.headers.get('x-forwarded-for') || 'unknown',
					user_agent: request.headers.get('user-agent') || 'unknown'
				});
			console.log('📝 Audit log created');
		} catch (logError) {
			console.error('❌ Audit log error:', logError);
			// Don't fail the request if logging fails
		}

		// Always return success message for security (don't reveal if user exists)
		return NextResponse.json({ 
			message: 'If an account with that email or phone exists, we\'ve sent a password reset link.'
		}, { status: 200 });

	} catch (err) {
		console.error('Unexpected forgot password error:', err);
		return NextResponse.json({ 
			error: 'An unexpected error occurred' 
		}, { status: 500 });
	}
}
