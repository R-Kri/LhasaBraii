import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-linear-to-b from-[#FAF7F2] to-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          
          {/* Main Content - Centered */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C46A4A]/10 text-[#C46A4A] text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Trusted Book Marketplace</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Buy & Sell Books
              <span className="block mt-2 text-[#C46A4A]">at Great Prices</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with students and readers. Find quality textbooks, novels, and more at affordable prices.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-[#C46A4A] hover:bg-[#A85A3A] rounded-full shadow-lg shadow-[#C46A4A]/25 hover:shadow-xl hover:shadow-[#C46A4A]/30 transition-all"
              >
                <Link href="/browse">
                  Browse Books
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold border-2 border-gray-300 hover:border-[#C46A4A] hover:text-[#C46A4A] rounded-full transition-all"
              >
                <Link href="/sell">Sell Your Books</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-500">Books Listed</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">60%</div>
                  <div className="text-sm text-gray-500">Avg Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
