'use client';

import React from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { ImageCanvas } from './ImageCanvas';
import { CameraPreview } from './CameraPreview';
import { MakeupControls } from './MakeupControls';
import { PhotoUploader } from './PhotoUploader';

export const TryOnStudio: React.FC = () => {
  const { mode, originalImage } = useStudioStore();

  // When user is on Model Selection page (upload mode without active portrait)
  if (mode === 'upload' && !originalImage) {
    return <PhotoUploader />;
  }

  return (
    <div className="w-full max-w-[1360px] mx-auto px-2.5 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 items-start w-full">
        {/* Left Column: Live Camera Mirror / Viewport (7 cols) */}
        <div className="lg:col-span-7 w-full">
          {mode === 'camera' || !originalImage ? (
            <CameraPreview />
          ) : (
            <ImageCanvas />
          )}
        </div>

        {/* Right Column: Cosmetics Palette (5 cols) */}
        <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
          <MakeupControls />
        </div>
      </div>
    </div>
  );
};
