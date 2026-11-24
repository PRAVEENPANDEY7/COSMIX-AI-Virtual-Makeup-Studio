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
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, container);

    return () => {
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
        className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center space-y-2 pointer-events-none text-white drop-shadow-md"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cosmix-gold drop-shadow-sm font-semibold">
          Scroll to Discover
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-cosmix-gold" />
      </div>
    </section>
  );
};
