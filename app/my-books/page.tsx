'use client'

import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Trash2, Edit, Eye, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface Book {
    id: string
    title: string
    author: string
    price: number
    condition: string
    category: string
    status: 'pending' | 'approved' | 'rejected' | 'sold'
    images: string[]
    created_at: string
    rejection_reason?: string
}

export default function MyBooksPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [books, setBooks] = useState<Book[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string>('all')

    // Fetch user's books
    useEffect(() => {
        if (!user) return

        const fetchBooks = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const statusParam = selectedStatus === 'all' ? '' : `status=${selectedStatus}`
                const response = await fetch(`/api/users/books?${statusParam}`)
                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch books')
                }

                setBooks(result.data || [])
            } catch (err) {
                console.error('Error fetching books:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch books')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBooks()
    }, [user, selectedStatus])

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-300'
            case 'sold':
                return 'bg-blue-100 text-blue-800 border-blue-300'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const handleDeleteBook = async (bookId: string) => {
        if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`/api/users/books/${bookId}`, {
                method: 'DELETE',
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Failed to delete book')
                return
            }

            // Remove the book from the list
            setBooks(books.filter(book => book.id !== bookId))
            setError(null)
        } catch (err) {
            console.error('Error deleting book:', err)
            setError(err instanceof Error ? err.message : 'Failed to delete book')
        }
    }

    const statusTabs = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Sold', value: 'sold' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-6xl mx-auto">
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

                    {/* Status Filter Tabs */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {statusTabs.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={selectedStatus === tab.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedStatus(tab.value)}
                                className={selectedStatus === tab.value ? 'bg-blue-600' : ''}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {/* Error State */}
                    {error && (
                        <Card className="border-red-200 bg-red-50 mb-6">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-red-900">Error</h3>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                            <p className="mt-4 text-gray-600">Loading your books...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && books.length === 0 && (
                        <Card className="border-gray-200 bg-white">
                            <CardContent className="py-12 text-center">
                                <div className="text-4xl mb-4">📚</div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No books listed</h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-6">
                                    {selectedStatus === 'all'
                                        ? "You haven't listed any books yet"
                                        : `No ${selectedStatus} books found`}
                                </p>
                                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                    <Link href="/sell">List Your First Book</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Books Grid */}
                    {!isLoading && books.length > 0 && (
                        <div className="grid gap-4 sm:gap-6">
                            {books.map((book) => (
                                <Card key={book.id} className="border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex gap-4 sm:gap-6">
                                            {/* Image */}
                                            <div className="flex-shrink-0">
                                                <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                    {book.images && book.images.length > 0 ? (
                                                        <Image
                                                            src={book.images[0]}
                                                            alt={book.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 640px) 80px, 96px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Book Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                                                            {book.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 truncate">{book.author}</p>
                                                    </div>
                                                    <Badge className={getStatusColor(book.status)}>
                                                        {getStatusLabel(book.status)}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Price:</span>
                                                        <p className="font-semibold text-green-600">₹{book.price.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Condition:</span>
                                                        <p className="font-semibold text-gray-900">{book.condition}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Category:</span>
                                                        <p className="font-semibold text-gray-900">{book.category}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Photos:</span>
                                                        <p className="font-semibold text-gray-900">{book.images?.length || 0}</p>
                                                    </div>
                                                </div>

                                                {/* Rejection Reason */}
                                                {book.status === 'rejected' && book.rejection_reason && (
                                                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-xs sm:text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                                                        <p className="text-xs sm:text-sm text-red-700">{book.rejection_reason}</p>
                                                    </div>
                                                )}

                                                {/* Date */}
                                                <p className="text-xs text-gray-500">
                                                    Listed {new Date(book.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0 flex flex-col gap-2">
                                                {book.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs sm:text-sm"
                                                            onClick={() => router.push(`/sell?edit=${book.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            <span className="hidden sm:inline">Edit</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="text-xs sm:text-sm"
                                                            onClick={() => handleDeleteBook(book.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            <span className="hidden sm:inline">Delete</span>
                                                        </Button>
                                                    </>
                                                )}
                                                {(book.status === 'approved' || book.status === 'sold') && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs sm:text-sm"
                                                        onClick={() => router.push(`/books/${book.id}`)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        <span className="hidden sm:inline">View</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
