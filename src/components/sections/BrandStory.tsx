'use client';

import React from 'react';
import Link from 'next/link';
import { SwatchBook, ScanFace, Heart, ArrowRight } from 'lucide-react';
import { FloatingBrandCard } from '@/components/ui/FloatingBrandCard';

export const BrandStory: React.FC = () => {
  return (
    <section id="story" className="pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 bg-[#FFF8F5] text-cosmix-dark relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
        {/* Main Hero: Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          {/* Left Column — 3D Floating Interactive Card (~40% Content Width) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <FloatingBrandCard
              imageSrc="/assets/cosmix/sequence/frame-428.jpg"
              alt="COSMIX Luxury Lipstick Still Life"
            />
          </div>

          {/* Right Column — Brand Message (Exact 1:1 Match to Reference Design) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Small Eyebrow with Sparkle & Hairline Divider */}
            <div className="flex items-center space-x-2.5">
              <span className="text-[#8B2D3E] text-sm">✦</span>
              <span className="text-[11px] font-mono tracking-[0.26em] uppercase text-[#32171F]/85 font-semibold">
                PERSONAL BEAUTY VISION
              </span>
              <div className="h-px bg-[#32171F]/20 flex-1 max-w-[140px]" />
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal tracking-tight text-[#32171F] leading-[1.08]">
              Beauty is personal.
              <br />
              <span className="italic font-normal text-[#963E4B]">
                Your colour should be too.
              </span>
            </h2>

            {/* Concise Supporting Copy */}
            <p className="font-sans text-sm sm:text-base text-[#4D292C]/85 leading-relaxed font-normal max-w-xl">
              Stop guessing how a lipstick shade will look on you.
              <br className="hidden sm:inline" />
              {' '}Try it virtually, see the real look on your face, and find the shades that truly complement your skin tone.
            </p>

            {/* Three Feature Highlights: Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-1 pb-1">
              {/* Highlight 1: Discover */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center shrink-0 shadow-2xs">
                  <SwatchBook className="w-5 h-5 text-[#8B2D3E] stroke-[1.5]" />
                </div>
                <div>
                  <span className="font-serif text-base text-[#32171F] font-medium block leading-tight">
                    Discover
                  </span>
                  <span className="text-xs text-[#4D292C]/70 font-sans mt-0.5 block whitespace-nowrap">
                    Curated Shades
                  </span>
                </div>
              </div>

              {/* Highlight 2: Try On */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center shrink-0 shadow-2xs">
                  <ScanFace className="w-5 h-5 text-[#8B2D3E] stroke-[1.5]" />
                </div>
                <div>
                  <span className="font-serif text-base text-[#32171F] font-medium block leading-tight">
                    Try On
                  </span>
                  <span className="text-xs text-[#4D292C]/70 font-sans mt-0.5 block whitespace-nowrap">
                    Real-Time AI Mirror
                  </span>
                </div>
              </div>

              {/* Highlight 3: Compare */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center shrink-0 shadow-2xs">
                  <Heart className="w-5 h-5 text-[#8B2D3E] stroke-[1.75]" />
                </div>
                <div>
                  <span className="font-serif text-base text-[#32171F] font-medium block leading-tight">
                    Compare
                  </span>
                  <span className="text-xs text-[#4D292C]/70 font-sans mt-0.5 block whitespace-nowrap">
                    Save Your Favourites
                  </span>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-2">
              <Link
                href="/try-on"
                className="inline-flex items-center space-x-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#822436] hover:bg-[#681928] text-white text-sm sm:text-base font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] group cursor-pointer"
              >
                <span>Start Try-On</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
