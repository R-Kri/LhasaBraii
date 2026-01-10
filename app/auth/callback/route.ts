import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') || '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get the authenticated user
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) {
                // Check if user profile exists
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('id, profile_completed')
                    .eq('id', user.id)
                    .single()

                // If profile doesn't exist, create it (for OAuth users)
                if (!profile) {
                    try {
                        await supabase.from('user_profiles').insert({
                            id: user.id,
                            email: user.email || '',
                            first_name: user.user_metadata?.first_name || null,
                            last_name: user.user_metadata?.last_name || null,
                            phone: user.user_metadata?.phone || null,
                            bio: null,
                            profile_image: null,
                            profile_completed: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                    } catch (err) {
                        console.error('Error creating profile for OAuth user:', err)
                    }
                }

                // Check if profile is completed
                const { data: updatedProfile } = await supabase
                    .from('user_profiles')
                    .select('profile_completed')
                    .eq('id', user.id)
                    .single()

                // If profile is not completed, redirect to profile completion
                if (!updatedProfile?.profile_completed) {
                    return NextResponse.redirect(
                        new URL('/complete-profile', request.url)
                    )
                }
            }

            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth/error', request.url))
}
