import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET current user's profile
export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user profile
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found - create default profile
                const { data: newProfile, error: createError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || null,
                        last_name: user.user_metadata?.last_name || null,
                        phone: user.user_metadata?.phone || null,
                        bio: null,
                        profile_image: null,
                        profile_completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('Failed to create profile:', createError);
                    throw createError;
                }

                return NextResponse.json({
                    success: true,
                    data: newProfile,
                });
            } else {
                console.error('Database error:', error);
                return NextResponse.json(
                    {
                        error: 'Failed to fetch profile',
                        details: error.message,
                    },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// PUT/PATCH to update user profile
export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { first_name, last_name, phone, bio, profile_image } = body;

        // Validate inputs
        if (
            (first_name && typeof first_name !== 'string') ||
            (last_name && typeof last_name !== 'string') ||
            (phone && typeof phone !== 'string') ||
            (bio && typeof bio !== 'string') ||
            (profile_image && typeof profile_image !== 'string')
        ) {
            return NextResponse.json(
                { error: 'Invalid input types' },
                { status: 400 }
            );
        }

        // Validate phone format (optional, basic check - allow common formats)
        if (phone && phone.trim()) {
            // Remove common phone formatting characters and check if it has at least 10 digits
            const digitsOnly = phone.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                return NextResponse.json(
                    { error: 'Phone number must contain at least 10 digits' },
                    { status: 400 }
                );
            }
        }

        // Try to update existing profile
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                email: user.email,
                first_name: first_name || null,
                last_name: last_name || null,
                phone: phone || null,
                bio: bio || null,
                profile_image: profile_image || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to update profile',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data,
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
