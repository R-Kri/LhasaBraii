'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

interface UserProfile {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    phone: string | null
    bio: string | null
    profile_image: string | null
    rating: number
    total_sales: number
    created_at: string
    updated_at: string
}

export default function ProfilePage() {
    const { user, profile, loading } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'error' | 'success'>('success')

    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '')
            setLastName(profile.last_name || '')
            setPhone(profile.phone || '')
            setBio(profile.bio || '')
        }
    }, [profile])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <div className="animate-pulse">Loading...</div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage('')
        setMessageType('success')

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName || null,
                    last_name: lastName || null,
                    phone: phone || null,
                    bio: bio || null,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save profile')
            }

            setMessage('Profile updated successfully!')
            setMessageType('success')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to save profile'}`)
            setMessageType('error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Message Alert */}
                        {message && (
                            <div
                                className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base flex items-start gap-2 ${message.includes('Error')
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                                    }`}
                            >
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                {message}
                            </div>
                        )}

                        {/* Stats Section */}
                        {profile && !isLoading && (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600">Total Sales</p>
                                        <p className="text-2xl font-bold text-blue-600">{profile.total_sales}</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600">Rating</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {profile.rating > 0 ? profile.rating.toFixed(1) : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Email Section */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <Input
                                            type="email"
                                            value={profile.email || ''}
                                            disabled
                                            className="bg-gray-100 text-gray-600 border-gray-300 text-sm sm:text-base"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed</p>
                                    </div>

                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="border-gray-300 text-sm sm:text-base"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="border-gray-300 text-sm sm:text-base"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                        <Input
                                            type="tel"
                                            placeholder="Enter your phone number (e.g., +919876543210)"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="border-gray-300 text-sm sm:text-base"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10 digits</p>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                        <Textarea
                                            placeholder="Tell buyers about yourself..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="border-gray-300 text-sm sm:text-base resize-none"
                                            rows={4}
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {bio.length}/200 characters
                                        </p>
                                    </div>

                                    {/* Account Created */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            Account created: {new Date(profile.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Save Button */}
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base active:scale-95 transition-transform"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
