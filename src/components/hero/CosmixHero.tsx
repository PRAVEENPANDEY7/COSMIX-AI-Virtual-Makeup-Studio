'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageSequenceCanvas } from './ImageSequenceCanvas';
import { ScrollStoryText } from './ScrollStoryText';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CosmixHeroProps {
  onLaunchStudio?: () => void;
}

export const CosmixHero: React.FC<CosmixHeroProps> = ({ onLaunchStudio }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=460%', // Genuine, balanced luxury flow (neither too fast nor too slow)
        pin: true,
        scrub: 0.65, // Smooth, cinematic momentum
        anticipatePin: 1,
        invalidateOnRefresh: true, // Recalculates dynamically on viewport resize
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, container);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-cosmix-cream text-cosmix-dark overflow-hidden select-none"
    >
      {/* Background 1080p Image Sequence Canvas */}
      <ImageSequenceCanvas progress={scrollProgress} />

      {/* Synchronized 6-Beat Platform Storytelling (Positioned to never overlap product or model) */}
      <ScrollStoryText progress={scrollProgress} onLaunchStudio={onLaunchStudio} />

      {/* Luxury Gold Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/20 z-20">
        <div
          className="h-full bg-gradient-to-r from-cosmix-gold via-cosmix-dusty to-cosmix-deep transition-all duration-75 origin-left"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Scroll Down Cue (Fades as user scrolls) - 100% Transparent */}
      <div
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 15),
          transform: `translateY(${scrollProgress * 60}px)`,
          transition: 'opacity 0.2s ease',
        }}
        className="absolute bottom-2 sm:bottom-4 inset-x-0 z-20 flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white font-semibold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
          Scroll to Discover
        </span>
        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]" />
      </div>
    </section>
  );
};
