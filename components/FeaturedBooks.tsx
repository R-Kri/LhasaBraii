'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, ArrowRight, Loader2, Sparkles, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  created_at: string;
}

const conditionColors: Record<string, string> = {
  new: 'bg-emerald-500 text-white',
  like_new: 'bg-blue-500 text-white',
  good: 'bg-amber-500 text-white',
  fair: 'bg-orange-500 text-white',
};

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
};

export function FeaturedBooks() {
  const router = useRouter();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books?limit=8&status=approved');
        const result = await response.json();
        if (result.data) {
          setBooks(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#C46A4A]/10 animate-ping absolute inset-0" />
              <div className="w-16 h-16 rounded-full bg-[#C46A4A]/20 flex items-center justify-center relative">
                <Loader2 className="w-8 h-8 animate-spin text-[#C46A4A]" />
              </div>
            </div>
            <p className="mt-4 text-gray-500 text-sm">Loading amazing books...</p>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Books Listed Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Be the first to list your books and start earning!</p>
            <Link href="/sell">
              <Button className="h-12 px-8 bg-gradient-to-r from-[#C46A4A] to-[#A85A3A] hover:from-[#B55A3A] hover:to-[#8B4A2A] rounded-xl font-semibold shadow-lg shadow-[#C46A4A]/25">
                <Sparkles className="w-4 h-4 mr-2" />
                Sell Your Books
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-paper relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C46A4A]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5F8A8B]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C46A4A]/10 text-[#C46A4A] text-sm font-semibold mb-4 border border-[#C46A4A]/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Fresh Arrivals
              {/* Sparkle decorations */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C46A4A] rounded-full animate-sparkle" />
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Recently Listed
            </h2>
            <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-lg">
              Quality books from verified sellers, all at student-friendly prices
            </p>
          </div>

          <Link href="/browse" className="hidden sm:block">
            <Button 
              variant="outline" 
              className="group h-14 px-8 rounded-2xl border-2 border-gray-200 text-gray-900 hover:border-[#C46A4A] hover:text-[#C46A4A] hover:bg-[#C46A4A]/5 font-bold transition-all hover:scale-105"
            >
              View All Books
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {books.slice(0, 8).map((book, index) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 card-glow">
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  {book.images && book.images[0] ? (
                    <Image
                      src={book.images[0]}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Condition Badge */}
                  <Badge 
                    className={`absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-lg ${conditionColors[book.condition] || 'bg-gray-500 text-white'}`}
                  >
                    {conditionLabels[book.condition] || book.condition}
                  </Badge>

                  {/* Wishlist button - shows on hover */}
                  <button 
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!user) {
                        router.push('/login');
                        return;
                      }
                      toggleWishlist(book.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isInWishlist(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                  </button>

                  {/* New badge for recent items */}
                  {index < 2 && (
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 py-1 rounded-md bg-[#C46A4A] text-white text-[10px] font-bold uppercase tracking-wide">
                      Just In
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  {/* Category */}
                  <span className="text-[10px] sm:text-xs text-[#5F8A8B] font-medium uppercase tracking-wider">
                    {book.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-1 text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#C46A4A] transition-colors leading-tight">
                    {book.title}
                  </h3>

                  {/* Author */}
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-1">
                    by {book.author}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg sm:text-xl font-black text-[#C46A4A]">
                      ₹{book.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                      Save 40%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <Link href="/browse">
            <Button className="w-full h-14 bg-[#C46A4A] hover:bg-[#A85A3A] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#C46A4A]/25 hover:scale-[1.02] transition-all">
              Browse All Books
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
