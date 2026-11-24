'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COSMIX_SHADES, SHADE_FAMILIES, CosmixShade, ShadeFamily } from '@/data/shades';
import { ScanFace, Heart, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { useFavouritesStore } from '@/stores/favourites-store';

interface ShadeDiscoveryProps {
  onOpenTryOn?: (shade: CosmixShade) => void;
}

export const ShadeDiscovery: React.FC<ShadeDiscoveryProps> = ({ onOpenTryOn }) => {
  const router = useRouter();
  const [activeFamily, setActiveFamily] = useState<ShadeFamily>('PINKS');
  const [activeShade, setActiveShade] = useState<CosmixShade>(
    COSMIX_SHADES.find((s) => s.id === 'dusty-rose') || COSMIX_SHADES[0]
  );
  const swatchesScrollRef = useRef<HTMLDivElement>(null);

  const { setSelectedShade } = useStudioStore();
  const { isFavourite, toggleFavourite } = useFavouritesStore();

  const filteredShades = COSMIX_SHADES.filter((s) => s.family === activeFamily);
  const isSaved = isFavourite(activeShade.id);

  // Auto-scroll swatch into view in the slider whenever active shade changes
  useEffect(() => {
    if (swatchesScrollRef.current) {
      const activeBtn = swatchesScrollRef.current.querySelector<HTMLButtonElement>(
        `[data-shade-id="${activeShade.id}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeShade.id]);

  // Handle previous shade cycling (lipstick arrow)
  const handlePrevShade = () => {
    const currentIndex = filteredShades.findIndex((s) => s.id === activeShade.id);
    const prevIndex = (currentIndex - 1 + filteredShades.length) % filteredShades.length;
    setActiveShade(filteredShades[prevIndex]);
  };

  // Handle next shade cycling (lipstick arrow)
  const handleNextShade = () => {
    const currentIndex = filteredShades.findIndex((s) => s.id === activeShade.id);
    const nextIndex = (currentIndex + 1) % filteredShades.length;
    setActiveShade(filteredShades[nextIndex]);
  };

  // Smooth scroll for swatches slider
  const scrollSwatches = (direction: 'left' | 'right') => {
    if (swatchesScrollRef.current) {
      const scrollAmount = 260;
      swatchesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleTryOn = (shade: CosmixShade) => {
    setSelectedShade({
      id: shade.id,
      name: shade.name,
      hex: shade.hex,
      category: 'Red',
      defaultFinish: shade.finish.toLowerCase() as 'matte' | 'satin' | 'gloss',
      description: shade.description,
      rgb: [
        parseInt(shade.hex.slice(1, 3), 16),
        parseInt(shade.hex.slice(3, 5), 16),
        parseInt(shade.hex.slice(5, 7), 16),
      ],
    });

    if (onOpenTryOn) {
      onOpenTryOn(shade);
    } else {
      router.push('/try-on');
    }
  };

  return (
    <section id="shades" className="py-12 sm:py-16 lg:py-20 bg-cosmix-cream text-cosmix-dark relative overflow-hidden">
      {/* Subtle background watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.035] font-serif text-[240px] lg:text-[300px] font-bold text-cosmix-wine leading-none">
        ATELIER
      </div>

      {/* Stretched Luxury Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 relative z-10">
        {/* Streamlined Top Bar: Title & Family Filters without boxes */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 pb-6 sm:pb-8 mb-8 sm:mb-10 border-b border-cosmix-wine/10">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono tracking-[0.28em] uppercase text-cosmix-deep">
              <span className="w-4 sm:w-6 h-px bg-cosmix-deep inline-block" />
              <span>Virtual Shade Atelier</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[48px] font-light tracking-tight text-cosmix-wine leading-tight">
              Discover Your Shade. <span className="italic font-normal">Before you decide.</span>
            </h2>
          </div>

          {/* Minimalist Family Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            {SHADE_FAMILIES.map((family) => {
              const isActive = activeFamily === family.id;
              return (
                <button
                  key={family.id}
                  onClick={() => {
                    setActiveFamily(family.id);
                    const firstOfFamily = COSMIX_SHADES.find((s) => s.family === family.id);
                    if (firstOfFamily) setActiveShade(firstOfFamily);
                  }}
                  className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-sans tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cosmix-wine text-white font-medium shadow-sm'
                      : 'bg-white/60 text-cosmix-wine/75 hover:bg-white hover:text-cosmix-wine border border-cosmix-dusty/25'
                  }`}
                >
                  {family.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slick, Open Canvas Workspace (No card "dabbe" containers, 1.1x Balanced Scale) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          {/* Left Column: Freely Floating 3D Lipstick Bullet Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Atmospheric Diffuse Glow matching the active lipstick shade */}
            <div
              className="absolute w-76 h-76 sm:w-88 sm:h-88 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none -translate-y-4"
              style={{ backgroundColor: activeShade.hex }}
            />

            {/* Floating 3D Lipstick Bullet (1.1x Scale) */}
            <div className="relative z-10 flex flex-col items-center py-4 group transition-transform duration-500 hover:scale-[1.03]">
              {/* Bullet Tip */}
              <div
                className="w-22 sm:w-24 h-40 sm:h-44 rounded-t-full shadow-2xl transition-colors duration-500 relative overflow-hidden"
                style={{
                  backgroundColor: activeShade.hex,
                  boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.32), inset 5px 0 10px rgba(255,255,255,0.45), 0 12px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div className="absolute inset-y-0 left-4 w-2.5 bg-white/35 blur-xs transform -skew-x-12" />
              </div>

              {/* Gold Ring Collar */}
              <div className="w-26 sm:w-28 h-5.5 bg-gradient-to-r from-cosmix-gold via-[#f3e3ce] to-cosmix-gold border-y border-[#b08b52] shadow-sm" />

              {/* Luxury Base Casing */}
              <div className="w-26 sm:w-28 h-44 sm:h-48 bg-gradient-to-r from-[#211114] via-[#462427] to-[#211114] rounded-b-md shadow-2xl flex flex-col items-center justify-between py-4 border-t border-cosmix-gold/30">
                <span className="font-serif text-[11px] tracking-[0.32em] text-cosmix-gold/90 uppercase font-semibold">
                  COSMIX
                </span>
                <div className="w-10 h-px bg-cosmix-gold/40" />
                <span className="font-mono text-[9px] text-cosmix-gold/70 tracking-widest">
                  STUDIO
                </span>
              </div>

              {/* Grounding Contact Shadow */}
              <div className="w-36 h-4 rounded-full bg-cosmix-wine/15 blur-md -mt-1" />
            </div>

            {/* Slick Arrow Navigation Directly Beneath Lipstick (No box boundary) */}
            <div className="w-full max-w-xs flex items-center justify-between pt-6 mt-2">
              {/* Previous Shade Arrow */}
              <button
                onClick={handlePrevShade}
                className="w-10 h-10 rounded-full border border-cosmix-wine/20 bg-white/70 hover:bg-white text-cosmix-wine flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer group"
                title="Previous Shade"
                aria-label="Previous Shade"
              >
                <ChevronLeft className="w-5 h-5 text-cosmix-wine group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Active Shade Name & Finish */}
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-serif text-xl sm:text-2xl font-normal text-cosmix-wine leading-tight">
                  {activeShade.name}
                </span>
                <span className="text-[11px] font-mono uppercase text-cosmix-deep tracking-widest mt-1">
                  {activeShade.finish} • {activeShade.undertone}
                </span>
              </div>

              {/* Next Shade Arrow */}
              <button
                onClick={handleNextShade}
                className="w-10 h-10 rounded-full border border-cosmix-wine/20 bg-white/70 hover:bg-white text-cosmix-wine flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer group"
                title="Next Shade"
                aria-label="Next Shade"
              >
                <ChevronRight className="w-5 h-5 text-cosmix-wine group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Seamless Palette Slider & Editorial Shade Story */}
          <div className="lg:col-span-7 flex flex-col space-y-7">
            {/* Swatches Horizontal Slider Track (No card box) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono tracking-widest text-cosmix-deep uppercase text-xs font-semibold">
                    {activeFamily} Palette
                  </span>
                </div>

                {/* Slider Scroll Arrows */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => scrollSwatches('left')}
                    className="w-7 h-7 rounded-full border border-cosmix-wine/20 bg-white/70 hover:bg-white text-cosmix-wine flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
                    aria-label="Scroll left"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollSwatches('right')}
                    className="w-7 h-7 rounded-full border border-cosmix-wine/20 bg-white/70 hover:bg-white text-cosmix-wine flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
                    aria-label="Scroll right"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Swatches Track (1.1x Scale) */}
              <div
                ref={swatchesScrollRef}
                className="flex items-center gap-3.5 overflow-x-auto scrollbar-none scroll-smooth py-2 px-0.5"
              >
                {filteredShades.map((shade) => {
                  const isSelected = activeShade.id === shade.id;

                  return (
                    <button
                      key={shade.id}
                      data-shade-id={shade.id}
                      onClick={() => setActiveShade(shade)}
                      className="group flex flex-col items-center space-y-2 shrink-0 w-16 sm:w-20 focus:outline-none cursor-pointer"
                      title={`${shade.name} (${shade.finish})`}
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 relative flex items-center justify-center shadow-md ${
                          isSelected
                            ? 'ring-2 ring-offset-3 ring-offset-cosmix-cream ring-cosmix-wine scale-110 shadow-lg'
                            : 'hover:scale-105 ring-1 ring-black/10 opacity-90 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: shade.hex }}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white drop-shadow stroke-[2.5]" />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-sans text-center leading-tight truncate w-full transition-colors ${
                          isSelected
                            ? 'font-semibold text-cosmix-wine'
                            : 'font-medium text-cosmix-wine/75 group-hover:text-cosmix-wine'
                        }`}
                      >
                        {shade.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-full h-px bg-cosmix-wine/10" />

            {/* Selected Shade Editorial Showcase (Clean & Unboxed, 1.1x Scale) */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-widest text-cosmix-deep uppercase font-semibold">
                    {activeShade.family} • {activeShade.undertone}
                  </span>
                  <h3 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-light text-cosmix-wine leading-none">
                    {activeShade.name}
                  </h3>
                </div>

                {/* Save Favourite Pill */}
                <button
                  onClick={() => toggleFavourite(activeShade)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-sans transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-rosewood-50 border-rosewood-300 text-rosewood-800'
                      : 'border-cosmix-wine/25 text-cosmix-wine hover:border-cosmix-wine bg-white/40'
                  }`}
                  title={isSaved ? 'Remove from favourites' : 'Save to favourites'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isSaved ? 'fill-rosewood-700 text-rosewood-700' : 'text-cosmix-wine'
                    }`}
                  />
                  <span>{isSaved ? 'Saved to Favourites' : 'Save Favourite'}</span>
                </button>
              </div>

              <p className="font-sans text-sm sm:text-base text-cosmix-wine/85 leading-relaxed max-w-2xl font-light">
                {activeShade.description}
              </p>

              {/* Minimal Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/70 border border-cosmix-dusty/30 text-cosmix-wine font-mono text-xs uppercase font-medium">
                  {activeShade.finish}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/70 border border-cosmix-dusty/30 text-cosmix-wine text-xs font-sans">
                  {activeShade.undertone}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/70 border border-cosmix-dusty/30 text-cosmix-wine text-xs font-sans">
                  100% Vegan & Cruelty-Free
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => handleTryOn(activeShade)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-cosmix-wine text-cosmix-cream text-sm font-semibold tracking-wider hover:bg-cosmix-dark transition-all shadow-md hover:shadow-xl group cursor-pointer"
                >
                  <ScanFace className="w-4 h-4 text-cosmix-gold group-hover:scale-110 transition-transform" />
                  <span>Try On Your Face Live</span>
                  <ArrowRight className="w-4 h-4 text-cosmix-gold group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/shades"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-full border border-cosmix-wine/30 text-cosmix-wine text-sm font-medium tracking-wide hover:bg-white/60 transition-colors"
                >
                  <span>View All 35 Shades</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
