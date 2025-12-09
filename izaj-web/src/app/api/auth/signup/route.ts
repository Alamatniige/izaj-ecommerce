import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/lib/email-service';
import { randomBytes } from 'crypto';

type SignupBody = {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: {
		province: string;
		city: string;
		barangay: string;
		address: string;
	};
};

// Simple phone normalization - convert to PH format (63XXXXXXXXXX)
function normalizePhone(phone: string): string | null {
	if (!phone) return null;
	
	const digits = phone.replace(/\D/g, '');
	if (digits.length < 10 || digits.length > 13) return null;
	
	// Convert to 63XXXXXXXXXX format
	if (digits.length === 10 && digits.startsWith('9')) {
		return `63${digits}`; // 9XXXXXXXXX -> 639XXXXXXXXX
	} else if (digits.length === 11 && digits.startsWith('0')) {
		return `63${digits.slice(1)}`; // 09XXXXXXXXX -> 639XXXXXXXXX
	} else if (digits.length === 12 && digits.startsWith('63')) {
		return digits; // Already in correct format
	}
	
	return null;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<SignupBody>;
		
		// Validate required fields
		if (!body?.email || !body?.password) {
			return NextResponse.json({ 
				error: 'Email and password are required' 
			}, { status: 400 });
		}

		// Basic email validation
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
			return NextResponse.json({ 
				error: 'Invalid email format' 
			}, { status: 400 });
		}

		// Prepare user metadata
		const fullName = [body.firstName, body.lastName].filter(Boolean).join(' ').trim() || 'User';
		const normalizedPhone = body.phone ? normalizePhone(body.phone) : null;

		// Create user using Admin API to bypass Supabase's email sending
		// We use our custom email service with templates from email-templates.ts
		const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
			email: body.email.trim().toLowerCase(),
			password: body.password,
			email_confirm: false, // Don't auto-confirm, user needs to confirm via our custom email
			user_metadata: {
				name: fullName,
				firstName: (body.firstName || '').trim(),
				lastName: (body.lastName || '').trim(),
				phone: normalizedPhone,
				emailConfirmed: false,
			}
		});

		if (createError) {
			console.error('Supabase Admin CreateUser error:', createError);
			console.error('Error details:', JSON.stringify(createError, null, 2));
			
			// Handle specific error cases
			if (createError.message.includes('already registered') || 
			    createError.message.includes('User already registered') ||
			    createError.message.includes('already exists')) {
				return NextResponse.json({ 
					error: 'An account with this email already exists',
					code: 'user_exists'
				}, { status: 400 });
			}
			
			// Return error for other cases
			return NextResponse.json({ 
				error: createError.message || 'Signup failed',
				details: createError.status || 'Unknown error'
			}, { status: 400 });
		}

		if (!createdUser?.user) {
			return NextResponse.json({ 
				error: 'Failed to create user'
			}, { status: 500 });
		}

		const userData = { user: createdUser.user };

		// Create profile in profiles table using admin client
		// (We use admin to bypass RLS policies during signup)
		try {
			// Small delay to ensure auth.users entry is fully committed
			await new Promise(resolve => setTimeout(resolve, 200));

			// Check if profile already exists (might be created by trigger)
			const { data: existingProfile, error: checkError } = await supabaseAdmin
				.from('profiles')
				.select('id')
				.eq('id', userData.user.id)
				.maybeSingle();

			if (checkError) {
				console.error('Error checking existing profile:', checkError);
			}

			if (existingProfile) {
				// Update existing profile
				console.log('Profile exists, updating...');
				const { error: updateError } = await supabaseAdmin
					.from('profiles')
					.update({
						name: fullName,
						phone: normalizedPhone,
						user_type: 'customer',
						updated_at: new Date().toISOString()
					})
					.eq('id', userData.user.id);
				
				if (updateError) {
					console.error('Profile update error:', updateError);
				}
			} else {
				// Insert new profile
				console.log('Creating new profile for user:', userData.user.id);
				const { error: insertError } = await supabaseAdmin
					.from('profiles')
					.insert({
						id: userData.user.id,
						name: fullName,
						phone: normalizedPhone,
						user_type: 'customer',
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					});
				
				if (insertError) {
					console.error('Profile insert error:', insertError);
					console.error('Insert error details:', JSON.stringify(insertError, null, 2));
				}
			}

			// Create default address if provided
			if (body.address && body.address.province && body.address.city && body.address.barangay && body.address.address) {
				const fullAddress = `${body.address.address.trim()}, ${body.address.barangay.trim()}, ${body.address.city.trim()}, ${body.address.province.trim()}`;
				
				const { data: addressData, error: addressError } = await supabaseAdmin
					.from('user_addresses')
					.insert({
						user_id: userData.user.id,
						name: fullName,
						phone: normalizedPhone || '',
						address: fullAddress,
						is_default: true,
						is_active: true
					});
				
				if (addressError) {
					console.error('Address creation error:', addressError);
				}
			}
		} catch (profileError) {
			console.error('Profile creation error (caught):', profileError);
			// Don't fail the signup if profile creation fails
			// The user is already created in auth.users
		}

		// Send custom confirmation email via Gmail SMTP
		let emailSent = false;
		try {
			const confirmationToken = randomBytes(32).toString('hex');
			console.log('🔑 Generated confirmation token:', confirmationToken.substring(0, 10) + '...');
			
			// Store token in user metadata for verification
			const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userData.user.id, {
				user_metadata: {
					name: fullName,
					firstName: (body.firstName || '').trim(),
					lastName: (body.lastName || '').trim(),
					phone: normalizedPhone,
					emailConfirmed: false,
					confirmationToken,
					confirmationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
				}
			});

			if (updateError) {
				console.error('❌ Failed to save confirmation token:', updateError);
				throw updateError;
			}

			console.log('💾 Token saved to user metadata for user:', userData.user.email);

			// Small delay to ensure metadata is committed
			await new Promise(resolve => setTimeout(resolve, 100));

			// Send email using your Gmail SMTP
			await emailService.sendConfirmationEmail(
				body.email,
				confirmationToken,
				fullName
			);
			
			emailSent = true;
			console.log('✅ Confirmation email sent to:', body.email);
			console.log('📧 Confirmation URL:', `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm-email?token=${confirmationToken.substring(0, 10)}...`);
		} catch (emailError) {
			console.error('❌ Email/Token error:', emailError);
			// Don't fail signup if email fails
		}

		return NextResponse.json({ 
			user: userData.user,
			message: 'Account created successfully! Please check your email to verify your account.',
			emailSent
		}, { status: 200 });

	} catch (err) {
		console.error('Unexpected signup error:', err);
		return NextResponse.json({ 
			error: 'An unexpected error occurred. Please try again.'
		}, { status: 500 });
	}
}
