import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { MobileAppHero } from '@/components/home/MobileAppHero';
import { CategoryChips } from '@/components/home/CategoryChips';
import { PopularServicesScroll } from '@/components/home/PopularServicesScroll';
import { LooksGalleryScroll } from '@/components/home/LooksGalleryScroll';
import { ProductsScroll } from '@/components/home/ProductsScroll';
import { CompactSalonInfo } from '@/components/home/CompactSalonInfo';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <AppHeader />

      <main className="flex-1 pb-6 space-y-2">
        <MobileAppHero />
        <CategoryChips />
        <PopularServicesScroll />
        <LooksGalleryScroll />
        <ProductsScroll />
        <CompactSalonInfo />
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}
