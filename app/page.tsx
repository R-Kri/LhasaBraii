import { BrowseBooksSection } from '@/components/BrowseBooksSection';
import { Categories } from '@/components/Categories';
import { FeaturedBooks } from '@/components/FeaturedBooks';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Testimonials } from '@/components/Testimonials';
import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedBooks />
        <BrowseBooksSection />
        <Testimonials />
        <Features />
      </main>
      <Footer />
    </div>
  );
}