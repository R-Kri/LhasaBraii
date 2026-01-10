import Link from "next/link";
import { GraduationCap, BookOpen, Target, Library, ArrowRight, Compass } from "lucide-react";

const categories = [
  {
    title: "Academic",
    description: "Textbooks, notes & study guides for your coursework",
    icon: GraduationCap,
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.4)",
    iconColor: "text-blue-500",
    count: "45+ books",
    href: "/browse?category=academic",
    size: "large"
  },
  {
    title: "Competitive",
    description: "UPSC, JEE, NEET prep materials",
    icon: Target,
    gradient: "from-emerald-500 via-emerald-600 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.4)",
    iconColor: "text-emerald-500",
    count: "30+ books",
    href: "/browse?category=competitive",
    size: "small"
  },
  {
    title: "Literature",
    description: "Novels, poetry & timeless classics",
    icon: BookOpen,
    gradient: "from-purple-500 via-purple-600 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.4)",
    iconColor: "text-purple-500",
    count: "25+ books",
    href: "/browse?category=literature",
    size: "small"
  },
  {
    title: "Reference",
    description: "Dictionaries, encyclopedias & guides",
    icon: Library,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    iconColor: "text-amber-500",
    count: "15+ books",
    href: "/browse?category=reference",
    size: "medium"
  }
];

export function Categories() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-paper relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C46A4A]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#5F8A8B]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5F8A8B]/10 text-[#5F8A8B] text-sm font-semibold mb-5 border border-[#5F8A8B]/20">
            <Compass className="w-4 h-4" />
            Explore Categories
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Find What You Need
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Browse thousands of books organized by category
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Academic - Large vertical block on the left */}
          <Link 
            href={categories[0].href}
            className="group md:row-span-2 bento-item"
          >
            <div 
              className="relative h-full min-h-[300px] md:min-h-[500px] rounded-3xl overflow-hidden border border-gray-100 card-glow transition-all duration-500 hover:-translate-y-2"
              style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #ffffff 100%)' }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className={`absolute inset-0 bg-linear-to-br ${categories[0].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
              
              {/* Glow effect */}
              <div 
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: categories[0].glowColor }}
              />

              {/* 3D Icon Illustration */}
              <div className="absolute top-8 right-8 w-32 h-32 sm:w-40 sm:h-40 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className={`w-full h-full rounded-3xl bg-linear-to-br ${categories[0].gradient} transform rotate-12 group-hover:rotate-6 transition-transform duration-500`} />
              </div>

              <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br ${categories[0].gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <div className="mt-auto">
                  {/* Count badge */}
                  <span className="inline-block px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4">
                    {categories[0].count}
                  </span>

                  <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {categories[0].title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base mb-6">
                    {categories[0].description}
                  </p>
                  
                  {/* Browse link */}
                  <div className="flex items-center text-base font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Explore</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Competitive - Top right */}
          <Link 
            href={categories[1].href}
            className="group bento-item"
          >
            <div 
              className="relative h-full min-h-[220px] rounded-3xl overflow-hidden border border-gray-100 card-glow transition-all duration-500 hover:-translate-y-2"
              style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #ffffff 100%)' }}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${categories[1].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div 
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: categories[1].glowColor }}
              />

              <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${categories[1].gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {categories[1].count}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-display text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                    {categories[1].title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {categories[1].description}
                  </p>
                  <div className="flex items-center text-sm font-bold text-emerald-600">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Literature - Bottom right (stacked with Competitive) */}
          <Link 
            href={categories[2].href}
            className="group bento-item"
          >
            <div 
              className="relative h-full min-h-[220px] rounded-3xl overflow-hidden border border-gray-100 card-glow transition-all duration-500 hover:-translate-y-2"
              style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #ffffff 100%)' }}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${categories[2].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div 
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: categories[2].glowColor }}
              />

              <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${categories[2].gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                    {categories[2].count}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-display text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                    {categories[2].title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {categories[2].description}
                  </p>
                  <div className="flex items-center text-sm font-bold text-purple-600">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Reference - Wide bottom spanning 2 columns */}
          <Link 
            href={categories[3].href}
            className="group md:col-span-2 bento-item"
          >
            <div 
              className="relative h-full min-h-[180px] rounded-3xl overflow-hidden border border-gray-100 card-glow transition-all duration-500 hover:-translate-y-2"
              style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #ffffff 100%)' }}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${categories[3].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div 
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: categories[3].glowColor }}
              />

              {/* Decorative illustration */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
                <div className={`w-full h-full rounded-2xl bg-linear-to-br ${categories[3].gradient} transform -rotate-12 group-hover:rotate-0 transition-transform duration-500`} />
              </div>

              <div className="relative h-full p-6 sm:p-8 flex items-center gap-6">
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-linear-to-br ${categories[3].gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                  <Library className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {categories[3].title}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      {categories[3].count}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {categories[3].description}
                  </p>
                </div>

                <div className="hidden sm:flex items-center text-base font-bold text-amber-600 shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link 
            href="/browse" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Browse All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}