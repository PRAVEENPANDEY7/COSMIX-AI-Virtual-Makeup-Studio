'use client';

import React from 'react';
import Link from 'next/link';
import { ScanFace, SwatchBook, Sparkle, ArrowRight } from 'lucide-react';

interface VirtualTryOnCTAProps {
  onLaunchStudio?: () => void;
}

export const VirtualTryOnCTA: React.FC<VirtualTryOnCTAProps> = ({ onLaunchStudio }) => {
  return (
    <section id="tryon" className="pt-2 sm:pt-4 md:pt-6 pb-16 sm:pb-24 lg:pb-28 bg-[#FFF8F5] text-cosmix-dark relative overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center">
        {/* Centered Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full border border-[#963E4B]/30 bg-white/70 text-[#32171F] text-xs font-mono tracking-[0.24em] uppercase font-medium mb-6 shadow-2xs">
          <span className="text-[#963E4B] text-xs">✦</span>
          <span>VIRTUAL TRY-ON ATELIER</span>
        </div>

        {/* Main Heading */}
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-[76px] font-normal tracking-tight text-[#32171F] leading-[1.05] max-w-4xl mx-auto">
          Your shade.
          <br />
          <span className="italic font-normal text-[#963E4B]">
            Your rules.
          </span>
        </h2>

        {/* Short Supporting Description */}
        <p className="mt-5 font-sans text-sm sm:text-base text-[#4D292C]/80 max-w-xl mx-auto leading-relaxed font-normal">
          Discover how every COSMIX shade looks on you with our Virtual Try-On experience.
        </p>

        {/* Three Editorial Feature Pillars (No boxes, clean and open) */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-14 max-w-[1140px] mx-auto text-left">
          {/* Feature 1 — Real-Time Try-On */}
          <div className="space-y-3 group">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center text-[#8B2D3E] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
              <ScanFace className="w-6 h-6 text-[#8B2D3E] stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#32171F]">
              Real-Time Try-On
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
              See lipstick shades on your own face live and in real time.
            </p>
          </div>

          {/* Feature 2 — Explore All Shades */}
          <div className="space-y-3 group">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center text-[#8B2D3E] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
              <SwatchBook className="w-6 h-6 text-[#8B2D3E] stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#32171F]">
              Explore All Shades
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
              Discover different colours, finishes and adjustable intensity.
            </p>
          </div>

          {/* Feature 3 — Find Your Perfect Match */}
          <div className="space-y-3 group">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FCEEEA] border border-[#F4DDD5] flex items-center justify-center text-[#8B2D3E] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkle className="w-6 h-6 text-[#8B2D3E] stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#32171F]">
              Find Your Perfect Match
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
              Compare shades and save your favourite looks.
            </p>
          </div>
        </div>

        {/* Two Centered Prominent CTA Buttons */}
        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 relative z-10">
          <Link
            href="/try-on"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#701E2D] hover:bg-[#581522] text-white text-sm sm:text-base font-medium tracking-wide shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
          >
            <ScanFace className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Try It On Yourself</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/shades"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full border border-[#701E2D]/60 hover:border-[#701E2D] bg-transparent hover:bg-[#FCEEEA]/50 text-[#701E2D] text-sm sm:text-base font-medium tracking-wide transition-all duration-300"
          >
            <span>Explore All Shades</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
