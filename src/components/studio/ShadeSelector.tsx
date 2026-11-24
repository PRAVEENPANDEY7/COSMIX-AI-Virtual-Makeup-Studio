'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { LIPSTICK_SHADES } from '@/data/lipstick-shades';
import { ShadeCategory, LipstickShade } from '@/types/makeup';

const CATEGORIES: (ShadeCategory | 'All')[] = [
  'All',
  'Red',
  'Pink',
  'Nude',
  'Berry',
  'Coral',
  'Wine',
];

export const ShadeSelector: React.FC = () => {
  const {
    selectedShade,
    setSelectedShade,
    activeCategory,
    setActiveCategory,
  } = useStudioStore();

  const filteredShades =
    activeCategory === 'All'
      ? LIPSTICK_SHADES
      : LIPSTICK_SHADES.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-3">
      {/* Category Pills Header */}
      <div>
        <label className="font-serif text-base font-normal text-[#32171F] block mb-2">
          Color Shades
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[11px] sm:text-xs font-sans px-3 sm:px-3.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#521D26] text-white font-medium shadow-xs'
                  : 'bg-[#FCEEEA]/70 text-[#4D1C24] hover:bg-[#FCEEEA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 6-Column Swatch Circles Grid (2 Rows of 6 = 12 swatches) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
        {filteredShades.slice(0, 12).map((shade: LipstickShade) => {
          const isSelected = selectedShade.id === shade.id;

          return (
            <button
              key={shade.id}
              onClick={() => setSelectedShade(shade)}
              title={`${shade.name} (${shade.category}) - ${shade.description}`}
              className="group flex flex-col items-center space-y-1 focus:outline-none cursor-pointer"
            >
              <div
                className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full transition-transform duration-200 relative flex items-center justify-center shadow-xs ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#521D26] scale-105'
                    : 'group-hover:scale-105 ring-1 ring-black/10'
                }`}
                style={{ backgroundColor: shade.hex }}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-md stroke-[2.5]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Shade Details Card */}
      <div className="bg-[#FFF9F6] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#F4DDD5]/70 flex items-center space-x-2.5 sm:space-x-3.5">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-2xs shrink-0 ring-1 ring-black/10"
          style={{ backgroundColor: selectedShade.hex }}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-serif text-sm sm:text-base font-normal text-[#32171F]">
            {selectedShade.name}
          </h4>
          <p className="text-[10px] sm:text-[11px] font-sans text-[#32171F]/70 leading-snug line-clamp-2 mt-0.5">
            {selectedShade.description}
          </p>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono text-[#32171F]/70 bg-white px-2 py-0.5 rounded border border-[#F4DDD5] uppercase shrink-0 font-medium">
          {selectedShade.hex}
        </span>
      </div>
    </div>
  );
};
