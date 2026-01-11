'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'

interface Message {
    id: string
    sender_id: string
    message: string
    is_read: boolean
    created_at: string
    isOwn: boolean
    senderRole: 'Buyer' | 'Seller'
}

interface ChatModalProps {
    isOpen: boolean
    onClose: () => void
    bookId: string
    bookTitle: string
}

export default function ChatModal({ isOpen, onClose, bookId, bookTitle }: ChatModalProps) {
    const { user } = useAuth()
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [otherPartyRole, setOtherPartyRole] = useState<string>('Seller')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (!isOpen || !user) return

        const initializeChat = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Create or get existing conversation
                const createRes = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookId }),
                })

                const createResult = await createRes.json()

                if (!createRes.ok) {
                    throw new Error(createResult.error || 'Failed to start conversation')
                }

                const convId = createResult.data.conversationId
                setConversationId(convId)

                // Fetch messages
                const msgRes = await fetch(`/api/chat/${convId}`)
                const msgResult = await msgRes.json()

                if (!msgRes.ok) {
                    throw new Error(msgResult.error || 'Failed to load messages')
                }

                setMessages(msgResult.data.messages || [])
                setOtherPartyRole(msgResult.data.conversation.otherPartyRole)
            } catch (err) {
                console.error('Chat error:', err)
                setError(err instanceof Error ? err.message : 'Failed to load chat')
            } finally {
                setIsLoading(false)
            }
        }

        initializeChat()
    }, [isOpen, bookId, user])

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!isOpen || !conversationId) return

        const pollMessages = async () => {
            try {
                const res = await fetch(`/api/chat/${conversationId}`)
                const result = await res.json()
                if (res.ok) {
                    setMessages(result.data.messages || [])
                }
            } catch (err) {
                console.error('Poll error:', err)
            }
        }

        const interval = setInterval(pollMessages, 5000)
        return () => clearInterval(interval)
    }, [isOpen, conversationId])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversationId || isSending) return

        setIsSending(true)
        const messageText = newMessage.trim()
        setNewMessage('')

        try {
            const res = await fetch(`/api/chat/${conversationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Failed to send message')
            }

            setMessages((prev) => [...prev, result.data])
        } catch (err) {
            console.error('Send error:', err)
            setNewMessage(messageText) // Restore message on error
            setError('Failed to send message. Please try again.')
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Chat with {otherPartyRole}</h3>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                Re: {bookTitle}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Privacy Notice */}
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                    <p className="text-xs text-amber-700">
                        🔒 Anonymous chat - your personal details are hidden. Share contact info only if you choose to.
                    </p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-red-600 mb-2">{error}</p>
                                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No messages yet</p>
                                <p className="text-sm">Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                            msg.isOwn
                                                ? 'bg-blue-600 text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                        }`}
                                    >
                                        <p className={`text-xs font-medium mb-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {msg.senderRole}
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="resize-none min-h-[44px] max-h-[120px]"
                            rows={1}
                            disabled={isLoading || !!error}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending || isLoading || !!error}
                            className="bg-blue-600 hover:bg-blue-700 px-4"
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
