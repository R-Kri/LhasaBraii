'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, Trash2, ShoppingCart, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

const conditionLabels: Record<string, string> = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
};

export default function WishlistPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleAddToCart = async (bookId: string) => {
        await addToCart(bookId);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C46A4A]" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start adding books you love!</p>
                        <Link href="/browse">
                            <Button className="bg-[#C46A4A] hover:bg-[#A85A3A]">
                                Browse Books
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {wishlist.map((item) => {
                            const book = item.book;
                            if (!book) return null;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    {/* Image */}
                                    <Link href={`/books/${book.id}`}>
                                        <div className="relative aspect-[3/4] bg-gray-100">
                                            {book.images?.[0] ? (
                                                <Image
                                                    src={book.images[0]}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                                                {conditionLabels[book.condition] || book.condition}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-4">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                                            {book.category}
                                        </span>
                                        <Link href={`/books/${book.id}`}>
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1 hover:text-[#C46A4A] transition-colors">
                                                {book.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                                        <p className="text-lg font-bold text-[#C46A4A] mt-2">₹{book.price}</p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                onClick={() => handleAddToCart(book.id)}
                                                className="flex-1 bg-[#C46A4A] hover:bg-[#A85A3A] text-sm h-9"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-1" />
                                                Add to Cart
                                            </Button>
                                            <Button
                                                onClick={() => removeFromWishlist(book.id)}
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
