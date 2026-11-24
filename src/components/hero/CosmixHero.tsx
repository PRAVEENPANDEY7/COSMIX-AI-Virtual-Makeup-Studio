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

      {/* Scroll Down Cue (Fades as user scrolls) */}
      <div
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 15),
          transform: `translateY(${scrollProgress * 60}px)`,
          transition: 'opacity 0.2s ease',
        }}
        className="absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 shadow-xl">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white font-medium">
            Scroll to Discover
          </span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-white" />
        </div>
      </div>
    </section>
  );
};
