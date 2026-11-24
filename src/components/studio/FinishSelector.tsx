'use client';

import React from 'react';
import { Sparkles, Layers, Check, Shield } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { LipstickFinish } from '@/types/makeup';

interface FinishOption {
  id: LipstickFinish;
  title: string;
  icon: React.ElementType;
}

const FINISHES: FinishOption[] = [
  {
    id: 'matte',
    title: 'Matte',
    icon: Shield,
  },
  {
    id: 'satin',
    title: 'Satin',
    icon: Layers,
  },
  {
    id: 'gloss',
    title: 'Gloss',
    icon: Sparkles,
  },
];

export const FinishSelector: React.FC = () => {
  const { finish, setFinish } = useStudioStore();

  return (
    <div className="space-y-2">
      <label className="font-serif text-base font-normal text-[#32171F] block">
        Texture & Finish
      </label>

      <div className="grid grid-cols-3 gap-2.5">
        {FINISHES.map((item) => {
          const isSelected = finish === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setFinish(item.id)}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#521D26] bg-[#FFF5F2] text-[#521D26] shadow-2xs font-medium'
                  : 'border-[#F4DDD5] bg-white text-[#32171F]/80 hover:bg-[#FFF9F6]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#521D26]' : 'text-[#8B2D3E]/70'}`} />
                <span className="text-xs font-sans font-medium">{item.title}</span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#521D26] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
