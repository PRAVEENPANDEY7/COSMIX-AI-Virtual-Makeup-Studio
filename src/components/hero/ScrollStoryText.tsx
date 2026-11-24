'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ScrollStoryTextProps {
  progress: number; // 0.0 to 1.0
  onLaunchStudio?: () => void;
}

interface StoryPhase {
  id: string;
  start: number;
  end: number;
  left: {
    headline: string;
    body: string;
  };
  right: {
    headline: string;
    body: string;
    ctaText?: string;
    ctaAction?: 'scroll' | 'studio';
  };
}

// 5 Balanced Story Phases: Punchy 1-2 word editorial headlines, refined subtitles, and CTA only on finale
const STORY_PHASES: StoryPhase[] = [
  {
    id: 'phase-01',
    start: 0.0,
    end: 0.22,
    left: {
      headline: 'Unique Faces.',
      body: 'Every lip texture and facial contour tells its own singular beauty story.',
    },
    right: {
      headline: 'True Tone.',
      body: 'Finding your signature lipstick begins with understanding your natural undertone.',
    },
  },
  {
    id: 'phase-02',
    start: 0.23,
    end: 0.44,
    left: {
      headline: 'Stop Guessing.',
      body: 'Store displays and bottled swatches cannot predict how pigment reflects on your skin.',
    },
    right: {
      headline: 'Real Light.',
      body: 'Experience how rich hues harmonize with your authentic skin tone and lighting.',
    },
  },
  {
    id: 'phase-03',
    start: 0.45,
    end: 0.66,
    left: {
      headline: 'Pure Expression.',
      body: 'From velvety sheer nudes to sculpted crimsons and luminous berry satins.',
    },
    right: {
      headline: 'Zero Limits.',
      body: 'Experiment fearlessly with bespoke shades you never imagined would flatter your face.',
    },
  },
  {
    id: 'phase-04',
    start: 0.67,
    end: 0.86,
    left: {
      headline: 'Living Geometry.',
      body: '478 real-time coordinates honour your natural lip creases, movement, and smile.',
    },
    right: {
      headline: 'Complete Privacy.',
      body: 'Zero cloud uploads. Your photograph stays strictly on your personal device.',
    },
  },
  {
    id: 'phase-05',
    start: 0.87,
    end: 1.0,
    left: {
      headline: 'Your Canvas.',
      body: 'Celebrate what makes your face uniquely, effortlessly and authentically yours.',
    },
    right: {
      headline: 'Find Yours.',
      body: 'Explore our curated shade atelier and discover the look that speaks to you.',
      ctaText: 'Explore Shades',
      ctaAction: 'scroll',
    },
  },
];

