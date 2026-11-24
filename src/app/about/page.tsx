'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Globe,
} from 'lucide-react';

// Custom SVG Icons
const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36m1.39 9.74v-8.37H5.07v8.37z" />
  </svg>
);

export default function AboutCosmixPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F5] text-cosmix-dark flex flex-col justify-between selection:bg-[#F4DDD5] selection:text-[#32171F]">
      {/* 1. Header (Untouched) */}
      <Header />

      {/* Main Content: Full-width container aligning 1:1 with Header and Footer */}
      <main className="flex-1 pt-20 sm:pt-36 pb-16 sm:pb-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 space-y-16 sm:space-y-28">
          {/* ========================================================= */}
          {/* 1. HERO & REAL-LIFE PROBLEM (Full 12-Column Layout)       */}
          {/* ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-center">
            {/* Left 7 Columns: Story & Problem Breakdown */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-7">
              <div className="inline-flex items-center space-x-2.5">
                <span className="text-[#8B2D3E] text-xs">✦</span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#8B2D3E] font-semibold">
                  THE STORY BEHIND COSMIX
                </span>
                <span className="w-8 sm:w-12 h-px bg-[#8B2D3E]/30" />
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal tracking-tight text-[#32171F] leading-[1.1]">
                Born from a Real-Life Frustration.
                <br />
                <span className="italic font-normal text-[#963E4B]">
                  Solved with Practical Engineering.
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#4D292C]/85 leading-relaxed font-normal">
                Buying lipstick has always been filled with friction. In-store testers are unhygienic, department store lights are deceptive, and swatching on your hand never matches the natural pigment of your lips.
              </p>

              {/* Editorial 2-Column: Problem & Solution (No boxes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-[#4D292C]/10">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-[#8B2D3E] uppercase tracking-wider block">
                    The Problem We Saw
                  </span>
                  <p className="text-sm text-[#4D292C]/80 leading-relaxed font-light">
                    People constantly waste money on shades that look completely different at home than they did in store or on online models, leading to buyer&apos;s remorse and cosmetic waste.
                  </p>
                </div>

                <div className="space-y-2 sm:border-l sm:border-[#4D292C]/10 sm:pl-8">
                  <span className="text-xs font-mono font-semibold text-[#1B6D4A] uppercase tracking-wider block">
                    The COSMIX Answer
                  </span>
                  <p className="text-sm text-[#4D292C]/80 leading-relaxed font-light">
                    An instantaneous, private web mirror that uses computer vision to track your lips in real time, letting you test 35 bespoke shades with physical texture simulation on your own face.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Seamless Luxury Lipstick Visual (Fills the Right Space) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center pointer-events-none select-none">
              <img
                src="/assets/cosmix/hero-lipstick-clean.png"
                alt="COSMIX Bespoke Lipstick and Swatches"
                className="w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(77,41,44,0.18)]"
              />
            </div>
          </section>

          {/* ========================================================= */}
          {/* 2. HOW IT HELPS (Editorial 3-Column Across Full 1440px)    */}
          {/* ========================================================= */}
          <section className="space-y-8 pt-6 border-t border-[#4D292C]/10">
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[#8B2D3E] uppercase font-semibold">
                HOW IT HELPS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#32171F]">
                Built for Effortless Confidence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
              <div className="space-y-2.5">
                <span className="font-serif text-2xl lg:text-3xl text-[#8B2D3E] font-normal block">01</span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#32171F]">
                  Real-Time AI Mirror
                </h3>
                <p className="text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
                  Tracks 468 facial points at 30+ FPS right in your browser. Talk, smile, and move naturally while seeing authentic shade coverage live on your own lips.
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="font-serif text-2xl lg:text-3xl text-[#8B2D3E] font-normal block">02</span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#32171F]">
                  Realistic Texture Physics
                </h3>
                <p className="text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
                  Not a flat color sticker. Accurately renders velvety Matte light absorption, natural luminous Satin, and high-shine Gloss micro-reflections.
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="font-serif text-2xl lg:text-3xl text-[#8B2D3E] font-normal block">03</span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#32171F]">
                  100% On-Device Privacy
                </h3>
                <p className="text-xs sm:text-sm text-[#4D292C]/75 leading-relaxed font-light">
                  Zero webcam feeds or photos are ever uploaded to any server. All vision processing runs entirely on your local machine with complete privacy.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 3. DEVELOPER SECTION — PRAVEEN PANDEY (Full Width)        */}
          {/* ========================================================= */}
          <section className="space-y-8 pt-6 border-t border-[#4D292C]/10">
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[#8B2D3E] uppercase font-semibold">
                THE DEVELOPER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#32171F]">
                About the Creator
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Left Identity Column (4 cols) */}
              <div className="md:col-span-4 space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#32171F]">
                  Praveen Pandey
                </h3>
                <span className="text-xs font-mono font-semibold text-[#8B2D3E] uppercase tracking-wider block">
                  Software Engineer
                </span>
                <p className="text-xs sm:text-sm text-[#4D292C]/70 font-light leading-relaxed">
                  Passionate about solving real-life everyday problems through modern web technology.
                </p>
              </div>

              {/* Right Story & Links Column (8 cols) */}
              <div className="md:col-span-8 space-y-6 md:border-l md:border-[#4D292C]/10 md:pl-8 lg:pl-12">
                <div className="space-y-4 text-sm sm:text-base text-[#4D292C]/85 leading-relaxed font-light">
                  <p>
                    &ldquo;As a Software Engineer, I noticed a frustrating real-life problem: friends and family repeatedly struggled to find lipstick shades that actually worked for them. In-store testers were messy and unhygienic, lighting was misleading, and swatches on wrists never matched the natural pigment of real lips.&rdquo;
                  </p>
                  <p>
                    &ldquo;It was a clear everyday problem waiting for a modern engineering solution. I built COSMIX to give people an instant, private, real-time mirror right in their browser—eliminating the guesswork and making shade discovery effortless.&rdquo;
                  </p>
                </div>

                {/* Direct Action Links (No skill badges) */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
                  <a
                    href="https://praveenpandey7.github.io/PraveenPandey-Portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-sans font-medium text-[#8B2D3E] hover:text-[#32171F] border-b border-[#8B2D3E]/40 hover:border-[#32171F] pb-0.5 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href="https://github.com/PRAVEENPANDEY7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-sans font-medium text-[#8B2D3E] hover:text-[#32171F] border-b border-[#8B2D3E]/40 hover:border-[#32171F] pb-0.5 transition-all"
                  >
                    <GitHubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/praveen-pandey-6b781b32b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-sans font-medium text-[#8B2D3E] hover:text-[#32171F] border-b border-[#8B2D3E]/40 hover:border-[#32171F] pb-0.5 transition-all"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 4. CLEAN CALL TO ACTION (Full Width Bar)                  */}
          {/* ========================================================= */}
          <section className="pt-8 border-t border-[#4D292C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#32171F]">
                Ready to find your shade?
              </h3>
              <p className="text-xs sm:text-sm text-[#4D292C]/70 font-light mt-1">
                Test 35 bespoke shades live on your own lips right now.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/try-on"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#822436] hover:bg-[#681928] text-white text-xs sm:text-sm font-medium tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Launch Try-On</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shades"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-[#32171F]/5 text-[#32171F] text-xs sm:text-sm font-medium border border-[#32171F]/20 transition-all cursor-pointer"
              >
                <span>Explore Shades</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer (Untouched) */}
      <Footer />
    </div>
  );
}
