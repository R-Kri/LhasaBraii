import { Card, CardContent } from "./ui/card";
import {
  ShieldCheck,
  RefreshCw,
  MapPin,
  CreditCard,
  BookOpen,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Verified Pre-Owned Books",
    description:
      "All books are checked for missing pages, damage, and readability",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description:
      "Clear condition grading so you always know what you’re buying",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description:
      "7-day return window if the book doesn’t match the description",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "UPI, Debit Cards, Credit Cards & Net Banking supported",
  },
  {
    icon: Users,
    title: "Student Friendly Prices",
    description:
      "Save up to 60% compared to new book prices (₹)",
  },
  {
    icon: MapPin,
    title: "Local Pickup Option",
    description:
      "Collect books directly from nearby sellers when available",
  },
];

export function Features() {
  return (
    <section className="py-14 bg-white">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mb-3">
            Why Choose Lhasa?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#8B5E3C]">
            Affordable, trusted, and sustainable book reselling for students
            and readers across India.
          </p>
        </div>

        {/* Features Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-3
            gap-4
            max-w-6xl
            mx-auto
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                className="
                  bg-[#FAF7F2]
                  border border-[#E0E0E0]
                  rounded-xl
                  hover:shadow-md
                  transition-all
                  duration-300
                "
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  {/* Icon */}
                  <div
                    className="
                      w-10 h-10
                      mx-auto mb-3
                      rounded-full
                      flex items-center justify-center
                      bg-[#E8DFD3]
                      text-[#C46A4A]
                    "
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#8B5E3C] leading-snug">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
