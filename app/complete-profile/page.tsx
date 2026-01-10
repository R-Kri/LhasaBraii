'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Check } from 'lucide-react'

export default function CompleteProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')

    // Check if user is authenticated and profile is incomplete
    useEffect(() => {
        const checkUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                if (!user) {
                    router.push('/auth/login')
                    return
                }

                setUser(user)

                // Check if profile already completed
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('profile_completed')
                    .eq('id', user.id)
                    .single()

                if (profile?.profile_completed) {
                    router.push('/')
                    return
                }

                // Pre-fill with signup data if available
                setFirstName(user.user_metadata?.first_name || '')
                setLastName(user.user_metadata?.last_name || '')
                setPhone(user.user_metadata?.phone || '')
            } catch (err) {
                console.error('Error checking user:', err)
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            if (!user) throw new Error('User not found')

            // Validate required fields
            if (!firstName.trim() || !lastName.trim()) {
                setError('First name and last name are required')
                setSaving(false)
                return
            }

            // Create/update user profile
            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert(
                    {
                        id: user.id,
                        email: user.email,
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone || null,
                        bio: bio || null,
                        profile_image: null,
                        profile_completed: true,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'id' }
                )

            if (profileError) throw profileError

            setSuccess(true)

            // Redirect after success
            setTimeout(() => {
                window.location.href = '/'
            }, 1500)
        } catch (err) {
            console.error('Error completing profile:', err)
            setError(
                err instanceof Error ? err.message : 'Failed to complete profile'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1
                            className="text-3xl font-bold mb-2"
                            style={{ color: '#8B5E3C' }}
                        >
                            Complete Your Profile
                        </h1>
                        <p className="text-gray-600">
                            Just a few more details before you can start buying and selling books!
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div
                            className="mb-6 p-4 rounded-lg flex items-center gap-3"
                            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                        >
                            <Check size={24} />
                            <span>Profile completed successfully! Redirecting...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mb-6 p-4 rounded-lg flex items-center gap-3"
                            style={{ backgroundColor: '#FFE8E8', color: '#C46A4A' }}
                        >
                            <AlertCircle size={24} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-semibold mb-2"
                                    style={{ color: '#8B5E3C' }}
                                >
                                    First Name *
                                </label>
                                <Input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="border-2"
                                    style={{ borderColor: '#E0E0E0' }}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-semibold mb-2"
                                    style={{ color: '#8B5E3C' }}
                                >
                                    Last Name *
                                </label>
                                <Input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="border-2"
                                    style={{ borderColor: '#E0E0E0' }}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{ color: '#8B5E3C' }}
                            >
                                Phone Number (Optional)
                            </label>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border-2"
                                style={{ borderColor: '#E0E0E0' }}
                            />
                        </div>

                        {/* Bio Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{ color: '#8B5E3C' }}
                            >
                                Bio (Optional)
                            </label>
                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself... What types of books do you like to read or sell?"
                                rows={4}
                                className="border-2 resize-none"
                                style={{ borderColor: '#E0E0E0' }}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-3 text-white font-semibold"
                                style={{ backgroundColor: '#C46A4A' }}
                            >
                                {saving ? 'Saving...' : 'Complete Profile'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.push('/')}
                                variant="outline"
                                className="flex-1 py-3 font-semibold"
                            >
                                Skip for now
                            </Button>
                        </div>

                        <p className="text-sm text-gray-500 text-center">
                            You can update this information anytime in your profile settings
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
