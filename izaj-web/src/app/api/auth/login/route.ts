import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type LoginBody = {
	identifier: string; // email or phone
	password: string;
	rememberMe?: boolean;
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
	
	// Try to find in profiles table first (fastest)
	const { data: profile } = await supabaseAdmin
		.from('profiles')
		.select('id')
		.eq('phone', normalized)
		.maybeSingle();

	if (profile?.id) {
		const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
		return userData?.user?.email || null;
	}

	// Fallback: search in user_metadata (slower but more reliable)
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
		const body = (await request.json()) as Partial<LoginBody>;
		
		if (!body?.identifier || !body?.password) {
			return NextResponse.json({ 
				error: 'Email/phone and password are required' 
			}, { status: 400 });
		}

		const identifier = body.identifier.trim();
		let email = identifier;

		// If identifier looks like a phone, find the associated email
		if (isPhone(identifier)) {
			const foundEmail = await findEmailByPhone(identifier);
			if (!foundEmail) {
				return NextResponse.json({ 
					error: 'Invalid credentials' 
				}, { status: 401 });
			}
			email = foundEmail;
		}

		// Sign in with Supabase
		const supabase = await getSupabaseServerClient();
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.toLowerCase(),
			password: body.password,
		});

		if (error || !data?.user || !data?.session) {
			console.error('Login error:', error);
			return NextResponse.json({ 
				error: 'Invalid credentials' 
			}, { status: 401 });
		}

		// Get user profile data
		let userWithProfile = data.user;
		try {
			const { data: profile } = await supabaseAdmin
				.from('profiles')
				.select('name, phone, profile_picture, user_type')
				.eq('id', data.user.id)
				.maybeSingle();

			if (profile) {
				userWithProfile = {
					...data.user,
					user_metadata: {
						...data.user.user_metadata,
						name: profile.name,
						phone: profile.phone,
						profile_picture: profile.profile_picture,
						user_type: profile.user_type
					}
				};
			}
		} catch (profileError) {
			console.error('Profile fetch error:', profileError);
			// Continue without profile data
		}

		// Create response with session cookies
		const response = NextResponse.json({
			user: userWithProfile,
			session: data.session,
			message: 'Login successful',
			rememberMe: body.rememberMe || false
		}, { status: 200 });

		// Set session cookies
		const maxAge = body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
		
		response.cookies.set('sb-access-token', data.session.access_token, {
			maxAge,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});
		
		response.cookies.set('sb-refresh-token', data.session.refresh_token, {
			maxAge,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});

		return response;

	} catch (err) {
		console.error('Unexpected login error:', err);
		return NextResponse.json({ 
			error: 'An unexpected error occurred' 
		}, { status: 500 });
	}
}
