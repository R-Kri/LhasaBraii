'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import ChatModal from '@/components/ChatModal'

interface Conversation {
    id: string
    book_id: string
    buyer_id: string
    seller_id: string
    created_at: string
    updated_at: string
    role: 'buyer' | 'seller'
    otherPartyRole: 'Buyer' | 'Seller'
    unreadCount: number
    books: {
        id: string
        title: string
        images: string[]
    }
    lastMessage?: {
        message: string
        created_at: string
        sender_id: string
    }
}

export default function MessagesPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

    useEffect(() => {
        if (authLoading) return

        if (!user) {
            router.push('/login')
            return
        }

        const fetchConversations = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const res = await fetch('/api/chat')
                const result = await res.json()

                if (!res.ok) {
                    throw new Error(result.error || 'Failed to fetch conversations')
                }

                setConversations(result.data || [])
            } catch (err) {
                console.error('Error fetching conversations:', err)
                setError(err instanceof Error ? err.message : 'Failed to load conversations')
            } finally {
                setIsLoading(false)
            }
        }

        fetchConversations()
    }, [user, authLoading, router])

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diffDays === 1) {
            return 'Yesterday'
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' })
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Messages</h1>
                            <p className="text-gray-600 text-sm">Your conversations with buyers and sellers</p>
                        </div>
                    </div>

                    {error ? (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="py-8 text-center">
                                <p className="text-red-600">{error}</p>
                                <Button className="mt-4" onClick={() => window.location.reload()}>
                                    Retry
                                </Button>
                            </CardContent>
                        </Card>
                    ) : conversations.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Start a conversation by contacting a seller on a book listing
                                </p>
                                <Button onClick={() => router.push('/browse')}>
                                    Browse Books
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {conversations.map((conv) => (
                                <Card
                                    key={conv.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        conv.unreadCount > 0 ? 'border-blue-200 bg-blue-50/50' : ''
                                    }`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Book Image */}
                                            <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {conv.books?.images?.[0] ? (
                                                    <Image
                                                        src={conv.books.images[0]}
                                                        alt={conv.books.title}
                                                        width={64}
                                                        height={80}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <MessageCircle className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-sm">
                                                            {conv.otherPartyRole}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {conv.books?.title || 'Book'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {conv.lastMessage && (
                                                            <span className="text-xs text-gray-400">
                                                                {formatTime(conv.lastMessage.created_at)}
                                                            </span>
                                                        )}
                                                        {conv.unreadCount > 0 && (
                                                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                {conv.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {conv.lastMessage ? (
                                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                                        {conv.lastMessage.sender_id === user?.id ? 'You: ' : ''}
                                                        {conv.lastMessage.message}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-400 mt-1 italic">
                                                        No messages yet
                                                    </p>
                                                )}

                                                <p className="text-xs text-blue-600 mt-2">
                                                    You are the {conv.role}
                                                </p>
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

            {/* Chat Modal */}
            {selectedConversation && (
                <ChatModal
                    isOpen={!!selectedConversation}
                    onClose={() => {
                        setSelectedConversation(null)
                        // Refresh conversations to update unread counts
                        fetch('/api/chat')
                            .then(res => res.json())
                            .then(result => {
                                if (result.data) setConversations(result.data)
                            })
                    }}
                    bookId={selectedConversation.book_id}
                    bookTitle={selectedConversation.books?.title || 'Book'}
                />
            )}
        </div>
    )
}
