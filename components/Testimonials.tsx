import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/CustomImage";

const testimonials = [
  {
    id: 1,
    name: "Tashi Tsering",
    role: "BA Student",
    university: "Indira Gandhi Govt. College, Tezu",
    rating: 5,
    comment:
      "Getting affordable books in Tezu was always difficult. This platform helped me find my semester books at almost half the price. Very useful for students like us.",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Romiso Kri",
    role: "Lecturer",
    university: "Government Higher Secondary School, Wakro",
    rating: 5,
    comment:
      "I found reference books that are rarely available in local stores. The condition details were honest and the delivery was smooth.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 3,
    name: "Mina Dihing",
    role: "Avid Reader",
    university: "Tezu",
    rating: 5,
    comment:
      "I love reading novels but options here are limited. I was happy to find good-quality fiction books at reasonable prices.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 4,
    name: "Simulso Pul",
    role: "BSc Student",
    university: "RGU Affiliated College",
    rating: 5,
    comment:
      "I sold my old textbooks easily and used the money to buy new ones. It really helped reduce my expenses this semester.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 5,
    name: "Anilu Tayang",
    role: "Competitive Exam Aspirant",
    university: "Self-study",
    rating: 5,
    comment:
      "Finding exam preparation books in Lohit is tough. This made it simple and affordable. Highly recommended for serious aspirants.",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 6,
    name: "Bikash Roy",
    role: "Diploma Student",
    university: "ITI, Tezu",
    rating: 5,
    comment:
      "The search feature saved a lot of time. I quickly found the exact books I needed without running around different shops.",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    verified: true,
  },
];


export function Testimonials() {
  return (
    <section className="py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mb-3">
            What Our Community Says
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#8B5E3C]">
            Trusted by students, educators, and readers worldwide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            gap-3 sm:gap-5
          "
        >
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="bg-white border hover:shadow-md transition-all"
            >
              <CardContent className="p-3 sm:p-5">
                <Quote className="w-6 h-6 mb-2 text-[#C46A4A]/30" />

                {/* Rating */}
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < t.rating
                          ? "text-[#C46A4A] fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#2B2B2B] leading-relaxed mb-4 line-clamp-4">
                  “{t.comment}”
                </p>

                {/* User */}
                <div className="flex items-center gap-2">
                  <ImageWithFallback
                    src={t.image}
                    alt={t.name}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#2B2B2B]">
                        {t.name}
                      </h4>
                      {t.verified && (
                        <Badge className="text-[10px] bg-[#5F8A8B] text-white">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#8B5E3C]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            ["4.9/5", "Average Rating"],
            ["98%", "Customer Satisfaction"],
            ["24hr", "Avg. Response Time"],
            ["₹20,000+", "Avg. Student Savings"],
          ].map(([value, label], i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-[#C46A4A]">{value}</div>
              <div className="text-xs sm:text-sm text-[#8B5E3C]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
