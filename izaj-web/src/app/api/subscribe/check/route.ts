import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { isSubscribed: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('is_active')
      .eq('email', normalizedEmail)
      .single();

    return NextResponse.json({
      isSubscribed: data?.is_active || false
    });

  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { isSubscribed: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

