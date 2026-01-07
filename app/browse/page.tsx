'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BrowseBooksSection } from '@/components/BrowseBooksSection'

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Browse Books</h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 sm:mt-3">
                            Discover thousands of books in our collection
                        </p>
                    </div>
                    <BrowseBooksSection />
                </div>
            </main>
            <Footer />
        </div>
    )
}
