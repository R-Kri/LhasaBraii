import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-paper overflow-hidden">
      {/* Spotlight Effect */}
      <div 
        className="pointer-events-none absolute inset-0 animate-spotlight"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(196, 106, 74, 0.15), transparent 70%)`,
        }}
      />
      
      {/* Secondary ambient glow */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 60%, rgba(95, 138, 139, 0.08), transparent 60%)`,
        }}
      />

      {/* Floating 3D Book Illustration - Left */}
      <div className="absolute left-[5%] top-1/4 hidden lg:block animate-float opacity-20">
        <div className="w-32 h-40 bg-linear-to-br from-[#C46A4A] to-[#8B5E3C] rounded-lg shadow-2xl transform -rotate-12" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-2 bg-[#FAF7F2] rounded" />
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-[#A85A3A] to-[#C46A4A] rounded-l-lg" />
        </div>
      </div>

      {/* Floating 3D Book Illustration - Right */}
      <div className="absolute right-[8%] top-1/3 hidden lg:block animate-float-delayed opacity-20">
        <div className="w-28 h-36 bg-linear-to-br from-[#5F8A8B] to-[#4A7A7B] rounded-lg shadow-2xl transform rotate-12" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-2 bg-[#FAF7F2] rounded" />
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-[#4A7A7B] to-[#5F8A8B] rounded-l-lg" />
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          
          {/* Main Content - Centered */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Tagline with Sparkle effect */}
            <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#C46A4A]/10 to-[#8B5E3C]/10 text-[#C46A4A] text-sm font-semibold mb-8 border border-[#C46A4A]/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Trusted Book Marketplace</span>
              {/* Sparkle decorations */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C46A4A] rounded-full animate-sparkle" />
              <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#5F8A8B] rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Main Heading with Serif Font */}
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 tracking-tight leading-[1.05]">
              Buy & Sell Books
              <span className="block mt-3 gradient-text">at Great Prices</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with students and readers. Find quality textbooks, novels, and more at affordable prices.
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="group h-16 px-10 text-lg font-bold bg-linear-to-r from-[#C46A4A] to-[#A85A3A] hover:from-[#B55A3A] hover:to-[#8B4A2A] rounded-2xl shadow-xl shadow-[#C46A4A]/30 hover:shadow-2xl hover:shadow-[#C46A4A]/40 hover:scale-105 transition-all duration-300"
              >
                <Link href="/browse">
                  Browse Books
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg font-bold border-2 border-gray-300 hover:border-[#C46A4A] hover:text-[#C46A4A] hover:bg-[#C46A4A]/5 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/sell">Sell Your Books</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 sm:mt-12">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
                <div className="group text-center p-4 sm:p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 card-glow">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 font-serif-display">100+</div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Books Listed</div>
                </div>
                <div className="group text-center p-4 sm:p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 card-glow">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 font-serif-display">50+</div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Active Users</div>
                </div>
                <div className="group text-center p-4 sm:p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 card-glow">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-white mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 font-serif-display">60%</div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Avg Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}