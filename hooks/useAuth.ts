'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'user' | 'admin'

export interface UserProfile {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    phone: string | null
    bio: string | null
    profile_image: string | null
    profile_completed: boolean
    role: UserRole
    rating: number
    total_sales: number
    created_at: string
    updated_at: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [profileCompleted, setProfileCompleted] = useState(false)
    const [role, setRole] = useState<UserRole>('user')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()
        let mounted = true

        const loadUserData = async (authUser: User) => {
            try {
                // First, try to sync profile with auth metadata (for OAuth users without names)
                try {
                    await fetch('/api/users/sync-profile', { method: 'POST' })
                } catch {
                    // Ignore sync errors - not critical
                }

                // Fetch user profile from user_profiles
                const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                // Fetch role from profiles table (used by RLS policies)
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authUser.id)
                    .single()

                if (mounted) {
                    if (profileError && profileError.code !== 'PGRST116') {
                        setError('Failed to load profile')
                    }
                    if (profileData) {
                        setProfile(profileData)
                        setProfileCompleted(profileData.profile_completed)
                    }
                    // Get role from profiles table (source of truth for RLS)
                    setRole(profilesData?.role || 'user')
                    setLoading(false)
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Unknown error')
                    setLoading(false)
                }
            }
        }

        // Set up auth state listener first - this handles both initial state and changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return
            
            setUser(session?.user ?? null)
            
            if (session?.user) {
                // Use setTimeout to avoid Supabase deadlock issue
                setTimeout(() => {
                    if (mounted) {
                        loadUserData(session.user)
                    }
                }, 0)
            } else {
                setProfile(null)
                setProfileCompleted(false)
                setRole('user')
                setLoading(false)
            }
        })

        // Also check session directly as a fallback
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted && !session) {
                // Only set loading false if there's no session
                // If there IS a session, onAuthStateChange will handle it
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const isAdmin = role === 'admin'
    
    return { user, profile, loading, profileCompleted, role, isAdmin, error }
}

export function useRequireProfileCompletion() {
    const { user, loading, profileCompleted } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user && !profileCompleted) {
            router.push('/complete-profile')
        }
    }, [user, loading, profileCompleted, router])
}
