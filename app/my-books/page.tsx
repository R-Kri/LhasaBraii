'use client'

import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyBooksPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="w-full px-3 sm:px-4 py-8 sm:py-12">
                    <div className="animate-pulse text-sm">Loading...</div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My Books</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your book listings</p>
                        </div>
                        <Button
                            asChild
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base active:scale-95 transition-transform"
                        >
                            <Link href="/sell">Add New Book</Link>
                        </Button>
                    </div>

                    {/* Empty State */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📚</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No books listed yet</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            Start selling your books today and reach thousands of readers.
                        </p>
                        <Button
                            asChild
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base active:scale-95 transition-transform"
                        >
                            <Link href="/sell">List Your First Book</Link>
                        </Button>
                    </div>

                    {/* TODO: Display user's books when backend is ready */}
                </div>
            </main>
            <Footer />
        </div>
    )
}
