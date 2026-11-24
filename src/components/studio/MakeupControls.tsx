'use client';

import React, { useState } from 'react';
import { RotateCcw, LayoutGrid, Layers, Sliders } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { ShadeSelector } from './ShadeSelector';
import { FinishSelector } from './FinishSelector';
import { IntensitySlider } from './IntensitySlider';

const LipstickIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m14 10-5.5 5.5a2.12 2.12 0 0 1-3 0 2.12 2.12 0 0 1 0-3L11 7" />
    <path d="M12 5.5 16 9.5" />
    <path d="M17 4 19 6" />
    <path d="M19 8.5 14.5 4" />
    <path d="m3 21 3-3" />
    <path d="M8 16 6 18" />
  </svg>
);

export const MakeupControls: React.FC = () => {
  const { resetMakeup } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'shades' | 'finish' | 'intensity'>('shades');

  return (
    <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F4DDD5]/70 flex flex-col space-y-4 sm:space-y-5 text-[#32171F]">
      {/* 1. Card Top Header */}
      <div className="flex items-center justify-between pb-0.5 sm:pb-1">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FCEEEA] flex items-center justify-center text-[#8B2D3E]">
            <LipstickIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B2D3E]" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#32171F] tracking-tight">
            Cosmetics Palette
          </h2>
        </div>

        <button
          onClick={resetMakeup}
          className="flex items-center space-x-1.5 text-xs font-sans text-[#32171F]/70 hover:text-[#8B2D3E] transition-colors cursor-pointer"
          title="Reset lipstick to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Segmented Pill Navigation Tabs */}
      <div className="bg-[#FCEEEA]/50 p-1 rounded-full flex items-center justify-between border border-[#F4DDD5]/60">
        <button
          onClick={() => setActiveTab('shades')}
          className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-sans font-medium flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'shades'
              ? 'bg-[#521D26] text-white shadow-xs'
              : 'text-[#32171F]/70 hover:text-[#32171F]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Shades</span>
        </button>

        <button
          onClick={() => setActiveTab('finish')}
          className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-sans font-medium flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'finish'
              ? 'bg-[#521D26] text-white shadow-xs'
              : 'text-[#32171F]/70 hover:text-[#32171F]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Finish</span>
        </button>

        <button
          onClick={() => setActiveTab('intensity')}
          className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-sans font-medium flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'intensity'
              ? 'bg-[#521D26] text-white shadow-xs'
              : 'text-[#32171F]/70 hover:text-[#32171F]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Intensity</span>
        </button>
      </div>

      {/* Mobile Tabbed View (Sleek and Compact) */}
      <div className="block lg:hidden">
        {activeTab === 'shades' && <ShadeSelector />}
        {activeTab === 'finish' && <FinishSelector />}
        {activeTab === 'intensity' && <IntensitySlider />}
      </div>

      {/* Desktop Full Stacked View */}
      <div className="hidden lg:flex lg:flex-col lg:space-y-5">
        <ShadeSelector />
        <FinishSelector />
        <IntensitySlider />
      </div>
    </div>
  );
};
