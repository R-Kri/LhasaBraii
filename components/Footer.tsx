import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-neutral-200" style={{ backgroundColor: '#5F8A8B' }}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-12">
        {/* Social Icons */}
        <div className="flex justify-center space-x-5 mb-6">
          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 flex items-center justify-center rounded-full border transition"
            style={{ borderColor: '#FAF7F2', color: '#FAF7F2' }}
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="w-10 h-10 flex items-center justify-center rounded-full border transition"
            style={{ borderColor: '#FAF7F2', color: '#FAF7F2' }}
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-10 h-10 flex items-center justify-center rounded-full border transition"
            style={{ borderColor: '#FAF7F2', color: '#FAF7F2' }}
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="w-10 h-10 flex items-center justify-center rounded-full border transition"
            style={{ borderColor: '#FAF7F2', color: '#FAF7F2' }}
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>

        {/* Brand & Tagline */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#FAF7F2' }}>Lhasa</h3>
          <p className="text-sm" style={{ color: '#FAF7F2' }}>
            Thoughtfully reused books. Knowledge that lives on.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-8 text-sm mb-8">
          <a href="/about" className="transition" style={{ color: '#FAF7F2' }}>
            About Us
          </a>
          <a href="/contact" className="transition" style={{ color: '#FAF7F2' }}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
