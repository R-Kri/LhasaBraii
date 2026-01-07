'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        // TODO: Send email via backend
        setSubmitted(true)
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' })
            setSubmitted(false)
        }, 3000)
    }

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
                                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email</h4>
                                <a href="mailto:info@lhasa.com" className="text-blue-600 hover:text-blue-700 break-all text-sm sm:text-base">
                                    info@lhasa.com
                                </a>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone</h4>
                                <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
                                    +1 (234) 567-890
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
                            {submitted && (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg text-sm sm:text-base">
                                    Thank you for your message! We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="text-sm sm:text-base border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="text-sm sm:text-base border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                    <Input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="text-sm sm:text-base border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Your message..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base active:scale-95 transition-transform"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
