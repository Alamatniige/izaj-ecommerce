import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read for the authenticated user
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update all unread notifications to read
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking notifications as read:', error);
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

