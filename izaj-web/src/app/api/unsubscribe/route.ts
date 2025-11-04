import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { createSystemNotification } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email exists
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Email not found in our subscription list.' },
        { status: 404 }
      );
    }

    if (!existing.is_active) {
      return NextResponse.json(
        { success: false, error: 'This email is already unsubscribed.' },
        { status: 400 }
      );
    }

    // Unsubscribe (soft delete)
    const { error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({ 
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', normalizedEmail);

    if (error) {
      console.error('Unsubscribe error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    // Create a user notification if authenticated
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await createSystemNotification(
          user.id,
          'Newsletter Unsubscribed',
          'You have been successfully unsubscribed from our newsletter.'
        );
      }
    } catch (notifyErr) {
      console.error('Failed to create unsubscribe notification:', notifyErr);
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
    });

  } catch (error) {
    console.error('Unexpected unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

