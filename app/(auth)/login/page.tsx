'use client'

import AuthModal from '@/components/auth/AuthModal'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Categories } from '@/components/Categories'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
    const router = useRouter()
    const { user, loading } = useAuth()

    // If already logged in, redirect to home
    useEffect(() => {
        if (!loading && user) {
            router.replace('/')
        }
    }, [user, loading, router])

    const handleClose = () => {
        // Use replace to avoid adding to history stack
        router.replace('/')
    }

    // Don't show modal if already logged in
    if (!loading && user) {
        return null
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FAF7F2' }}>
            {/* Website content in background - visible but non-interactive */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                <Header />
                <Hero />
                <Categories />
            </div>

            {/* Auth Modal overlay */}
            <AuthModal isOpen={true} onClose={handleClose} />
        </div>
    )
}
