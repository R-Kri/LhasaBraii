'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart, getCartItemBook } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { items, summary, loading, error, updateQuantity, removeItem } = useCart();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingId(cartItemId);
        await updateQuantity(cartItemId, newQuantity);
        setUpdatingId(null);
    };

    const handleRemoveItem = async (cartItemId: string) => {
        setRemovingId(cartItemId);
        await removeItem(cartItemId);
        setRemovingId(null);
    };

    // Redirect to login if not authenticated
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
                                You need to be logged in to view your cart.
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
    if (loading || authLoading) {
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

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                            <p className="text-red-700 mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()} variant="outline">
                                Try Again
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
                            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven&apos;t added any books yet.
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
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const book = getCartItemBook(item);
                            if (!book) return null;

                            const isUpdating = updatingId === item.id;
                            const isRemoving = removingId === item.id;

                            return (
                                <Card key={item.id} className={`transition-opacity ${isRemoving ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Book Image */}
                                            <Link href={`/books/${book.id}`} className="flex-shrink-0">
                                                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    {book.images && book.images.length > 0 ? (
                                                        <Image
                                                            src={book.images[0]}
                                                            alt={book.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <BookOpen className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            {/* Book Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/books/${book.id}`}>
                                                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1">
                                                        {book.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                                                <Badge variant="secondary" className="text-xs">
                                                    {book.condition}
                                                </Badge>

                                                {/* Price & Quantity (Mobile) */}
                                                <div className="mt-3 flex items-center justify-between sm:hidden">
                                                    <p className="text-lg font-bold text-green-600">
                                                        ₹{book.price.toFixed(2)}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1 || isUpdating}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">
                                                            {isUpdating ? '...' : item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            disabled={isUpdating}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price & Quantity (Desktop) */}
                                            <div className="hidden sm:flex flex-col items-end justify-between">
                                                <p className="text-xl font-bold text-green-600">
                                                    ₹{(book.price * item.quantity).toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || isUpdating}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">
                                                        {isUpdating ? '...' : item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isRemoving}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Mobile Remove Button */}
                                        <div className="mt-3 pt-3 border-t sm:hidden">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={isRemoving}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                {isRemoving ? 'Removing...' : 'Remove'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
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
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between py-4 text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-green-600">₹{summary.total.toFixed(2)}</span>
                                </div>

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                                    onClick={() => router.push('/checkout')}
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>

                                <Link href="/browse" className="block mt-4">
                                    <Button variant="outline" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Secure checkout powered by Lhasa
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
