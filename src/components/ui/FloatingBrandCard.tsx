'use client';

import React, { useState, useRef, useCallback } from 'react';

interface FloatingBrandCardProps {
  imageSrc: string;
  alt?: string;
}

export const FloatingBrandCard: React.FC<FloatingBrandCardProps> = ({
  imageSrc,
  alt = 'COSMIX Luxury Lipstick',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 3D rotation angles (-14 to +14 degrees)
    const rotateX = (0.5 - y) * 20;
    const rotateY = (x - 0.5) * 20;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
    );
    setGlarePosition({
      x: x * 100,
      y: y * 100,
      opacity: 0.35,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div className="relative w-full max-w-[420px] mx-auto group">
      {/* Ambient Pulsing Atmospheric Glow Behind Card */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#7E2638]/20 via-[#C9827B]/25 to-[#FDE6D2]/30 rounded-[44px] blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Floating Card Outer Container with Continuous Float Animation when not hovered */}
      <div
        className={`relative transition-transform duration-500 ease-out ${
          !isHovered ? 'animate-luxury-float' : ''
        }`}
      >
        {/* Interactive 3D Perspective Card Frame matching Reference Image */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: transformStyle,
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          className="relative aspect-[4/5] rounded-[32px] sm:rounded-[36px] overflow-hidden bg-white/70 p-2 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(77,41,44,0.22)] border border-[#C6A16B]/30 cursor-pointer will-change-transform"
        >
          {/* Inner Image Container with High-End Editorial Photography */}
          <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-inner">
            <div
              className="w-full h-full bg-cover bg-center filter brightness-98 contrast-105 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${imageSrc})` }}
              role="img"
              aria-label={alt}
            />

            {/* Real-time Dynamic Specular Glare/Reflection Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: glarePosition.opacity,
                background: `radial-gradient(circle 380px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 45%, transparent 80%)`,
              }}
            />

            {/* Glass Sheen Edge Highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[26px] sm:rounded-[30px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
          </div>
        </div>

        {/* Realistic Grounding Drop Shadow that expands/contracts as card floats */}
        <div
          className={`w-3/4 h-5 mx-auto rounded-full bg-[#4D292C]/20 blur-xl mt-4 transition-all duration-700 ${
            isHovered ? 'scale-110 opacity-70 blur-2xl' : 'scale-100 opacity-50'
          }`}
        />
      </div>
    </div>
  );
};