export const ScrollStoryText: React.FC<ScrollStoryTextProps> = ({
  progress,
  onLaunchStudio,
}) => {
  const router = useRouter();

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {STORY_PHASES.map((phase) => {
        let opacity = 0;
        let leftTranslateX = -36;
        let rightTranslateX = 36;

        if (phase.id === 'phase-01') {
          // Phase 01: Fully visible at top (progress 0) and smoothly dissipates as user scrolls
          if (progress <= 0.12) {
            opacity = 1;
            leftTranslateX = 0;
            rightTranslateX = 0;
          } else if (progress <= phase.end) {
            const t = (progress - 0.12) / (phase.end - 0.12);
            opacity = Math.cos(t * (Math.PI / 2));
            leftTranslateX = -(1 - opacity) * 36;
            rightTranslateX = (1 - opacity) * 36;
          } else {
            opacity = 0;
          }
        } else if (phase.id === 'phase-05') {
          // Phase 05: Glides in from both sides and locks solid at closing
          if (progress < phase.start) {
            opacity = 0;
          } else if (progress < 0.93) {
            const t = (progress - phase.start) / (0.93 - phase.start);
            opacity = Math.sin(t * (Math.PI / 2));
            leftTranslateX = -(1 - opacity) * 36;
            rightTranslateX = (1 - opacity) * 36;
          } else {
            opacity = 1;
            leftTranslateX = 0;
            rightTranslateX = 0;
          }
        } else {
          // Middle phases: Smooth cosine bell-curve (arrive from sides, hold, then vanish)
          const mid = (phase.start + phase.end) / 2;
          const halfSpan = (phase.end - phase.start) / 2;
          const dist = Math.abs(progress - mid);
          const normDist = dist / halfSpan;

          if (normDist < 1) {
            opacity = Math.cos(normDist * (Math.PI / 2));
            leftTranslateX = -(1 - opacity) * 36;
            rightTranslateX = (1 - opacity) * 36;
          }
        }

        if (opacity < 0.01) return null;

        return (
          <div key={phase.id} className="absolute inset-0 pointer-events-none">
            {/* DESKTOP VIEW (md+): EXACT 1:1 ORIGINAL UNTOUCHED LUXURY PRESENTATION */}
            <div className="hidden md:flex absolute inset-0 items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 pointer-events-none">
              {/* Left Story Column (glides from left, then dissipates) */}
              <div
                style={{
                  opacity,
                  transform: `translateX(${leftTranslateX}px)`,
                  transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
                }}
                className="max-w-sm lg:max-w-md xl:max-w-lg text-left flex flex-col items-start -translate-y-4 sm:-translate-y-6"
              >
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
                  {phase.left.headline}
                </h2>
                <p className="font-sans text-xs sm:text-sm lg:text-base text-white/95 font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] mt-3 sm:mt-4 max-w-sm">
                  {phase.left.body}
                </p>
              </div>

              {/* Right Story Column (glides from right, then dissipates) */}
              <div
                style={{
                  opacity,
                  transform: `translateX(${rightTranslateX}px)`,
                  transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
                }}
                className="max-w-sm lg:max-w-md xl:max-w-lg text-right flex flex-col items-end -translate-y-4 sm:-translate-y-6 ml-auto"
              >
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
                  {phase.right.headline}
                </h2>
                <p className="font-sans text-xs sm:text-sm lg:text-base text-white/90 font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] mt-3 sm:mt-4 max-w-sm">
                  {phase.right.body}
                </p>

                {/* Action Button */}
                {phase.right.ctaText && (
                  <div className="mt-5 sm:mt-6">
                    <button
                      onClick={() => {
                        if (phase.right.ctaAction === 'scroll') {
                          const el = document.getElementById('shades');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else if (onLaunchStudio) {
                          onLaunchStudio();
                        } else {
                          router.push('/try-on');
                        }
                      }}
                      className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#FFF6F0] hover:bg-white text-[#4D292C] text-xs sm:text-sm font-medium tracking-wide shadow-2xl transition-all hover:scale-105 pointer-events-auto cursor-pointer"
                    >
                      <span>{phase.right.ctaText}</span>
                      <span className="text-base font-sans leading-none">→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE VIEW (<md): STRICTLY AT THE BOTTOM, ZERO TEXT ON FACE OR NECK */}
            <div
              style={{
                opacity,
                transition: 'opacity 0.15s ease-out',
              }}
              className="md:hidden absolute bottom-11 sm:bottom-14 inset-x-0 px-5 flex flex-col items-center justify-end text-center pointer-events-none"
            >
              <div className="w-full max-w-xs mx-auto flex flex-col items-center">
                <h2 className="font-serif text-xl xs:text-2xl font-normal text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  {phase.left.headline} <span className="italic font-normal text-white">{phase.right.headline}</span>
                </h2>
                <p className="font-sans text-[11px] xs:text-xs text-white/95 leading-relaxed mt-1.5 max-w-[290px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] font-normal">
                  {phase.left.body}
                </p>

                {/* Mobile CTA Button */}
                {phase.right.ctaText && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        if (phase.right.ctaAction === 'scroll') {
                          const el = document.getElementById('shades');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else if (onLaunchStudio) {
                          onLaunchStudio();
                        } else {
                          router.push('/try-on');
                        }
                      }}
                      className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#FFF6F0] text-[#4D292C] text-xs font-semibold tracking-wide shadow-2xl pointer-events-auto cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>{phase.right.ctaText}</span>
                      <span className="text-sm font-sans leading-none">→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
