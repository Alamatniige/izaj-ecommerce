import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

// Test endpoint to verify Gmail SMTP is working
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get('email');

		if (!email) {
			return NextResponse.json({ 
				error: 'Email parameter required. Usage: /api/test-email?email=your@email.com' 
			}, { status: 400 });
		}

		console.log('📧 Testing email send to:', email);

		// Test with a simple password reset email
		const testToken = 'test-token-123';
		await emailService.sendPasswordResetEmail(email, testToken, 'Test User');

		console.log('✅ Test email sent successfully!');

		return NextResponse.json({
			success: true,
			message: 'Test email sent! Check your inbox.',
			email: email
		});

	} catch (error) {
		console.error('❌ Email test failed:', error);
		return NextResponse.json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to send test email',
			details: error
		}, { status: 500 });
	}
}

