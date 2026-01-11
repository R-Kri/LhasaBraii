import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';

const FeaturedBooks = dynamic(() => import('@/components/FeaturedBooks').then(mod => ({ default: mod.FeaturedBooks })), {
  loading: () => <FeaturedBooksSkeleton />,
  ssr: true,
});

const Categories = dynamic(() => import('@/components/Categories').then(mod => ({ default: mod.Categories })), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

const Features = dynamic(() => import('@/components/Features').then(mod => ({ default: mod.Features })), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

function FeaturedBooksSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-48" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-paper-warm">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<FeaturedBooksSkeleton />}>
          <FeaturedBooks />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}