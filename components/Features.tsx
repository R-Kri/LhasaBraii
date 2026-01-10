'use client';

import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  BadgeCheck,
  Handshake,
  Zap,
  ArrowRight,
  CheckCircle2,
  Quote,
  Star,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Quality Verified",
    description: "Clear condition descriptions for every book",
    gradient: "from-emerald-400 to-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.3)",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Sellers",
    description: "Verified students in your community",
    gradient: "from-blue-400 to-blue-600",
    glowColor: "rgba(59, 130, 246, 0.3)",
  },
  {
    icon: MapPin,
    title: "Local Meetups",
    description: "Safe, convenient campus exchanges",
    gradient: "from-purple-400 to-purple-600",
    glowColor: "rgba(168, 85, 247, 0.3)",
  },
  {
    icon: Handshake,
    title: "P2P Payments",
    description: "No middleman fees, better prices",
    gradient: "from-amber-400 to-amber-600",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Student",
    avatar: "PS",
    content: "Saved ₹3,000 on my semester books! The quality was exactly as described.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Medical Student",
    avatar: "RV",
    content: "Finally found rare NEET prep books at affordable prices. Highly recommend!",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Literature Major",
    avatar: "AP",
    content: "Sold all my old novels within a week. Easy process and great buyers!",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Law Student",
    avatar: "VS",
    content: "The condition verification gives me confidence in every purchase.",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "Commerce Student",
    avatar: "SR",
    content: "Best platform for second-hand books. Saved so much money this year!",
    rating: 5,
  },
  {
    name: "Arjun Kumar",
    role: "Science Student",
    avatar: "AK",
    content: "Quick transactions and genuine sellers. Love this marketplace!",
    rating: 5,
  },
];

const trustedSellers = [
  { name: "Priya S.", avatar: "PS", color: "bg-rose-500" },
  { name: "Rahul V.", avatar: "RV", color: "bg-blue-500" },
  { name: "Ananya P.", avatar: "AP", color: "bg-purple-500" },
  { name: "Vikram S.", avatar: "VS", color: "bg-emerald-500" },
  { name: "Sneha R.", avatar: "SR", color: "bg-amber-500" },
  { name: "Arjun K.", avatar: "AK", color: "bg-cyan-500" },
];

const benefits = [
  "Save up to 60% on textbooks",
  "Earn money from old books",
  "Verified student community",
  "Safe campus exchanges",
];

export function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid - Enhanced with Gradients */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C46A4A]/10 text-[#C46A4A] text-sm font-semibold mb-5 border border-[#C46A4A]/20">
            <Zap className="w-4 h-4" />
            Why Choose Us
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Built for Students
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            A marketplace designed with your needs in mind
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 card-glow transition-all duration-500 hover:-translate-y-2"
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{ background: feature.glowColor }}
                />
                
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br ${feature.gradient} text-white mb-4 sm:mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Social Proof Section - Animated Avatars */}
        <div className="mb-12 sm:mb-14">
          <div className="text-center mb-10">
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Trusted by Students Like You
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Join our growing community of happy book lovers
            </p>
          </div>

          {/* Animated Avatar Strip */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex -space-x-3">
              {trustedSellers.map((seller, index) => (
                <div
                  key={index}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full ${seller.color} flex items-center justify-center text-white font-bold text-sm sm:text-base border-3 border-white shadow-lg hover:scale-110 hover:z-10 transition-transform cursor-pointer`}
                  title={seller.name}
                >
                  {seller.avatar}
                </div>
              ))}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm border-3 border-white shadow-lg">
                +50
              </div>
            </div>
          </div>

          {/* Infinite Moving Cards - Testimonials */}
          <div className="relative overflow-hidden py-4">
            {/* Gradient fade left */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-linear-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
            {/* Gradient fade right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-linear-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-scroll">
              {/* First set of testimonials */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="shrink-0 w-[300px] sm:w-[350px] mx-3 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#C46A4A] to-[#8B5E3C] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                    <Quote className="w-6 h-6 text-[#C46A4A]/30 ml-auto" />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner - Modern Design with Dark Section */}
        <div className="relative rounded-3xl overflow-hidden bg-dark-section">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C46A4A]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#5F8A8B]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          {/* Content */}
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <div className="max-w-2xl">
              <h3 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Start Saving on<br className="sm:hidden" /> Books Today
              </h3>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-lg">
                Join thousands of students who are already saving money and making smart choices with their textbooks.
              </p>

              {/* Benefits list */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-white/90 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/browse" 
                  className="group inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-100 hover:scale-105 active:scale-100 transition-all shadow-xl"
                >
                  Browse Books
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/sell" 
                  className="inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all"
                >
                  Start Selling
                </Link>
              </div>
            </div>

            {/* Decorative 3D Books on right */}
            <div className="absolute right-8 lg:right-20 top-1/2 -translate-y-1/2 hidden lg:block">
              <div className="relative">
                <div className="w-32 h-44 bg-linear-to-br from-[#C46A4A] to-[#8B5E3C] rounded-lg shadow-2xl transform rotate-6 absolute -right-8 -top-4">
                  <div className="absolute inset-2 bg-[#FAF7F2] rounded" />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-[#A85A3A] to-[#C46A4A] rounded-l-lg" />
                </div>
                <div className="w-28 h-40 bg-linear-to-br from-[#5F8A8B] to-[#4A7A7B] rounded-lg shadow-2xl transform -rotate-6">
                  <div className="absolute inset-2 bg-[#FAF7F2] rounded" />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-[#4A7A7B] to-[#5F8A8B] rounded-l-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
