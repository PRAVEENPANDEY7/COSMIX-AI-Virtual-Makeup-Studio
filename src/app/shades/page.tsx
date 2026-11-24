'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { COSMIX_SHADES, SHADE_FAMILIES, CosmixShade, ShadeFamily } from '@/data/shades';
import {
  ScanFace,
  Heart,
  Sparkle,
  Filter,
  LayoutGrid,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { useFavouritesStore } from '@/stores/favourites-store';

const ITEMS_PER_PAGE = 12;

export default function ExploreShadesPage() {
  const router = useRouter();
  const [selectedFamily, setSelectedFamily] = useState<ShadeFamily | 'ALL'>('ALL');
  const [selectedFinish, setSelectedFinish] = useState<'ALL' | 'Matte' | 'Satin' | 'Gloss'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const { setSelectedShade } = useStudioStore();
  const { isFavourite, toggleFavourite, hydrate } = useFavouritesStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Reset to page 1 whenever filters change
  const handleFamilyChange = (fam: ShadeFamily | 'ALL') => {
    setSelectedFamily(fam);
    setCurrentPage(1);
  };

  const handleFinishChange = (finish: 'ALL' | 'Matte' | 'Satin' | 'Gloss') => {
    setSelectedFinish(finish);
    setCurrentPage(1);
  };

  // Filtered shades
  const filteredShades = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COSMIX_SHADES.filter((shade) => {
      const matchesFamily = selectedFamily === 'ALL' || shade.family === selectedFamily;
      const matchesFinish = selectedFinish === 'ALL' || shade.finish === selectedFinish;
      const matchesSearch =
        !q ||
        shade.name.toLowerCase().includes(q) ||
        shade.family.toLowerCase().includes(q) ||
        shade.finish.toLowerCase().includes(q) ||
        shade.undertone.toLowerCase().includes(q) ||
        shade.description.toLowerCase().includes(q);
      return matchesFamily && matchesFinish && matchesSearch;
    });
  }, [selectedFamily, selectedFinish, searchQuery]);

  // Pagination calculations
  const totalItems = filteredShades.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentShades = filteredShades.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    router.push('/try-on');
  };

  return (
    <div className="min-h-screen bg-[#FDF4F1] text-[#32171F] flex flex-col font-sans selection:bg-[#F4DDD5] selection:text-[#32171F]">
      {/* Existing Header (STRICT SCOPE: Untouched) */}
      <Header />

      <main className="flex-1 pt-20 sm:pt-32 pb-16 sm:pb-20 max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-12 w-full">
        {/* 1. Hero Section (Exact Match to Reference) */}
        <section className="mb-6 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Heading & Editorial Eyebrow */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
              {/* Eyebrow with horizontal hairline */}
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Sparkle className="w-3.5 h-3.5 text-[#8B2D3E] stroke-[1.5]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] text-[#32171F] uppercase font-semibold">
                  VIRTUAL COLOR LIBRARY
                </span>
                <div className="h-px bg-[#32171F]/15 w-16 sm:w-28" />
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[62px] font-light text-[#32171F] tracking-tight leading-[1.1]">
                Explore <span className="italic font-normal text-[#8B2D3E]">35</span> Bespoke Shades.
              </h1>

              {/* Supporting Subtext */}
              <p className="font-sans text-xs sm:text-sm text-[#32171F]/75 leading-relaxed max-w-xl font-light">
                Curated nudes, roses, crimsons, mochas, and berries &mdash; try any shade on your own face with our AI Virtual Try-On Studio.
              </p>
            </div>

            {/* Right Column: Seamless Floating Hero Lipstick Visual */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center pointer-events-none select-none">
              <img
                src="/assets/cosmix/hero-lipstick-clean.png"
                alt="COSMIX Bespoke Lipstick and Swatches"
                className="w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[460px] h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Scroll Anchor for pagination */}
        <div ref={gridTopRef} className="-translate-y-24" />

        {/* 2. Horizontal Filter Pill Bar (Single continuous pill container) */}
        <section className="bg-white rounded-2xl md:rounded-full p-2.5 sm:p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#F4DDD5]/70 mb-8 sm:mb-10 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Category Filters */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {/* All Shades Button */}
            <button
              onClick={() => handleFamilyChange('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                selectedFamily === 'ALL'
                  ? 'bg-[#4D1C24] text-white font-medium shadow-xs'
                  : 'bg-[#FCEEEA]/70 hover:bg-[#FCEEEA] text-[#4D1C24]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 opacity-90" />
              <span>All Shades ({COSMIX_SHADES.length})</span>
            </button>

            {/* Family Buttons */}
            {SHADE_FAMILIES.map((fam) => {
              const isActive = selectedFamily === fam.id;
              return (
                <button
                  key={fam.id}
                  onClick={() => handleFamilyChange(fam.id)}
                  className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#4D1C24] text-white font-medium shadow-xs'
                      : 'bg-[#FCEEEA]/70 hover:bg-[#FCEEEA] text-[#4D1C24]'
                  }`}
                >
                  {fam.label}
                </button>
              );
            })}
          </div>

          {/* Center: Search Box */}
          <div className="relative w-full md:w-56 lg:w-64 my-1 md:my-0 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-[#8B2D3E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search shades, undertones..."
              className="w-full pl-9 pr-8 py-1.5 text-xs font-sans rounded-full bg-[#FFF6F0] border border-[#F4DDD5] text-[#32171F] placeholder-[#32171F]/45 focus:outline-none focus:border-[#8B2D3E] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#32171F]/40 hover:text-[#32171F] p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Finish Filters */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-sans text-[#32171F] shrink-0 self-center md:self-auto pl-2 border-t md:border-t-0 md:border-l border-[#32171F]/10 pt-2 md:pt-0">
            <Filter className="w-3.5 h-3.5 text-[#8B2D3E]" />
            <span className="font-sans text-xs text-[#32171F] font-medium mr-1">
              Finish:
            </span>
            {(['ALL', 'Matte', 'Satin', 'Gloss'] as const).map((f) => {
              const isActive = selectedFinish === f;
              const label = f === 'ALL' ? 'All' : f;
              return (
                <button
                  key={f}
                  onClick={() => handleFinishChange(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4D1C24] text-white font-medium shadow-xs'
                      : 'text-[#32171F]/75 hover:text-[#32171F] hover:bg-[#FCEEEA]/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. 4-Column Responsive Grid with Exact Reference Card Design */}
        {totalItems > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mb-12">
            {currentShades.map((shade) => {
              const isSaved = isFavourite(shade.id);

              return (
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

                      {/* Favourite Heart Icon in Upper-Right Corner */}
                      <button
                        onClick={() => toggleFavourite(shade)}
                        className={`absolute top-0 right-0 z-20 w-8 h-8 rounded-full border border-[#F4DDD5] bg-white flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                          isSaved ? 'text-[#8B2D3E] border-[#C9827B]' : 'text-[#32171F]/50 hover:text-[#8B2D3E]'
                        }`}
                        title={isSaved ? 'Remove from favourites' : 'Save to favourites'}
                        aria-label={isSaved ? 'Remove from favourites' : 'Save to favourites'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isSaved ? 'fill-[#8B2D3E] text-[#8B2D3E]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Middle Info Row */}
                    <div className="space-y-1.5 pt-2">
                      {/* Family • Undertone (Left) and Finish Badge (Right) */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-widest text-[#C9827B] uppercase font-semibold">
                          {shade.family} • {shade.undertone}
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
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F4DDD5] my-8 space-y-4">
            <p className="font-serif text-2xl text-[#32171F]">No shades match your selected filters.</p>
            <p className="text-xs text-[#32171F]/70 max-w-sm mx-auto">
              Try selecting a different family or finish to discover our bespoke lipstick shades.
            </p>
            <button
              onClick={() => {
                setSelectedFamily('ALL');
                setSelectedFinish('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 rounded-full bg-[#521D26] text-white text-xs font-semibold hover:bg-[#3D141C] transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cosmix-gold" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* 4. Pagination Section (Exact Match to Reference Bottom) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-xs font-sans text-[#32171F]/70 gap-4">
            <p className="font-light">
              Showing {startIndex + 1}&ndash;{endIndex} of {totalItems} shades
            </p>

            <div className="flex items-center space-x-1.5">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-[#F4DDD5] bg-white hover:bg-[#FCEEEA] text-[#32171F] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-[#521D26] text-white shadow-xs'
                        : 'text-[#32171F]/80 hover:bg-[#FCEEEA]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-[#F4DDD5] bg-white hover:bg-[#FCEEEA] text-[#32171F] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Existing Footer (STRICT SCOPE: Untouched) */}
      <Footer />
    </div>
  );
}
