'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, ScanFace, SwatchBook, Heart, Info, Menu, X } from 'lucide-react';
import { useFavouritesStore } from '@/stores/favourites-store';

interface HeaderProps {
  onOpenStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStudio }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledToLight, setIsScrolledToLight] = useState(false);
  const pathname = usePathname();
  const { favourites, hydrate, isHydrated } = useFavouritesStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const favouritesCount = isHydrated ? favourites.length : 0;

  // Check if we are on the Home page (where top hero is dark rose video)
  // or on an inner page (/shades, /about, /try-on, /favourites) where background is light cream
  const isHomePage = pathname === '/';

  // Dynamic scroll listener: on home page, detect when user scrolls past dark hero into light sections
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolledToLight(true);
      return;
    }

    const checkScrollContrast = () => {
      // Find the first light content section (#story or #shades)
      const lightSection = document.getElementById('story') || document.getElementById('shades');
      if (lightSection) {
        const rect = lightSection.getBoundingClientRect();
        // When top of light section reaches near or past the header (<= 100px)
        setIsScrolledToLight(rect.top <= 100);
      } else {
        // Fallback for general scroll position past the pinned canvas
        setIsScrolledToLight(window.scrollY > 200);
      }
    };

    window.addEventListener('scroll', checkScrollContrast, { passive: true });
    checkScrollContrast();
    return () => window.removeEventListener('scroll', checkScrollContrast);
  }, [isHomePage]);

  // Determine light vs dark theme based on page and scroll position
  const isLightMode = !isHomePage || isScrolledToLight;

  // Adaptive luxury typography colors for perfect readability on all backgrounds
  const brandTextColor = isLightMode ? 'text-cosmix-wine' : 'text-white drop-shadow-md';
  const trademarkColor = isLightMode ? 'text-cosmix-wine/75' : 'text-white/90';
  const navLinkColor = isLightMode
    ? 'text-cosmix-wine hover:text-cosmix-deep font-medium'
    : 'text-white hover:text-white/80 drop-shadow-sm';
  const heartColor = isLightMode
    ? favouritesCount > 0
      ? 'fill-rosewood-700 text-rosewood-700 stroke-[1.8]'
      : 'text-cosmix-wine stroke-[1.6]'
    : favouritesCount > 0
    ? 'fill-cosmix-dusty text-cosmix-dusty stroke-[1.8]'
    : 'text-white stroke-[1.6] drop-shadow-sm';
  const favouritesTextColor = isLightMode
    ? 'text-cosmix-wine font-medium'
    : 'text-white drop-shadow-sm';
  const badgeBg = isLightMode ? 'bg-cosmix-wine text-white' : 'bg-cosmix-dusty text-white';
  const hamburgerColor = isLightMode ? 'text-cosmix-wine' : 'text-white';

  // Header container: on dark hero transparent, when scrolled into light sections gives a luxury blur background
  const headerContainerClass = isLightMode
    ? 'bg-[#FFF8F5]/98 backdrop-blur-lg border-b border-[#F4DDD5]/80 shadow-xs py-3 sm:py-4 transition-all duration-300'
    : 'bg-transparent py-4 sm:py-6 transition-all duration-300';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 pointer-events-none select-none ${headerContainerClass}`}>
      <div className="w-full px-4 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between pointer-events-auto">
        {/* Left: Brand Wordmark */}
        <Link href="/" className="flex items-baseline group cursor-pointer">
          <span className={`font-serif text-2xl sm:text-4xl font-normal tracking-[0.06em] transition-colors ${brandTextColor}`}>
            COSMIX
          </span>
          <span className={`text-[10px] sm:text-xs font-sans font-normal ml-0.5 -translate-y-2 sm:-translate-y-2.5 inline-block transition-colors ${trademarkColor}`}>
            ®
          </span>
        </Link>

        {/* Right: Desktop Navigation */}
        <div className="flex items-center space-x-7 sm:space-x-9">
          <nav className="hidden lg:flex items-center space-x-8 text-sm sm:text-[15px] font-sans font-normal">
            <Link href="/" className={`transition-colors ${navLinkColor}`}>
              Home
            </Link>

            <Link href="/try-on" className={`transition-colors ${navLinkColor}`}>
              Try On
            </Link>

            <Link href="/shades" className={`transition-colors ${navLinkColor}`}>
              Explore Shades
            </Link>

            <Link href="/about" className={`transition-colors ${navLinkColor}`}>
              About COSMIX
            </Link>
          </nav>

          {/* My Favourites Heart Link */}
          <Link
            href="/favourites"
            className="flex items-center space-x-2 p-1 relative cursor-pointer group"
            title="My Favourites"
          >
            <div className="relative">
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${heartColor}`}
              />
              {favouritesCount > 0 && (
                <span className={`absolute -top-1.5 -right-2 font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs ${badgeBg}`}>
                  {favouritesCount}
                </span>
              )}
            </div>
            <span className={`hidden sm:inline text-sm font-sans transition-colors ${favouritesTextColor}`}>
              My Favourites
            </span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1 transition-colors focus:outline-none cursor-pointer ${hamburgerColor}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden pointer-events-auto backdrop-blur-xl border-b px-8 py-6 space-y-4 shadow-xl ${
            isLightMode
              ? 'bg-[#FFF6F0]/98 border-cosmix-dusty/30 text-cosmix-wine'
              : 'bg-cosmix-dark/95 border-white/10 text-white'
          }`}
        >
          <nav className="flex flex-col space-y-4 text-sm font-sans font-normal">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 py-1 hover:text-cosmix-gold transition-colors"
            >
              <House className="w-4 h-4 text-cosmix-gold" />
              <span>Home</span>
            </Link>

            <Link
              href="/try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 text-left py-1 hover:text-cosmix-gold transition-colors"
            >
              <ScanFace className="w-4 h-4 text-cosmix-gold" />
              <span>Try On</span>
            </Link>

            <Link
              href="/shades"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 py-1 hover:text-cosmix-gold transition-colors"
            >
              <SwatchBook className="w-4 h-4 text-cosmix-gold" />
              <span>Explore Shades</span>
            </Link>

            <Link
              href="/favourites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 py-1 hover:text-cosmix-gold transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  favouritesCount > 0 ? 'text-cosmix-dusty fill-cosmix-dusty' : 'text-cosmix-gold'
                }`}
              />
              <span>My Favourites ({favouritesCount})</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 py-1 hover:text-cosmix-gold transition-colors"
            >
              <Info className="w-4 h-4 text-cosmix-gold" />
              <span>About COSMIX</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
