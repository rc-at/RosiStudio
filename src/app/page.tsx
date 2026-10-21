import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { ExperienceGallery } from '@/components/home/ExperienceGallery';
import { ProductsTeaser } from '@/components/home/ProductsTeaser';
import { BusinessInfoSection } from '@/components/home/BusinessInfoSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeaturedServices />
        <ExperienceGallery />
        <ProductsTeaser />
        <BusinessInfoSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
