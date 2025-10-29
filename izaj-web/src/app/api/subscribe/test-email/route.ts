import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

/**
 * Test endpoint to check if email service is working
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || 'test@example.com';

    console.log('🧪 Testing email service...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Set ✓' : 'Not set ✗');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'Set ✓' : 'Not set ✗');

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: 'Gmail credentials not configured',
        details: {
          GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'Missing',
          GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Missing'
        },
        fix: 'Add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file'
      }, { status: 400 });
    }

    // Try to send a test email
    await emailService.sendNewsletterWelcomeEmail(testEmail, false);

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
      check: 'Please check your inbox (and spam folder)'
    });

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

