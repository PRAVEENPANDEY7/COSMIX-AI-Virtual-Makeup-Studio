'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFavouritesStore, SavedShade } from '@/stores/favourites-store';
import { useStudioStore } from '@/stores/studio-store';
import { ScanFace, Heart, ArrowRight, Sparkle } from 'lucide-react';

export default function FavouritesPage() {
  const { favourites, removeFavourite, hydrate, isHydrated } = useFavouritesStore();
  const { setSelectedShade } = useStudioStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleTryOn = (shade: SavedShade) => {
    setSelectedShade({
      id: shade.id,
      name: shade.name,
      hex: shade.hex,
      category: (shade.family || 'Red') as any,
      defaultFinish: shade.finish.toLowerCase() as 'matte' | 'satin' | 'gloss',
      description: shade.description,
      rgb: [
        parseInt(shade.hex.slice(1, 3), 16),
        parseInt(shade.hex.slice(3, 5), 16),
        parseInt(shade.hex.slice(5, 7), 16),
      ],
    });
    router.push('/try-on');
  };

  return (
    <div className="min-h-screen bg-[#FDF4F1] text-[#32171F] flex flex-col font-sans selection:bg-[#F4DDD5] selection:text-[#32171F]">
      {/* Existing Header (STRICT SCOPE: Untouched) */}
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
        {/* 1. Header (Matching Shades Page Luxury Style) */}
        <section className="mb-10 sm:mb-12">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="flex items-center space-x-3">
              <Sparkle className="w-3.5 h-3.5 text-[#8B2D3E] stroke-[1.5]" />
              <span className="text-[11px] font-mono tracking-[0.24em] text-[#32171F] uppercase font-semibold">
                PERSONAL PALETTE
              </span>
              <div className="h-px bg-[#32171F]/15 w-20 sm:w-28" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-light text-[#32171F] tracking-tight leading-[1.08]">
              My Saved <span className="italic font-normal text-[#8B2D3E]">Favourites.</span>
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#32171F]/75 leading-relaxed max-w-xl font-light">
              Your personal collection of shades that match your style. Revisit and test them on your face whenever inspiration strikes.
            </p>
          </div>
        </section>

        {/* 2. Favourites Content */}
        {!isHydrated ? null : favourites.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#F4DDD5] my-8 space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#FCEEEA] flex items-center justify-center text-[#8B2D3E] mx-auto mb-2">
              <Heart className="w-7 h-7 stroke-[1.5]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#32171F] font-normal">
              Your favourite shades will live here.
            </h2>

            <p className="text-xs sm:text-sm text-[#32171F]/70 max-w-md mx-auto leading-relaxed font-light">
              Start exploring and save the colours you love. Whenever you tap the heart on a shade, it will be saved here in your personal studio palette.
            </p>

            <div className="pt-2">
              <Link
                href="/shades"
                className="px-8 py-3 rounded-full bg-[#521D26] hover:bg-[#3D141C] text-white text-xs font-semibold tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center space-x-2"
              >
                <span>EXPLORE ALL SHADES</span>
                <ArrowRight className="w-3.5 h-3.5 text-cosmix-gold" />
              </Link>
            </div>
          </div>
        ) : (
          /* Grid of Saved Shades — EXACT 1:1 MATCH TO EXPLORE SHADES PAGE CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mb-12">
            {favourites.map((shade) => (
              <div
                key={shade.id}
                className="group bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#F4DDD5]/70 hover:shadow-xl hover:border-[#C9827B]/50 transition-all duration-300 flex flex-col justify-between relative"
              >
                <div>
                  {/* Top Row: Swatch & Upper-Right Favourite Heart Button */}
                  <div className="relative mb-3 flex items-start justify-between min-h-[105px]">
                    {/* Realistic Lipstick Swatch Smear Image */}
                    <div className="w-full pr-8 flex items-center justify-center py-1">
                      <img
                        src={`/assets/cosmix/swatches/${shade.id}.png`}
                        alt={`${shade.name} Lipstick Swatch`}
                        className="w-full max-w-[200px] h-20 sm:h-22 object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                        onError={(e) => {
                          // Fallback if image fails
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Favourite Heart Icon in Upper-Right Corner (Filled) */}
                    <button
                      onClick={() => removeFavourite(shade.id)}
                      className="absolute top-0 right-0 z-20 w-8 h-8 rounded-full border border-[#C9827B] bg-white flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer text-[#8B2D3E]"
                      title="Remove from favourites"
                      aria-label="Remove from favourites"
                    >
                      <Heart className="w-4 h-4 fill-[#8B2D3E] text-[#8B2D3E]" />
                    </button>
                  </div>

                  {/* Middle Info Row */}
                  <div className="space-y-1.5 pt-2">
                    {/* Family • Undertone (Left) and Finish Badge (Right) */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-[#C9827B] uppercase font-semibold">
                        {shade.family} {shade.undertone ? `• ${shade.undertone}` : ''}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FCEEEA] text-[#4D292C] font-bold tracking-wider">
                        {shade.finish}
                      </span>
                    </div>

                    {/* Shade Name */}
                    <h3 className="font-serif text-2xl font-normal text-[#32171F] group-hover:text-[#8B2D3E] transition-colors pt-1">
                      {shade.name}
                    </h3>

                    {/* Short Description */}
                    <p className="font-sans text-xs text-[#32171F]/70 leading-relaxed min-h-[36px] line-clamp-2">
                      {shade.description}
                    </p>
                  </div>
                </div>

                {/* Bottom: Full-Width "Try This Shade →" Button */}
                <div className="pt-5">
                  <button
                    onClick={() => handleTryOn(shade)}
                    className="w-full py-3 px-4 rounded-full bg-[#521D26] hover:bg-[#3D141C] text-white text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xs hover:shadow-md cursor-pointer group/btn"
                  >
                    <ScanFace className="w-3.5 h-3.5 text-cosmix-gold group-hover/btn:scale-110 transition-transform" />
                    <span>Try This Shade</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer (STRICT SCOPE: Untouched) */}
      <Footer />
    </div>
  );
}
