'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ShoppingCart, Heart, Share2, AlertCircle, Send, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'

interface Seller {
    id: string
    first_name: string | null
    last_name: string | null
    phone: string | null
    bio: string | null
    profile_image: string | null
    rating: number
    total_sales: number
}

interface BookDetail {
    id: string
    title: string
    author: string
    isbn?: string
    category: string
    condition: string
    price: number
    description?: string
    images: string[]
    status: string
    created_at: string
    seller: Seller
    relatedBooks?: Array<{
        id: string
        title: string
        price: number
        images: string[]
        condition: string
        category: string
    }>
}

interface Review {
    id: string
    rating: number
    comment: string | null
    created_at: string
    reviewer_id: string
    reviewer?: {
        first_name: string | null
        last_name: string | null
    }
}

interface ReviewStats {
    averageRating: number
    totalReviews: number
    distribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { user } = useAuth()
    const { addToCart } = useCart()
    const [bookId, setBookId] = useState<string>('')
    const [book, setBook] = useState<BookDetail | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const { isInWishlist, toggleWishlist } = useWishlist()

    // Cart state
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [cartMessage, setCartMessage] = useState<{ message: string; success: boolean } | null>(null)

    // Review form
    const [reviewRating, setReviewRating] = useState('5')
    const [reviewComment, setReviewComment] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [reviewMessage, setReviewMessage] = useState('')

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        if (!book) return

        setIsAddingToCart(true)
        const result = await addToCart(book.id)
        setCartMessage({ message: result.message, success: result.success })
        setIsAddingToCart(false)

