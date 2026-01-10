'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Star, Send, Loader2, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react'

type FeedbackType = 'general' | 'bug' | 'feature' | 'feedback' | null;

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        feedback_type: null as FeedbackType,
        rating: 0,
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hoveredRating, setHoveredRating] = useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    feedback_type: formData.feedback_type || null,
                    rating: formData.rating || null,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit')
            }

            setSubmitted(true)
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                feedback_type: null,
                rating: 0,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const feedbackTypes = [
        { value: 'general', label: 'General Inquiry', icon: MessageSquare },
        { value: 'feedback', label: 'Share Feedback', icon: ThumbsUp },
        { value: 'bug', label: 'Report a Bug', icon: '🐛' },
        { value: 'feature', label: 'Feature Request', icon: '💡' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="w-full px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6 sm:space-y-8">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Get in Touch</h3>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email</h4>
                                <a href="mailto:info@lhasa.com" className="text-blue-600 hover:text-blue-700 break-all text-sm sm:text-base">
                                    code.dev108@gmail.com
                                </a>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone</h4>
                                <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
                                    +91 82599 06585
                                </a>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Hours</h4>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 10:00 AM - 4:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                                    <Button
                                        onClick={() => setSubmitted(false)}
                                        variant="outline"
                                        className="border-gray-300"
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Feedback Type Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            What can we help you with?
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {feedbackTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, feedback_type: type.value as FeedbackType }))}
                                                    className={`p-3 rounded-lg border text-left text-sm transition-all ${
                                                        formData.feedback_type === type.value
                                                            ? 'border-[#C46A4A] bg-[#C46A4A]/5 text-[#C46A4A]'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="mr-2">
                                                        {typeof type.icon === 'string' ? type.icon : <type.icon className="w-4 h-4 inline" />}
                                                    </span>
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                                            <Input
                                                type="text"
                                                name="name"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="text-sm border-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="text-sm border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                        <Input
                                            type="text"
                                            name="subject"
                                            placeholder="Brief subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="text-sm border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            name="message"
                                            placeholder="Tell us more..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46A4A] text-sm resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Rating (optional for feedback) */}
                                    {formData.feedback_type === 'feedback' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                How would you rate your experience? (Optional)
                                            </label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                        className="p-1 transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-7 h-7 ${
                                                                star <= (hoveredRating || formData.rating)
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#C46A4A] hover:bg-[#A85A3A] text-white font-semibold py-3 rounded-lg text-sm active:scale-[0.98] transition-all"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
