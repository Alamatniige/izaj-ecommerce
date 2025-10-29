import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .update({ 
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Reactivate subscription error:', updateError);
          return NextResponse.json(
            { success: false, error: 'Failed to reactivate subscription. Please try again.' },
            { status: 500 }
          );
        }

        // Send welcome back email
        try {
          console.log('📧 Attempting to send welcome back email to:', normalizedEmail);
          await emailService.sendNewsletterWelcomeEmail(normalizedEmail, true);
          console.log('✅ Welcome back email sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send welcome back email:', emailError);
          console.error('Email error details:', {
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            gmailUser: process.env.GMAIL_USER ? 'Set' : 'NOT SET',
            gmailPassword: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'NOT SET'
          });
          // Don't fail the request if email fails
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.'
        });
      }
    }

    // Insert new subscriber
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
        is_active: true,
        notification_preferences: {
          new_products: true,
          sales: true
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Subscription error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      console.log('📧 Attempting to send welcome email to:', normalizedEmail);
      await emailService.sendNewsletterWelcomeEmail(normalizedEmail, false);
      console.log('✅ Welcome email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      console.error('Email error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        gmailUser: process.env.GMAIL_USER ? 'Set' : 'NOT SET',
        gmailPassword: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'NOT SET'
      });
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to the IZAJ Family! You are now subscribed to our newsletter.'
    });

  } catch (error) {
    console.error('Unexpected subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

