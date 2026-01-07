'use client'

import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import SellYourBooks from '@/components/SellYourBooks'
import { useRouter } from 'next/navigation'

export default function SellPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (!loading && !user) {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Sell Your Books</h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 sm:mt-3">
                            List your books and reach thousands of readers
                        </p>
                    </div>
                    <SellYourBooks />
                </div>
            </main>
            <Footer />
        </div>
    )
}