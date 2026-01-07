'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { user, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

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
        try {
            const supabase = createClient()

            // Update auth user metadata
            await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                },
            })

            setMessage('Profile updated successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error: any) {
            setMessage(`Error: ${error.message}`)
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
                        {message && (
                            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="space-y-4 sm:space-y-6">
                            {/* Email Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <Input
                                    type="email"
                                    value={user.email || ''}
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
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="border-gray-300 text-sm sm:text-base"
                                />
                            </div>

                            {/* Account Created */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Account created: {new Date(user.created_at || '').toLocaleDateString()}
                                </p>
                            </div>

                            {/* Save Button */}
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base active:scale-95 transition-transform"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
