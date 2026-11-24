'use client';

import React, { useMemo } from 'react';

interface LipstickSwatchVisualProps {
  hex: string;
  finish: 'Matte' | 'Satin' | 'Gloss';
  className?: string;
  height?: number;
}

function adjustHex(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * (percent / 100))));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100))));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + Math.round(255 * (percent / 100))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const LipstickSwatchVisual: React.FC<LipstickSwatchVisualProps> = ({
  hex,
  finish,
  className = 'w-full h-44',
}) => {
  const { highlightHex, shadowHex, deepHex, ambientHex } = useMemo(() => {
    return {
      highlightHex: adjustHex(hex, finish === 'Gloss' ? 35 : 24),
      shadowHex: adjustHex(hex, -22),
      deepHex: adjustHex(hex, -38),
      ambientHex: adjustHex(hex, 10),
    };
  }, [hex, finish]);

  // Unique ID prefix for gradients
  const idPrefix = useMemo(() => `swatch-${hex.replace('#', '')}-${finish.toLowerCase()}`, [hex, finish]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{
        background: 'linear-gradient(145deg, #FFF8F4 0%, #F8ECE6 60%, #F2DDD3 100%)',
      }}
    >
      {/* Subtle paper / cosmetic swatch texture background grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#32171F 1px, transparent 1px), radial-gradient(#32171F 1px, #FFF8F4 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Atmospheric Diffuse Glow matching the lipstick pigment */}
      <div
        className="absolute w-36 h-28 rounded-full blur-2xl opacity-40 transition-all duration-500 pointer-events-none"
        style={{ backgroundColor: ambientHex }}
      />

      {/* The Organic Lipstick Smear SVG */}
      <svg
        viewBox="0 0 320 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-2 relative z-10 transition-transform duration-500 group-hover:scale-[1.04]"
      >
        <defs>
          {/* Main Pigment Gradient */}
          <linearGradient
            id={`${idPrefix}-grad`}
            x1="30"
            y1="130"
            x2="290"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={deepHex} />
            <stop offset="20%" stopColor={shadowHex} />
            <stop offset="50%" stopColor={hex} />
            <stop offset="78%" stopColor={highlightHex} />
            <stop offset="100%" stopColor={hex} />
          </linearGradient>

          {/* Secondary Ridge Texture Gradient */}
          <linearGradient
            id={`${idPrefix}-ridge`}
            x1="60"
            y1="110"
            x2="260"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={shadowHex} stopOpacity="0.8" />
            <stop offset="45%" stopColor={highlightHex} stopOpacity="0.9" />
            <stop offset="85%" stopColor={hex} stopOpacity="0.95" />
          </linearGradient>

          {/* Specular Wet Shine for Gloss */}
          <linearGradient
            id={`${idPrefix}-gloss`}
            x1="80"
            y1="100"
            x2="240"
            y2="45"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FFF9F5" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Soft Silk Luster for Satin */}
          <linearGradient
            id={`${idPrefix}-satin`}
            x1="70"
            y1="105"
            x2="250"
            y2="45"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFEFEB" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFEFEB" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FFEFEB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFEFEB" stopOpacity="0" />
          </linearGradient>

          {/* Contact Shadow Filter */}
          <filter id={`${idPrefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor={deepHex} floodOpacity="0.3" />
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
          </filter>

          {/* Subtle Glow Filter for Gloss */}
          <filter id={`${idPrefix}-glint`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Underlying Soft Depth Layer */}
        <path
          d="M 38 122 
             C 45 105, 70 98, 105 88 
             C 145 77, 195 65, 235 48 
             C 265 35, 285 36, 292 45 
             C 298 53, 280 68, 252 82 
             C 215 101, 155 118, 105 132 
             C 65 143, 32 136, 38 122 Z"
          fill={deepHex}
          opacity="0.35"
          filter="url(#shadow)"
        />

        {/* 2. Main Creamy Lipstick Smear Body */}
        <path
          d="M 32 118 
             C 30 102, 48 88, 78 78 
             C 118 64, 172 52, 222 38 
             C 258 28, 284 30, 290 38 
             C 296 46, 278 60, 248 74 
             C 205 94, 142 112, 92 125 
             C 52 135, 34 130, 32 118 Z"
          fill={`url(#${idPrefix}-grad)`}
          filter={`url(#${idPrefix}-shadow)`}
        />

        {/* 3. Textured Inner Cream Ridge (simulating heavy pigment drag) */}
        <path
          d="M 52 108 
             C 72 94, 115 80, 162 68 
             C 208 56, 252 42, 274 38 
             C 278 42, 260 52, 230 64 
             C 185 82, 128 98, 86 112 
             C 65 118, 48 114, 52 108 Z"
          fill={`url(#${idPrefix}-ridge)`}
          opacity="0.75"
        />

        {/* 4. Secondary Organic Feathered Smear Tail Edge */}
        <path
          d="M 230 40 
             C 255 32, 280 34, 288 39 
             C 292 42, 278 50, 255 58 
             C 240 50, 232 44, 230 40 Z"
          fill={highlightHex}
          opacity="0.6"
        />

        {/* 5. Start Pressure Bulb (where the bullet first touches down) */}
        <ellipse
          cx="52"
          cy="114"
          rx="18"
          ry="14"
          transform="rotate(-25 52 114)"
          fill={hex}
          opacity="0.8"
        />
        <ellipse
          cx="48"
          cy="112"
          rx="12"
          ry="9"
          transform="rotate(-25 48 112)"
          fill={highlightHex}
          opacity="0.4"
        />

        {/* 6. Finish-Specific Highlight / Specular Sheen */}
        {finish === 'Gloss' && (
          <g filter={`url(#${idPrefix}-glint)`}>
            {/* Glossy wet reflective stroke */}
            <path
              d="M 68 100 
                 C 98 84, 150 70, 198 58 
                 C 235 48, 262 40, 270 38"
              stroke={`url(#${idPrefix}-gloss)`}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Secondary sharp pinpoint glint */}
            <path
              d="M 125 78 
                 C 148 70, 185 60, 215 52"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.85"
              fill="none"
            />
            {/* Sparkle micro-accents */}
            <circle cx="160" cy="68" r="1.8" fill="#FFFFFF" opacity="0.9" />
            <circle cx="218" cy="51" r="1.3" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}

        {finish === 'Satin' && (
          <g>
            {/* Soft silk luster highlight */}
            <path
              d="M 64 104 
                 C 95 88, 152 74, 204 60 
                 C 238 51, 265 42, 272 40"
              stroke={`url(#${idPrefix}-satin)`}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Delicate inner sheen */}
            <path
              d="M 100 90 
                 C 135 78, 178 66, 218 56"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeOpacity="0.45"
              fill="none"
            />
          </g>
        )}

        {finish === 'Matte' && (
          <g>
            {/* Velvety micro-diffused light band */}
            <path
              d="M 68 104 
                 C 105 88, 160 74, 210 62 
                 C 240 54, 264 45, 270 42"
              stroke={highlightHex}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeOpacity="0.35"
              fill="none"
            />
          </g>
        )}
      </svg>

      {/* Elegant Bottom-Left Miniature Color Capsule Tag */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#F4DDD5]/80 shadow-2xs">
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 shrink-0"
          style={{ backgroundColor: hex }}
        />
        <span className="font-mono text-[10px] text-[#4D292C] font-semibold tracking-wider uppercase">
          {hex}
        </span>
      </div>
    </div>
  );
};
