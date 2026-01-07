'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthError() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
                <p className="text-gray-600 mb-6">
                    There was an error confirming your email. This link may have expired.
                </p>
                <div className="space-y-3">
                    <Button
                        onClick={() => router.push('/signup')}
                        className="w-full"
                    >
                        Try Signing Up Again
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full"
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
