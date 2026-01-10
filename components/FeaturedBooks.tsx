'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  like_new: 'bg-blue-100 text-blue-700 border-blue-200',
  good: 'bg-amber-100 text-amber-700 border-amber-200',
  fair: 'bg-orange-100 text-orange-700 border-orange-200',
};

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
};

export function FeaturedBooks() {
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C46A4A]" />
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Available Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to list your books!</p>
            <Link href="/sell">
              <Button className="bg-[#C46A4A] hover:bg-[#A85A3A]">
                Sell Your Books
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="inline-block text-[#C46A4A] text-sm font-semibold tracking-wide uppercase mb-2">
              Latest Arrivals
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Recently Listed Books
            </h2>
            <p className="mt-2 text-gray-600 max-w-xl">
              Discover quality books from verified sellers at great prices
            </p>
          </div>

          <Link href="/browse">
            <Button 
              variant="outline" 
              className="group border-gray-300 hover:border-[#C46A4A] hover:text-[#C46A4A] transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Books Grid - Premium Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {books.slice(0, 8).map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <Card className="h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
                  {book.images && book.images[0] ? (
                    <Image
                      src={book.images[0]}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Condition Badge */}
                  <Badge 
                    className={`absolute top-2 right-2 text-[10px] sm:text-xs font-medium border ${conditionColors[book.condition] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {conditionLabels[book.condition] || book.condition}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-3 sm:p-4">
                  {/* Category */}
                  <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
                    {book.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-1 text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#C46A4A] transition-colors">
                    {book.title}
                  </h3>

                  {/* Author */}
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-1">
                    {book.author}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-bold text-[#C46A4A]">
                      ₹{book.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/browse">
            <Button className="w-full bg-[#C46A4A] hover:bg-[#A85A3A]">
              Browse All Books
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
