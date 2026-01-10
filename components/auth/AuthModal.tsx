'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Login form state
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    // Signup form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [sendUpdates, setSendUpdates] = useState(true)

    const supabase = createClient()

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            setError('')
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError('')
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error
            onClose()
            window.location.reload() // Refresh to update auth state
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!agreeToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            setError('')
            const { data, error } = await supabase.auth.signUp({
                email: signupEmail,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                        send_updates: sendUpdates,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error

            // Create initial user profile record with profile_completed = false
            if (data.user) {
                try {
                    await supabase.from('user_profiles').upsert({
                        id: data.user.id,
                        email: signupEmail,
                        first_name: firstName || null,
                        last_name: lastName || null,
                        phone: phone || null,
                        bio: null,
                        profile_image: null,
                        profile_completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                } catch (profileError) {
                    console.error('Profile creation error:', profileError)
                    // Don't block signup if profile creation fails
                }
            }

            alert('Check your email to confirm your account!')
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FAF7F2' }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 transition"
                    style={{ color: '#C46A4A' }}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="p-6 pb-4">
                    <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#8B5E3C' }}>
                        {activeTab === 'login' ? 'Welcome Back' : 'Join BookMarket'}
                    </h2>

                    {/* Tabs */}
                    <div className="flex gap-2 rounded-full p-1 mb-6" style={{ backgroundColor: '#E8DFD3' }}>
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-2 px-4 rounded-full font-medium transition ${activeTab === 'login'
                                ? 'text-white shadow-sm'
                                : 'transition'
                                }`}
                            style={activeTab === 'login' ? { backgroundColor: '#5F8A8B', color: 'white' } : { color: '#8B5E3C' }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-2 px-4 rounded-full font-medium transition ${activeTab === 'signup'
                                ? 'text-white shadow-sm'
                                : 'transition'
                                }`}
                            style={activeTab === 'signup' ? { backgroundColor: '#5F8A8B', color: 'white' } : { color: '#8B5E3C' }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FFE8E8', color: '#C46A4A', border: '1px solid #C46A4A' }}>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="your.email@university.edu"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="Your password"
                                        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                                        style={{ color: '#8B5E3C' }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border"
                                        style={{ borderColor: '#C46A4A' }}
                                    />
                                    <span className="text-sm" style={{ color: '#2B2B2B' }}>Remember me</span>
                                </label>
                                <button type="button" className="text-sm transition" style={{ color: '#C46A4A' }}>
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#C46A4A' }}
                            >
                                {loading ? 'Logging in...' : 'Login to BookMarket'}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full" style={{ borderTop: '1px solid #E0E0E0' }} />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2" style={{ backgroundColor: '#FAF7F2', color: '#2B2B2B' }}>or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', color: '#2B2B2B' }}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                            style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder="your.email@university.edu"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Phone (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(555) 123-4567"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                                        style={{ color: '#8B5E3C' }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: '#8B5E3C' }} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', color: '#2B2B2B' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                                        style={{ color: '#8B5E3C' }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border"
                                        style={{ borderColor: '#C46A4A' }}
                                    />
                                    <span className="text-sm" style={{ color: '#2B2B2B' }}>
                                        I agree to the{' '}
                                        <a href="#" className="font-medium hover:underline transition" style={{ color: '#C46A4A' }}>
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="font-medium hover:underline transition" style={{ color: '#C46A4A' }}>
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>

                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={sendUpdates}
                                        onChange={(e) => setSendUpdates(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border"
                                        style={{ borderColor: '#C46A4A' }}
                                    />
                                    <span className="text-sm" style={{ color: '#2B2B2B' }}>
                                        Send me updates about new books and special offers
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#C46A4A' }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
