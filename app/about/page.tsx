'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">About Lhasa</h1>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 text-gray-700 border border-gray-200">
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                            Welcome to Lhasa, your premium online marketplace for buying and selling books.
                            We connect readers and sellers to create a vibrant community around literature.
                        </p>

                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Our Mission</h2>
                            <p className="text-sm sm:text-base leading-relaxed">
                                We believe in making books accessible to everyone. Our platform enables students,
                                educators, and book enthusiasts to buy, sell, and exchange books easily and securely.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Why Choose Lhasa?</h2>
                            <ul className="space-y-2 ml-3 sm:ml-4 text-sm sm:text-base">
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2 sm:mr-3 flex-shrink-0">✓</span>
                                    <span>Easy-to-use platform for listing and browsing books</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2 sm:mr-3 flex-shrink-0">✓</span>
                                    <span>Secure transactions and verified sellers</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2 sm:mr-3 flex-shrink-0">✓</span>
                                    <span>Wide selection of academic and recreational books</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2 sm:mr-3 flex-shrink-0">✓</span>
                                    <span>Affordable prices and special deals</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
