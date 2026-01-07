'use client'

import AuthModal from '@/components/auth/AuthModal'

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthModal isOpen={true} onClose={() => { }} />
        </div>
    )
}