        setTimeout(() => setCartMessage(null), 3000)
    }

    // Get book ID from params
    useEffect(() => {
        const getBookId = async () => {
            const { id } = await params
            setBookId(id)
        }
        getBookId()
    }, [params])

    // Fetch book and reviews
    useEffect(() => {
        if (!bookId) return

        const fetchData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Fetch book details
                const bookResponse = await fetch(`/api/books/${bookId}`)
                const bookResult = await bookResponse.json()

                if (!bookResponse.ok) {
                    throw new Error(bookResult.error || 'Failed to fetch book')
                }

                setBook(bookResult.data)
                setSelectedImage(0)

                // Fetch reviews
                const reviewResponse = await fetch(`/api/books/${bookId}/reviews`)
                const reviewResult = await reviewResponse.json()

                if (reviewResponse.ok) {
                    setReviews(reviewResult.data || [])
                    setReviewStats(reviewResult.stats)
                }
            } catch (err) {
                console.error('Error fetching book:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch book')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [bookId])

    const handleSubmitReview = async () => {
        if (!bookId) return

        setIsSubmittingReview(true)
        setReviewMessage('')

        try {
            const response = await fetch(`/api/books/${bookId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: parseInt(reviewRating),
                    comment: reviewComment || null,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit review')
            }

            setReviewMessage('Review submitted successfully!')
            setReviewRating('5')
            setReviewComment('')

            // Refresh reviews
            const reviewResponse = await fetch(`/api/books/${bookId}/reviews`)
            const reviewResult = await reviewResponse.json()
            if (reviewResponse.ok) {
                setReviews(reviewResult.data || [])
                setReviewStats(reviewResult.stats)
            }

            setTimeout(() => setReviewMessage(''), 3000)
        } catch (error) {
            setReviewMessage(`Error: ${error instanceof Error ? error.message : 'Failed to submit review'}`)
        } finally {
            setIsSubmittingReview(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Error</h3>
                                    <p className="text-red-700 text-sm">{error || 'Book not found'}</p>
                                </div>
                            </div>
                            <Button onClick={() => router.back()} className="mt-4">
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Images */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            {/* Main Image */}
                            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-[3/4]">
                                {book.images && book.images.length > 0 ? (
                                    <Image
                                        src={book.images[selectedImage]}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {book.images && book.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {book.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${book.title} ${idx + 1}`}
                                                width={64}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle: Book Details */}
                    <div className="lg:col-span-1">
                        {/* Status */}
                        {book.status !== 'approved' && (
                            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-300">
                                {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                            </Badge>
                        )}

                        {/* Title & Author */}
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-600 mb-4">{book.author}</p>

                        {/* Rating */}
                        {reviewStats && reviewStats.totalReviews > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.round(reviewStats.averageRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">
                                    {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)
                                </span>
                            </div>
                        )}

                        {/* Condition & Category */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <Card>
                                <CardContent className="pt-4">
                                    <p className="text-xs text-gray-600">Condition</p>
                                    <p className="font-semibold">{book.condition}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4">
                                    <p className="text-xs text-gray-600">Category</p>
                                    <p className="font-semibold">{book.category}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <p className="text-gray-600">Price</p>
                            <p className="text-4xl font-bold text-green-600">₹{book.price.toFixed(2)}</p>
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-700 text-sm">{book.description}</p>
                            </div>
                        )}

                        {/* ISBN */}
                        {book.isbn && (
                            <div className="mb-6">
                                <p className="text-xs text-gray-600">ISBN</p>
                                <p className="font-mono text-sm">{book.isbn}</p>
                            </div>
                        )}

                        {/* Cart Message */}
                        {cartMessage && (
                            <div className={`mb-4 p-3 rounded-lg text-sm ${cartMessage.success
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {cartMessage.message}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => book && toggleWishlist(book.id)}
                                className={book && isInWishlist(book.id) ? 'text-red-600 border-red-200' : ''}
                            >
                                <Heart className={`w-4 h-4 ${book && isInWishlist(book.id) ? 'fill-red-600' : ''}`} />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Right: Seller Info */}
                    <div className="lg:col-span-1">
                        {/* Seller Card */}
                        <Card className="mb-6 sticky top-20">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Seller Information</h3>
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {book.seller.first_name?.charAt(0)}{book.seller.last_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {book.seller.first_name} {book.seller.last_name}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-semibold">{book.seller.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Total Sales</p>
                                        <p className="font-semibold">{book.seller.total_sales}</p>
                                    </div>
                                    {book.seller.bio && (
                                        <div>
                                            <p className="text-gray-600">About</p>
                                            <p className="text-gray-700">{book.seller.bio}</p>
                                        </div>
                                    )}
                                </div>

                                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                    Contact Seller
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Related Books */}
                        {book.relatedBooks && book.relatedBooks.length > 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-4">More from this Seller</h3>
                                    <div className="space-y-3">
                                        {book.relatedBooks.slice(0, 3).map((relBook) => (
                                            <div key={relBook.id} className="flex gap-3 cursor-pointer hover:opacity-75 transition-opacity">
                                                <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                    {relBook.images && relBook.images.length > 0 ? (
                                                        <Image
                                                            src={relBook.images[0]}
                                                            alt={relBook.title}
                                                            width={48}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{relBook.title}</p>
                                                    <p className="text-xs text-gray-600">₹{relBook.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

                    {/* Add Review Form */}
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4">Share Your Review</h3>

                            {reviewMessage && (
                                <div
                                    className={`mb-4 p-3 rounded-lg text-sm ${reviewMessage.includes('Error')
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
                                        }`}
                                >
                                    {reviewMessage}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Rating</label>
                                    <Select value={reviewRating} onValueChange={setReviewRating}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 Stars - Excellent</SelectItem>
                                            <SelectItem value="4">4 Stars - Good</SelectItem>
                                            <SelectItem value="3">3 Stars - Okay</SelectItem>
                                            <SelectItem value="2">2 Stars - Poor</SelectItem>
                                            <SelectItem value="1">1 Star - Very Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Comment (Optional)</label>
                                    <Textarea
                                        placeholder="Share your experience with this book..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{reviewComment.length}/500</p>
                                </div>

                                <Button
                                    onClick={handleSubmitReview}
                                    disabled={isSubmittingReview}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold">
                                                    {review.reviewer?.first_name} {review.reviewer?.last_name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
