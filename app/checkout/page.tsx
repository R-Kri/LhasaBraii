'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart, getCartItemBook } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import {
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    Phone,
    MessageSquare,
    ArrowRight,
    Loader2,
    BookOpen,
    Info,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const { items, summary, loading: cartLoading, clearCart } = useCart();
    const [buyerPhone, setBuyerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successOrders, setSuccessOrders] = useState<string[]>([]);

    // Pre-fill phone from profile
    useState(() => {
        if (profile?.phone) {
            setBuyerPhone(profile.phone);
        }
    });

    const handleCheckout = async () => {
        if (items.length === 0) return;

        setIsProcessing(true);
        setError(null);
        const createdOrders: string[] = [];

        try {
            // Create an order for each item in cart
            for (const item of items) {
                const book = getCartItemBook(item);
                if (!book) continue;

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        book_id: book.id,
                        buyer_phone: buyerPhone || null,
                        notes: notes || null,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    createdOrders.push(result.data.id);
                } else {
                    // If it fails because order already exists, continue
                    if (result.orderId) {
                        createdOrders.push(result.orderId);
                    } else {
                        throw new Error(result.error || 'Failed to create order');
                    }
                }
            }

            setSuccessOrders(createdOrders);
            clearCart();

            // Redirect to orders page after short delay
            setTimeout(() => {
                router.push('/orders');
            }, 2000);
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Failed to process checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    // Redirect if not authenticated
    if (!authLoading && !user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
                            <p className="text-gray-600 mb-4">
                                You need to be logged in to checkout.
                            </p>
                            <Button onClick={() => router.push('/login')} className="bg-blue-600 hover:bg-blue-700">
                                Log In
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    // Loading state
    if (cartLoading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Success state
    if (successOrders.length > 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-lg mx-auto">
                        <CardContent className="pt-8 pb-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
                            <p className="text-gray-600 mb-6">
                                Your order has been created successfully. The seller will be notified and you can now connect with them to arrange the exchange.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>1. Contact the seller using their phone number</li>
                                    <li>2. Arrange a meeting or delivery</li>
                                    <li>3. After receiving the book & paying, confirm in your orders</li>
                                </ul>
                            </div>
                            <Button
                                onClick={() => router.push('/orders')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                View My Orders
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="pt-8 pb-8 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
                            <p className="text-gray-600 mb-6">
                                Add some books to your cart before checking out.
                            </p>
                            <Link href="/browse">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Browse Books
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Contact Info & Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* How it Works */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-2">How Payment Works</h3>
                                        <p className="text-sm text-blue-800 mb-3">
                                            This is a peer-to-peer marketplace. After placing your order:
                                        </p>
                                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                            <li>Contact the seller directly via phone</li>
                                            <li>Arrange a meeting point or delivery</li>
                                            <li>Pay the seller directly (cash/UPI)</li>
                                            <li>Confirm receipt in your orders page</li>
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Your Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone Number (shared with seller)
                                        </label>
                                        <Input
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={buyerPhone}
                                            onChange={(e) => setBuyerPhone(e.target.value)}
                                            className="max-w-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            The seller will use this to contact you
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Notes for Seller (optional)
                                        </label>
                                        <Textarea
                                            placeholder="Any specific instructions or preferred meeting areas..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            maxLength={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {items.map((item) => {
                                        const book = getCartItemBook(item);
                                        if (!book) return null;

                                        return (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                                    {book.images && book.images.length > 0 ? (
                                                        <Image
                                                            src={book.images[0]}
                                                            alt={book.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <BookOpen className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{book.title}</h3>
                                                    <p className="text-sm text-gray-600">{book.author}</p>
                                                    <p className="text-sm text-gray-500">{book.condition}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">₹{book.price}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardContent className="pt-6">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 pb-4 border-b">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Items ({summary.itemCount})</span>
                                        <span>₹{summary.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Platform Fee</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between py-4 text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-green-600">₹{summary.total.toFixed(2)}</span>
                                </div>

                                <p className="text-xs text-gray-500 mb-4">
                                    * You will pay the seller directly when you meet
                                </p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                                    onClick={handleCheckout}
                                    disabled={isProcessing || items.length === 0}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By placing this order, you agree to our terms of service
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
