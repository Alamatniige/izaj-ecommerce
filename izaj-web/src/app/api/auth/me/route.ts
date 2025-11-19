import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const supabase = await getSupabaseServerClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // If there's an auth error (like invalid refresh token), just return null user
        // This is expected when user clicks email links without being logged in
        if (error || !user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // Merge profile phone and profile_picture into user metadata so client always sees them
        try {
            const { data: prof } = await supabaseAdmin
                .from('profiles')
                .select('phone, profile_picture')
                .eq('id', user.id)
                .maybeSingle();
            if (prof) {
                (user as any).user_metadata = { 
                    ...(user as any).user_metadata, 
                    phone: prof.phone || (user as any).user_metadata?.phone,
                    profile_picture: prof.profile_picture || (user as any).user_metadata?.profile_picture
                };
            }
        } catch {}

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        // Silently handle any errors (including refresh token errors)
        // This is expected behavior when user is not authenticated
        return NextResponse.json({ user: null }, { status: 200 });
    }
}

 
