import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { GraduationCap, Heart, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/CustomImage";

const categories = [
  {
    title: "Academic Textbooks",
    description: "Essential textbooks for students across all disciplines",
    image: "https://images.unsplash.com/photo-1731983568664-9c1d8a87e7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHRleHRib29rcyUyMHN0YWNrfGVufDF8fHx8MTc1Nzc4NTM2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: GraduationCap,
    count: "2,100+ books",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Novels & Fiction",
    description: "Discover captivating stories from renowned and emerging authors",
    image: "https://images.unsplash.com/photo-1746913361326-01c3214c7540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3ZlbHMlMjBmaWN0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzU3Nzg1MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Heart,
    count: "1,800+ books",
    color: "bg-pink-50 text-pink-600"
  },
  {
    title: "Self-Help & Growth",
    description: "Transform your life with motivational and personal development books",
    image: "https://images.unsplash.com/photo-1619646286047-c6681c24a695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2tzJTIwbW90aXZhdGlvbmFsfGVufDF8fHx8MTc1Nzc4NTM2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: TrendingUp,
    count: "1,100+ books",
    color: "bg-green-50 text-green-600"
  }
];

export function Categories() {
  return (
    <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#2B2B2B' }}>Browse by Category</h2>
          <p className="max-w-2xl mx-auto" style={{ color: '#8B5E3C' }}>
            Find exactly what you're looking for in our carefully curated collection
            of books across various categories and genres.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden" style={{ backgroundColor: '#FAF7F2', borderColor: '#E0E0E0' }}>
                <div className="relative">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm mb-2" style={{ backgroundColor: '#5F8A8B', color: '#FAF7F2' }}>
                      <Icon className="w-4 h-4" />
                      <span>{category.count}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:transition-colors" style={{ color: '#2B2B2B' }}>
                    {category.title}
                  </h3>
                  <p className="mb-4" style={{ color: '#8B5E3C' }}>
                    {category.description}
                  </p>
                  <Button variant="outline" className="w-full transition-colors text-white" style={{ backgroundColor: '#C46A4A', borderColor: '#C46A4A' }}>
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}