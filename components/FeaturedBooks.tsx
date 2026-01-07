import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/CustomImage";

const featuredBooks = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 89.99,
    originalPrice: 159.99,
    condition: "Like New",
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1731983568664-9c1d8a87e7a2",
    category: "Academic",
    isNew: false,
  },
  {
    id: 2,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    price: 12.99,
    originalPrice: 17.99,
    condition: "Good",
    rating: 4.9,
    reviews: 287,
    image:
      "https://images.unsplash.com/photo-1746913361326-01c3214c7540",
    category: "Fiction",
    isNew: false,
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    price: 16.99,
    originalPrice: 18.99,
    condition: "New",
    rating: 4.7,
    reviews: 456,
    image:
      "https://images.unsplash.com/photo-1619646286047-c6681c24a695",
    category: "Self-Help",
    isNew: true,
  },
  {
    id: 4,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    price: 125.99,
    originalPrice: 299.99,
    condition: "Good",
    rating: 4.5,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1595023282083-5c0d7779c88c",
    category: "Academic",
    isNew: false,
  },
];

export function FeaturedBooks() {
  const savings = (o: number, p: number) =>
    Math.round(((o - p) / o) * 100);

  return (
    <section className="py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Featured Books
            </h2>
            <p className="text-sm sm:text-base text-[#8B5E3C]">
              Hand-picked selections with great value
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-auto border-[#C46A4A] text-[#C46A4A]"
          >
            View All Books
          </Button>
        </div>

        {/* Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-3 sm:gap-5
          "
        >
          {featuredBooks.map((book) => (
            <Card
              key={book.id}
              className="bg-white border hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <ImageWithFallback
                  src={book.image}
                  alt={book.title}
                  className="w-full h-40 sm:h-56 object-cover hover:scale-105 transition-transform"
                />

                <div className="absolute top-2 left-2 space-y-1">
                  {book.isNew && (
                    <Badge className="bg-green-500">New</Badge>
                  )}
                  <Badge variant="secondary">
                    {savings(book.originalPrice, book.price)}% OFF
                  </Badge>
                </div>

                <Badge className="absolute top-2 right-2 bg-white/90 text-xs">
                  {book.condition}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-2 sm:p-4">
                <Badge variant="outline" className="mb-2 text-[10px]">
                  {book.category}
                </Badge>

                <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 text-[#2B2B2B]">
                  {book.title}
                </h3>

                <p className="text-[11px] sm:text-sm mb-2 text-[#8B5E3C]">
                  by {book.author}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(book.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-muted-foreground">
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

                <Button className="w-full text-xs sm:text-sm text-white bg-[#C46A4A]">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
