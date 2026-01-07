import { ImageWithFallback } from "./figma/CustomImage";
import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="
        relative
        min-h-[calc(100vh-80px)]
        flex items-center
        py-10 sm:py-14 lg:py-20
        bg-[#FAF7F2]
        overflow-hidden
      "
    >
      {/* Background Patterns */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #8B5E3C15 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 80%, #5F8A8B15 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm">
              <span className="text-lg">📖</span>
              <span className="text-xs sm:text-sm font-semibold text-[#2B2B2B]">
                Quality Books at Great Prices
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                font-bold tracking-tight
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                xl:text-7xl
                leading-tight
                text-[#2B2B2B]
              "
            >
              Discover Your Next{" "}
              <span className="block sm:inline text-[#8B5E3C]">
                Great Read
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 text-[#2B2B2B]/75 leading-relaxed">
              New and pre-owned books for students and readers. Find textbooks,
              novels, and self-help books at affordable prices across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="
                  w-full sm:w-auto
                  rounded-full
                  px-7 py-5
                  text-base font-semibold
                  text-white
                  bg-[#C46A4A]
                  hover:scale-105
                  transition-all
                "
              >
                <Link href="/browse">Browse Books</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="
                  w-full sm:w-auto
                  rounded-full
                  px-7 py-5
                  text-base font-semibold
                  border-2
                  text-[#5F8A8B]
                  border-[#5F8A8B]
                  hover:scale-105
                  transition-all
                  bg-white
                "
              >
                <Link href="/sell">Sell Your Books</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0 pt-4">
              {["New", "Quality", "Affordable"].map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-3 sm:p-4 bg-white/60 text-center lg:text-left"
                >
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#C46A4A]">
                    {item}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#2B2B2B]/70">
                    {item === "New"
                      ? "Fresh Arrivals"
                      : item === "Quality"
                      ? "Guaranteed"
                      : "Pricing"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">

              {/* Decorative Blobs */}
              <div className="absolute -top-6 -left-6 w-28 h-28 bg-[#C46A4A] opacity-30 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#8B5E3C] opacity-30 blur-3xl rounded-full" />

              {/* Image */}
              <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ImageWithFallback
                  src="https://i.pinimg.com/1200x/e0/af/fe/e0affe08d5b685236ffdbe745a962713.jpg"
                  alt="Quality books collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
