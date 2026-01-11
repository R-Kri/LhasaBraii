import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Debug endpoint to check profile and auth metadata
export async function GET() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
        }

        // Get profile from database
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            auth: {
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata,
            },
            profile: profile,
            profileError: profileError?.message,
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
