import Link from "next/link";
import { GraduationCap, BookOpen, Target, Library, ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Academic",
    description: "Textbooks & study materials",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    href: "/browse?category=academic"
  },
  {
    title: "Competitive",
    description: "Exam prep & guides",
    icon: Target,
    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    href: "/browse?category=competitive"
  },
  {
    title: "Literature",
    description: "Novels & fiction",
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    href: "/browse?category=literature"
  },
  {
    title: "Reference",
    description: "Dictionaries & encyclopedias",
    icon: Library,
    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    href: "/browse?category=reference"
  }
];

export function Categories() {
  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-[#C46A4A] text-sm font-semibold tracking-wide uppercase mb-2">
            Categories
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Find Books by Category
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Browse our collection organized by your interests
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link 
                key={index} 
                href={category.href}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl ${category.color} transition-colors mb-4`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 group-hover:text-[#C46A4A] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-[#C46A4A] opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}