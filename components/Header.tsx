'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, User, Menu, LogOut, X, BookOpen, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Header() {
  const { summary: cartSummary } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsProfileOpen(false)
    router.push('/')
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl backdrop-blur-lg' : 'shadow-md'
          }`}
        style={{
          backgroundColor: scrolled ? 'rgba(95, 138, 139, 0.95)' : '#5F8A8B'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo - Enhanced Design */}
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0 group">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
                style={{ backgroundColor: '#8B5E3C' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Lhasa</h1>
                <p className="text-[10px] sm:text-xs font-medium leading-none" style={{ color: '#FAF7F2', opacity: 0.9 }}>
                  Book Store
                </p>
              </div>
            </Link>

            {/* Search Bar - Enhanced with Glass Effect */}
            <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden lg:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white opacity-60 group-focus-within:opacity-100 transition-opacity" />
                <Input
                  placeholder="Search for books, authors..."
                  className="pl-11 pr-4 h-11 rounded-full border-0 focus:ring-2 focus:ring-white/50 placeholder:text-white placeholder:opacity-60 font-medium text-sm transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FAF7F2',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FAF7F2' }}>
                  ⌘K
                </div>
              </div>
            </div>

            {/* Navigation - Enhanced */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/sell', label: 'Sell Books' },
                { href: '/browse', label: 'Browse' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-200"
                  style={{ color: '#FAF7F2' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons - Enhanced */}
            <div className="flex items-center space-x-2 sm:space-x-3 ml-4">

              {/* Cart Button with Badge */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:flex hover:bg-white/10 transition-all rounded-full group"
                  style={{ color: '#FAF7F2' }}
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartSummary.itemCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg ring-2 ring-white/20"
                      style={{ backgroundColor: '#C46A4A' }}
                    >
                      {cartSummary.itemCount > 9 ? '9+' : cartSummary.itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Auth Section */}
              {loading ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(139, 94, 60, 0.4)' }} />
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    type="button"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-sm font-bold hover:shadow-xl transition-all hover:scale-105 ring-2 ring-white/20 hover:ring-white/40 focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ backgroundColor: '#8B5E3C' }}
                  >
                    {getInitials(user.email || 'U')}
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl py-2 z-[9999] border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
                      style={{
                        backgroundColor: 'rgba(250, 247, 242, 0.98)',
                        borderColor: 'rgba(95, 138, 139, 0.2)',
                        pointerEvents: 'auto'
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(95, 138, 139, 0.15)' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: '#2B2B2B', opacity: 0.6 }}>Signed in as</p>
                        <p className="text-sm font-bold truncate" style={{ color: '#2B2B2B' }}>{user.email}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 hover:bg-gray-100/80 transition-colors group"
                          style={{ color: '#2B2B2B' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#5F8A8B20' }}>
                            <User className="w-4 h-4" style={{ color: '#5F8A8B' }} />
                          </div>
                          <span className="text-sm font-semibold">My Profile</span>
                        </Link>

                        <Link
                          href="/my-books"
                          className="flex items-center px-4 py-3 hover:bg-gray-100/80 transition-colors group"
                          style={{ color: '#2B2B2B' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#8B5E3C20' }}>
                            <BookOpen className="w-4 h-4" style={{ color: '#8B5E3C' }} />
                          </div>
                          <span className="text-sm font-semibold">My Books</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-3 hover:bg-gray-100/80 transition-colors group"
                          style={{ color: '#2B2B2B' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#C46A4A20' }}>
                            <ShoppingCart className="w-4 h-4" style={{ color: '#C46A4A' }} />
                          </div>
                          <span className="text-sm font-semibold">My Orders</span>
                        </Link>

                        <Link
                          href="/sales"
                          className="flex items-center px-4 py-3 hover:bg-gray-100/80 transition-colors group"
                          style={{ color: '#2B2B2B' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#22C55E20' }}>
                            <span className="text-sm" style={{ color: '#22C55E' }}>₹</span>
                          </div>
                          <span className="text-sm font-semibold">My Sales</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 hover:bg-gray-100/80 transition-colors group"
                            style={{ color: '#2B2B2B' }}
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#EF444420' }}>
                              <Shield className="w-4 h-4" style={{ color: '#EF4444' }} />
                            </div>
                            <span className="text-sm font-semibold">Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t pt-2" style={{ borderColor: 'rgba(95, 138, 139, 0.15)' }}>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform bg-red-50">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-5 sm:px-7 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#C46A4A' }}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-white/10 rounded-full"
                style={{ color: '#FAF7F2' }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white opacity-60" />
              <Input
                placeholder="Search books..."
                className="pl-10 pr-4 h-10 rounded-full border-0 w-full text-sm placeholder:text-white placeholder:opacity-60 font-medium"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FAF7F2' }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Curved Bottom Border with Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none">
          <svg
            className="absolute bottom-0 w-full h-6"
            viewBox="0 0 1440 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#5F8A8B', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#5F8A8B', stopOpacity: 0.95 }} />
                <stop offset="100%" style={{ stopColor: '#5F8A8B', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M0 0C240 20 480 32 720 32C960 32 1200 20 1440 0V32H0V0Z"
              fill="url(#headerGradient)"
            />
          </svg>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div
            className="lg:hidden border-t backdrop-blur-lg"
            style={{
              backgroundColor: 'rgba(95, 138, 139, 0.98)',
              borderColor: 'rgba(255, 255, 255, 0.15)'
            }}
          >
            <nav className="py-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
              {[
                { href: '/', label: 'Home', icon: '🏠' },
                { href: '/sell', label: 'Sell Books', icon: '💰' },
                { href: '/browse', label: 'Browse', icon: '📚' },
                { href: '/about', label: 'About', icon: 'ℹ️' },
                { href: '/contact', label: 'Contact', icon: '📧' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-3 rounded-xl mx-2 text-sm font-semibold hover:bg-white/10 transition-all group"
                  style={{ color: '#FAF7F2' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3 text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              {/* Mobile Cart Link */}
              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-xl mx-2 text-sm font-semibold hover:bg-white/10 transition-all sm:hidden group"
                style={{ color: '#FAF7F2' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  Shopping Cart
                </div>
                {cartSummary.itemCount > 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#C46A4A' }}>
                    {cartSummary.itemCount > 9 ? '9+' : cartSummary.itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}