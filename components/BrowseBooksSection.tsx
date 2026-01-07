"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, Heart, Filter } from "lucide-react";
import { SearchAndFilter } from "./SearchAndFilter";
import { ImageWithFallback } from "./figma/CustomImage";

const allBooks = [ /* unchanged book data */];

export function BrowseBooksSection() {
  const [filteredBooks, setFilteredBooks] = useState(allBooks);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters({ ...currentFilters, searchQuery: query });
  };

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
    applyFilters({ ...filters, searchQuery });
  };

  const applyFilters = (filters: any) => {
    let filtered = [...allBooks];

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      );
    }

    if (filters.categories?.length) {
      filtered = filtered.filter(b =>
        filters.categories.some((c: string) =>
          b.category === c.toLowerCase().replace(/\s+/g, "-")
        )
      );
    }

    if (filters.conditions?.length) {
      filtered = filtered.filter(b =>
        filters.conditions.includes(b.condition)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(b => b.price >= min && b.price <= max);
    }

    if (filters.sortBy) {
      if (filters.sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
      if (filters.sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
      if (filters.sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
      if (filters.sortBy === "newest") filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredBooks(filtered);
  };

  const savings = (o: number, p: number) =>
    Math.round(((o - p) / o) * 100);

  const getConditionColor = (c: string) => {
    switch (c) {
      case "New": return "bg-green-100 text-green-800";
      case "Like New": return "bg-blue-100 text-blue-800";
      case "Very Good": return "bg-purple-100 text-purple-800";
      case "Good": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-2">
      <SearchAndFilter
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2B2B2B]">
            {searchQuery ? `Results for “${searchQuery}”` : "All Books"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="mx-auto w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No books found</h3>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCurrentFilters({});
                setFilteredBooks(allBooks);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-3 sm:gap-4 lg:gap-6
          "
          >

            {filteredBooks.map(book => (
              <Card
                key={book.id}
                className="group bg-white border hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative">
                  <ImageWithFallback
                    src={book.image}
                    alt={book.title}
                    className="w-full h-44 sm:h-56 object-cover group-hover:scale-105 transition-transform"
                  />

                  <div className="absolute top-2 left-2 space-y-1">
                    {book.isNew && <Badge className="bg-green-500">New</Badge>}
                    <Badge variant="secondary">
                      {savings(book.originalPrice, book.price)}% OFF
                    </Badge>
                  </div>

                  <Badge className={`absolute top-2 right-2 ${getConditionColor(book.condition)}`}>
                    {book.condition}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-white/80"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 text-[#2B2B2B]">
                    {book.title}
                  </h3>
                  <p className="text-xs mb-2 text-[#8B5E3C]">
                    by {book.author}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(book.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {book.rating} ({book.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-[#C46A4A]">
                      ₹{book.price}
                    </span>
                    <span className="text-xs line-through text-gray-400">
                      ₹{book.originalPrice}
                    </span>
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full text-sm text-white bg-[#C46A4A]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  {book.isbn && (
                    <p className="text-[10px] mt-2 text-gray-400">
                      ISBN: {book.isbn}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
