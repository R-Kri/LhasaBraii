"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, Heart, Filter, AlertCircle, Loader2 } from "lucide-react";
import { SearchAndFilter } from "./SearchAndFilter";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  isbn?: string;
  seller_info?: {
    rating: number;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export function BrowseBooksSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [reviewStats, setReviewStats] = useState<{ [key: string]: ReviewStats }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<{ id: string; message: string; success: boolean } | null>(null);

  const handleAddToCart = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToCart(bookId);
    const result = await addToCart(bookId);
    setCartMessage({ id: bookId, message: result.message, success: result.success });
    setAddingToCart(null);

    // Clear message after 2 seconds
    setTimeout(() => setCartMessage(null), 2000);
  };

  // Fetch books on mount and when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();

        if (searchQuery) params.append("search", searchQuery);
        if (currentFilters.categories?.length) {
          params.append("category", currentFilters.categories[0]);
        }
        if (currentFilters.conditions?.length) {
          params.append("condition", currentFilters.conditions[0]);
        }
        if (currentFilters.priceRange) {
          const [min, max] = currentFilters.priceRange;
          params.append("minPrice", min);
          params.append("maxPrice", max);
        }
        if (currentFilters.sortBy) {
          params.append("sortBy", currentFilters.sortBy);
        }

        const response = await fetch(`/api/books?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch books");
        }

        const booksData = result.data || [];
        setBooks(booksData);

        // Fetch review stats for each book
        const statsMap: { [key: string]: ReviewStats } = {};
        for (const book of booksData) {
          try {
            const reviewRes = await fetch(`/api/books/${book.id}/reviews`);
            const reviewData = await reviewRes.json();
            if (reviewRes.ok) {
              statsMap[book.id] = {
                averageRating: reviewData.stats?.averageRating || 0,
                totalReviews: reviewData.stats?.totalReviews || 0,
              };
            }
          } catch (err) {
            console.error(`Failed to fetch reviews for book ${book.id}:`, err);
          }
        }
        setReviewStats(statsMap);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch books");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentFilters]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  const toggleWishlist = (bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const getConditionColor = (c: string) => {
    switch (c) {
      case "new":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "like_new":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "good":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "fair":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getConditionLabel = (c: string) => {
    const labels: { [key: string]: string } = {
      new: "New",
      like_new: "Like New",
      good: "Good",
      fair: "Fair",
    };
    return labels[c] || c;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <SearchAndFilter
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {searchQuery ? (
                  <span>
                    Results for <span className="text-[#C46A4A]">"{searchQuery}"</span>
                  </span>
                ) : (
                  "Browse Books"
                )}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                {isLoading ? "Loading..." : `Found ${books.length} book${books.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <Filter className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              No books found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Try adjusting your filters or search query to find what you're looking for
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {books.map((book) => {
              const stats = reviewStats[book.id] || { averageRating: 0, totalReviews: 0 };
              return (
                <Link href={`/books/${book.id}`} key={book.id}>
                  <Card className="group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-2xl cursor-pointer h-full">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={book.images[0] || "/placeholder.jpg"}
                        alt={book.title}
                        width={300}
                        height={200}
                        className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Condition Badge */}
                      <Badge className={`absolute top-3 right-3 border rounded-lg px-3 py-1 text-xs font-semibold ${getConditionColor(book.condition)}`}>
                        {getConditionLabel(book.condition)}
                      </Badge>

                      {/* Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(book.id);
                        }}
                        className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 rounded-full w-10 h-10 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${wishlist.includes(book.id) ? "fill-rose-500 text-rose-500" : "text-slate-700 dark:text-slate-300"}`}
                        />
                      </Button>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-bold line-clamp-2 text-slate-900 dark:text-slate-100 mb-1.5 min-h-[2.5rem] sm:min-h-[3rem]">
                        {book.title}
                      </h3>
                      <p className="text-xs sm:text-sm mb-3 text-[#8B5E3C] dark:text-[#B8956A] font-medium">
                        by {book.author}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.floor(stats.averageRating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({stats.totalReviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl sm:text-2xl font-bold text-[#C46A4A] dark:text-[#E58B6F]">
                          ₹{book.price}
                        </span>
                      </div>

                      {/* CTA Button */}
                      <div className="relative">
                        <Button
                          onClick={(e) => handleAddToCart(e, book.id)}
                          disabled={addingToCart === book.id}
                          className="w-full text-sm font-semibold text-white bg-gradient-to-r from-[#C46A4A] to-[#A85738] hover:from-[#B05939] hover:to-[#8F4729] shadow-lg shadow-[#C46A4A]/30 rounded-xl h-11 transition-all duration-300 disabled:opacity-70"
                        >
                          {addingToCart === book.id ? (
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
                        {cartMessage?.id === book.id && (
                          <div className={`absolute -top-10 left-0 right-0 text-center text-xs py-1 px-2 rounded ${cartMessage.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {cartMessage.message}
                          </div>
                        )}
                      </div>

                      {/* ISBN */}
                      {book.isbn && (
                        <p className="text-[10px] sm:text-xs mt-3 text-slate-400 dark:text-slate-600 text-center">
                          ISBN: {book.isbn}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}