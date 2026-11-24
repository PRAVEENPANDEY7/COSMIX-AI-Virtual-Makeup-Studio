'use client';

import React from 'react';
import { useStudioStore } from '@/stores/studio-store';

export const IntensitySlider: React.FC = () => {
  const { intensity, setIntensity } = useStudioStore();
  const percentage = Math.round(intensity * 100);

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <label className="font-serif text-base font-normal text-[#32171F]">
          Color Intensity
        </label>
        <span className="text-xs font-mono font-semibold text-[#4D1C24] bg-[#FCEEEA] px-2.5 py-0.5 rounded-full border border-[#F4DDD5]">
          {percentage}%
        </span>
      </div>

      <div className="pt-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full h-2 bg-[#F4DDD5] rounded-full appearance-none cursor-pointer accent-[#521D26] focus:outline-none"
        />
      </div>
    </div>
  );
};
