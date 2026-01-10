import {
  ShieldCheck,
  MapPin,
  BadgeCheck,
  Handshake,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Quality Verified",
    description: "Every book's condition is clearly described so you know exactly what you're getting",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Sellers",
    description: "Connect with verified students and readers in your community",
  },
  {
    icon: MapPin,
    title: "Local Meetups",
    description: "Meet nearby sellers for safe, convenient exchanges",
  },
  {
    icon: Handshake,
    title: "P2P Payments",
    description: "Pay directly - no middleman fees, better prices for everyone",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-[#C46A4A] text-sm font-semibold tracking-wide uppercase mb-2">
            Why Lhasa
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            The Smart Way to Buy & Sell Books
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            A trusted peer-to-peer marketplace designed for students and book lovers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#C46A4A]/10 text-[#C46A4A] mb-4">
                  <Icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 md:mt-20 bg-linear-to-r from-[#C46A4A] to-[#A85A3A] rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Ready to Start?
          </h3>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            Join our community of students and readers. List your books or find your next great read today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/browse" 
              className="inline-flex items-center justify-center h-12 px-6 bg-white text-[#C46A4A] font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse Books
            </a>
            <a 
              href="/sell" 
              className="inline-flex items-center justify-center h-12 px-6 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Sell Your Books
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
