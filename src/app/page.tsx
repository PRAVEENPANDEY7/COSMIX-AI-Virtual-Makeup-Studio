'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CosmixHero } from '@/components/hero/CosmixHero';
import { ShadeDiscovery } from '@/components/sections/ShadeDiscovery';
import { BrandStory } from '@/components/sections/BrandStory';
import { VirtualTryOnCTA } from '@/components/sections/VirtualTryOnCTA';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cosmix-cream">
      {/* Navigation Header */}
      <Header />

      {/* Main Experience */}
      <main className="relative">
        {/* Section 04 & 05: Cinematic Hero with 6-Beat Discovery Storytelling */}
        <CosmixHero />

        {/* Section 07: Visual Shade Discovery Atelier (Redirects to full /try-on page) */}
        <ShadeDiscovery />

        {/* Section 06: Brand Story — Why COSMIX Exists */}
        <BrandStory />

        {/* Section 09: Standalone Virtual Try-On Call To Action (Redirects to full /try-on page) */}
        <VirtualTryOnCTA />
      </main>

      {/* Platform Footer */}
      <Footer />
    </div>
  );
}
