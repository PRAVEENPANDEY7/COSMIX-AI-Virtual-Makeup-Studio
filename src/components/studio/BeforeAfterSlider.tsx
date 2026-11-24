'use client';

import React from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { Split } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const { isComparing, setIsComparing, compareRatio, setCompareRatio } = useStudioStore();

  return (
    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-studio-200 shadow-sm text-xs">
      <button
        onClick={() => setIsComparing(!isComparing)}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          isComparing
            ? 'bg-rosewood-700 text-white shadow-xs'
            : 'text-studio-700 hover:text-studio-950 hover:bg-studio-100'
        }`}
      >
        <Split className="w-3.5 h-3.5" />
        <span>{isComparing ? 'Split View Active' : 'Compare Before/After'}</span>
      </button>

      {isComparing && (
        <div className="flex items-center space-x-2 pl-1 border-l border-studio-200">
          <span className="text-[10px] uppercase font-mono text-studio-500">Before</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={compareRatio}
            onChange={(e) => setCompareRatio(parseFloat(e.target.value))}
            className="w-20 h-1 bg-studio-200 rounded-lg appearance-none cursor-pointer accent-rosewood-600"
          />
          <span className="text-[10px] uppercase font-mono text-studio-500">After</span>
        </div>
      )}
    </div>
  );
};
