'use client';

import React from 'react';

interface SatinWaveProps {
  className?: string;
}

export const SatinWave: React.FC<SatinWaveProps> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none relative ${className}`}>
      {/* 
        Bespoke 3D Satin Silk Drape matching reference image (media_1795454172722_941834f7.jpg):
        - Gentle rose wave crest on the left (curving behind/around the lipstick card)
        - Dramatic, high-swelling 3D twisted silk ribbon on the right with specular light crest
        - Seamless deep wine bottom foundation
      */}
      <svg
        viewBox="0 0 1440 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-32 sm:h-44 md:h-52 lg:h-64"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Right Ribbon Front Face: Rich Burgundy Wine Velvet Gradient */}
          <linearGradient id="ribbonFront" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#822436" />
            <stop offset="35%" stopColor="#9C3348" />
            <stop offset="70%" stopColor="#631B29" />
            <stop offset="100%" stopColor="#42111B" />
          </linearGradient>

          {/* Right Ribbon Inner Curl: Lighter Luminous Dusty Rose Satin Sheen */}
          <linearGradient id="ribbonInner" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#4E1320" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#C87582" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#EAA8B0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9E394C" stopOpacity="0.85" />
          </linearGradient>

          {/* Left Wave Gradient: Smooth Velvet Rose & Burgundy */}
          <linearGradient id="leftWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#702130" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#912E40" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#591624" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38151E" stopOpacity="1" />
          </linearGradient>

          {/* Golden Rose Specular Light Crest on Ribbon Edge */}
          <linearGradient id="crestHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5A6AE" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#FDE6D2" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#F5C0A8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D48692" stopOpacity="0.4" />
          </linearGradient>

          {/* Soft Silk Floating Drop Shadow onto Canvas */}
          <filter id="ribbonShadow" x="-10%" y="-20%" width="120%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#2B0B13" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Ambient Soft Silk Flow Layer (Drapes softly on the left) */}
        <path
          d="M 0,160 C 130,120 260,130 400,180 C 560,230 720,240 880,220 C 720,250 540,255 380,220 C 240,185 120,180 0,205 Z"
          fill="#D9949E"
          opacity="0.35"
        />

        {/* 2. Left Flowing Ribbon (Curving under card, dipping gracefully in center with organic curved bottom) */}
        <path
          d="M 0,180 C 130,130 270,145 420,200 C 560,245 720,250 860,225 C 720,265 540,265 390,235 C 250,200 120,195 0,225 Z"
          fill="url(#leftWaveGrad)"
          filter="url(#ribbonShadow)"
        />

        {/* 3. Right Inner Turned Ribbon Face (Flowing organic loop) */}
        <path
          d="M 520,245 C 700,230 880,125 1140,65 C 1280,30 1380,85 1440,110 C 1380,140 1270,95 1130,115 C 870,175 690,265 520,265 Z"
          fill="url(#ribbonInner)"
        />

        {/* 4. Right Foreground Main Ribbon (High cresting front fold with organic curved bottom) */}
        <path
          d="M 560,248 C 740,238 910,140 1160,72 C 1290,32 1395,78 1440,105 C 1395,145 1280,100 1150,125 C 900,185 730,270 560,270 Z"
          fill="url(#ribbonFront)"
          filter="url(#ribbonShadow)"
        />

        {/* 5. Specular Crest Glint: Razor-sharp light streak along the top fold of the right wave */}
        <path
          d="M 620,245 C 780,230 940,135 1160,72 C 1290,32 1395,78 1440,105"
          stroke="url(#crestHighlight)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.95"
        />
      </svg>
    </div>
  );
};
