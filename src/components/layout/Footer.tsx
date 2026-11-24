'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Heart, Sparkle } from 'lucide-react';
import { BRAND } from '@/data/brand';

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36m1.39 9.74v-8.37H5.07v8.37z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C0B11] text-[#FFF6F0] border-t border-[#C6A16B]/15 pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#FFF6F0]/10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-baseline group">
              <span className="font-serif text-3xl sm:text-4xl font-normal tracking-[0.08em] text-white group-hover:text-cosmix-gold transition-colors">
                COSMIX
              </span>
              <span className="text-[10px] font-sans text-cosmix-gold ml-1 -translate-y-2.5">
                ®
              </span>
            </Link>

            <p className="font-serif text-lg italic text-cosmix-gold/90 font-light leading-snug">
              &ldquo;Beauty is personal. Your colour should be too.&rdquo;
            </p>

            <p className="font-sans text-xs text-[#FFF6F0]/70 leading-relaxed max-w-sm font-light">
              An editorial digital beauty experience. Discover, test, and find your signature lip shades with realistic texture and bespoke pigment harmony.
            </p>

            <div className="pt-2">
              <a
                href="https://www.linkedin.com/in/praveen-pandey-6b781b32b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider text-cosmix-gold hover:text-white transition-colors uppercase py-1 group cursor-pointer"
                title="Connect with Praveen Pandey on LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4 text-cosmix-gold group-hover:text-white transition-colors" />
                <span>Follow Praveen Pandey</span>
              </a>
            </div>
          </div>

          {/* Quick Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] font-mono tracking-[0.24em] text-cosmix-gold uppercase font-semibold">
              The Atelier
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FFF6F0]/75">
              <li>
                <Link href="/" className="hover:text-cosmix-gold transition-colors inline-block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-cosmix-gold transition-colors inline-block py-0.5">
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link href="/shades" className="hover:text-cosmix-gold transition-colors inline-block py-0.5">
                  Explore All 35 Shades
                </Link>
              </li>
              <li>
                <Link href="/favourites" className="hover:text-cosmix-gold transition-colors inline-flex items-center space-x-1.5 py-0.5">
                  <Heart className="w-3.5 h-3.5 text-cosmix-dusty fill-cosmix-dusty" />
                  <span>Saved Favourites</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cosmix-gold transition-colors inline-block py-0.5">
                  About COSMIX
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy / Platform Promise (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-[0.24em] text-cosmix-gold uppercase font-semibold">
              <Sparkle className="w-3.5 h-3.5 text-cosmix-gold" />
              <span>Personal Beauty</span>
            </div>
            <p className="text-xs text-[#FFF6F0]/70 leading-relaxed font-sans font-light">
              Beauty has no single definition. The perfect shade is the one that makes you feel confident and authentic.
            </p>
            <div className="pt-1 flex flex-col space-y-1.5 text-[11px] font-mono text-cosmix-gold/90">
              <span>✦ 100% Vegan & Cruelty-Free</span>
              <span>✦ Real-Time Mirror Simulation</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#FFF6F0]/50 tracking-wider">
          <p>© {new Date().getFullYear()} COSMIX Virtual Beauty Platform. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 hover:text-cosmix-gold transition-colors mt-4 sm:mt-0 cursor-pointer uppercase tracking-widest text-[10px]"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cosmix-gold" />
          </button>
        </div>
      </div>
    </footer>
  );
};
