import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST - Sync user profile with auth metadata (for existing users without names)
export async function POST() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check current profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name, profile_image')
            .eq('id', user.id)
            .single();

        // If profile already has name, no need to sync
        if (profile?.first_name && profile?.last_name) {
            return NextResponse.json({
                success: true,
                message: 'Profile already has name',
                synced: false,
            });
        }

        // Extract name from user metadata (OAuth providers store it differently)
        const meta = user.user_metadata || {};
        console.log('User metadata for sync:', JSON.stringify(meta, null, 2));
        
        const fullName = meta.full_name || meta.name || '';
        const nameParts = fullName.split(' ').filter(Boolean);
        
        const firstName = meta.given_name || meta.first_name || nameParts[0] || null;
        const lastName = meta.family_name || meta.last_name || nameParts.slice(1).join(' ') || null;
        const profileImage = meta.avatar_url || meta.picture || null;

        console.log('Extracted:', { firstName, lastName, profileImage, fullName });

        // Only update if we have new data to add
        if (!firstName && !lastName && !profileImage) {
            return NextResponse.json({
                success: true,
                message: 'No metadata to sync',
                synced: false,
                debug: { meta, profile }
            });
        }

        // Build update object - only update fields that are currently null
        const updates: Record<string, string | boolean> = {
            updated_at: new Date().toISOString(),
        };

        if (!profile?.first_name && firstName) {
            updates.first_name = firstName;
        }
        if (!profile?.last_name && lastName) {
            updates.last_name = lastName;
        }
        if (!profile?.profile_image && profileImage) {
            updates.profile_image = profileImage;
        }

        // Check if profile_completed should be set
        const newFirstName = updates.first_name || profile?.first_name;
        const newLastName = updates.last_name || profile?.last_name;
        if (newFirstName && newLastName) {
            updates.profile_completed = true;
        }

        // Update or create profile
        if (profile) {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', user.id);

            if (updateError) {
                console.error('Profile update error:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update profile' },
                    { status: 500 }
                );
            }
        } else {
            // Create new profile
            const { error: insertError } = await supabase
                .from('user_profiles')
                .insert({
                    id: user.id,
                    email: user.email || '',
                    first_name: firstName,
                    last_name: lastName,
                    profile_image: profileImage,
                    profile_completed: !!(firstName && lastName),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

            if (insertError) {
                console.error('Profile insert error:', insertError);
                return NextResponse.json(
                    { error: 'Failed to create profile' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Profile synced from auth metadata',
            synced: true,
            data: {
                first_name: updates.first_name || profile?.first_name,
                last_name: updates.last_name || profile?.last_name,
            },
        });
    } catch (error) {
        console.error('Sync profile error:', error);
        return NextResponse.json(
            { error: 'Failed to sync profile' },
            { status: 500 }
        );
    }
}
