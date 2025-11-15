import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// GET /api/addresses/default - Get default address
export async function GET(_request: NextRequest) {
  try {
    // Get user from Supabase session (cookies)
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get default address directly from the database
    const { data: defaultAddress, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default address:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch default address',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      address: defaultAddress || null 
    });

  } catch (error) {
    console.error('Error in GET /api/addresses/default:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/addresses/default - Set address as default
export async function POST(request: NextRequest) {
  try {
    // Get user from Supabase session (cookies)
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { address_id } = body;

    if (!address_id) {
      return NextResponse.json({ 
        error: 'Address ID is required' 
      }, { status: 400 });
    }

    // First, verify the address exists and belongs to the user
    const { data: addressToUpdate, error: fetchError } = await supabase
      .from('user_addresses')
      .select('id, user_id, is_active')
      .eq('id', address_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (fetchError || !addressToUpdate) {
      return NextResponse.json({ 
        error: 'Address not found or access denied' 
      }, { status: 404 });
    }

    // Set all addresses for this user to is_default = false
    const { error: clearError } = await supabase
      .from('user_addresses')
      .update({ 
        is_default: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (clearError) {
      console.error('Error clearing default addresses:', clearError);
      return NextResponse.json({ 
        error: 'Failed to clear default addresses',
        details: clearError.message 
      }, { status: 500 });
    }

    // Set the selected address as default
    const { data: updatedAddress, error: updateError } = await supabase
      .from('user_addresses')
      .update({ 
        is_default: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', address_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error setting default address:', updateError);
      return NextResponse.json({ 
        error: 'Failed to set default address',
        details: updateError.message 
      }, { status: 500 });
    }

    if (!updatedAddress) {
      return NextResponse.json({ 
        error: 'Address not found or access denied' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      address: updatedAddress 
    });

  } catch (error) {
    console.error('Error in POST /api/addresses/default:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
