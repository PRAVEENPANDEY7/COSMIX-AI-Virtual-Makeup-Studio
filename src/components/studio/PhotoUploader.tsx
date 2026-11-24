'use client';

import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, ScanFace } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { loadImageFromFile } from '@/lib/image/image-loader';
import { useFaceLandmarks } from '@/hooks/use-face-landmarks';
import { ProcessingStatus } from './ProcessingStatus';

// Studio Models: Tara, Meera, Zoya, Amara (Original Full-Res Portraits)
const STUDIO_MODELS = [
  {
    id: 'tara',
    name: 'Tara',
    skinTone: 'Dusky Warm',
    url: '/assets/cosmix/models/model-tara.png',
  },
  {
    id: 'meera',
    name: 'Meera',
    skinTone: 'Warm Golden',
    url: '/assets/cosmix/models/model-meera.png',
  },
  {
    id: 'zoya',
    name: 'Zoya',
    skinTone: 'Neutral Olive',
    url: '/assets/cosmix/models/model-zoya.png',
  },
  {
    id: 'amara',
    name: 'Amara',
    skinTone: 'Rich Deep',
    url: '/assets/cosmix/models/model-amara.png',
  },
];

export const PhotoUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    setOriginalImage,
    setMode,
    setProcessingStatus,
  } = useStudioStore();

  const { processImageForFace } = useFaceLandmarks();

  const handleFile = useCallback(
    async (file: File) => {
      setLoadError(null);
      setProcessingStatus({ stage: 'loading-image', message: 'Decoding photograph...' });

      try {
        const decoded = await loadImageFromFile(file);
        setOriginalImage(decoded.element, decoded.objectUrl, file, {
          width: decoded.width,
          height: decoded.height,
        });

        // Run face detection on the decoded photograph
        await processImageForFace(decoded.element, decoded.width, decoded.height);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load image.';
        setLoadError(msg);
        setProcessingStatus({ stage: 'error', message: msg });
      }
    },
    [setOriginalImage, processImageForFace, setProcessingStatus]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const loadDemoPortrait = async (url: string) => {
    setLoadError(null);
    setProcessingStatus({ stage: 'loading-image', message: 'Loading model portrait...' });
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'studio-model.png', { type: blob.type || 'image/png' });
      await handleFile(file);
    } catch {
      setLoadError('Could not load studio model portrait. Please upload an image from your computer.');
      setProcessingStatus({ stage: 'error', message: 'Model load failed.' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 relative z-10">
      {/* 1. Main Centered Hero Section */}
      <div className="text-center mb-6 sm:mb-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center justify-center space-x-2.5 sm:space-x-3 mb-2.5 sm:mb-3">
          <span className="w-6 sm:w-12 h-px bg-[#4D292C]/25" />
          <span className="text-[9px] sm:text-xs font-mono tracking-[0.25em] uppercase text-[#A95755] font-semibold">
            VIRTUAL TRY-ON STUDIO
          </span>
          <span className="w-6 sm:w-12 h-px bg-[#4D292C]/25" />
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-normal text-[#4D292C] tracking-tight leading-[1.1]">
          See Every Shade on <span className="italic font-normal text-[#C9827B]">You</span>
        </h1>
      </div>

      {/* 2. Main Try-On Actions (Two Large Equal Cards Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
        {/* Card 1: Upload Your Portrait */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl sm:rounded-[32px] bg-[#FFF8F5]/90 backdrop-blur-xs border transition-all duration-300 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-between text-center min-h-[210px] sm:min-h-[300px] cursor-pointer group ${
            isDragging
              ? 'border-[#802B36] bg-[#FCEEEA] shadow-xl scale-[1.01]'
              : 'border-[#EBDCD5] shadow-[0_12px_40px_rgba(201,130,123,0.12)] hover:shadow-[0_16px_50px_rgba(201,130,123,0.2)] hover:border-[#C9827B]/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {/* Upload Icon */}
          <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FCEEEA] flex items-center justify-center text-[#802B36] shadow-inner border border-[#EBDCD5]/60 group-hover:scale-105 transition-transform duration-300">
            <UploadCloud className="w-6 h-6 sm:w-9 sm:h-9 stroke-[1.8]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#4D292C] my-3 sm:my-4">
            Upload Your Portrait
          </h2>

          {/* Prominent Burgundy Button */}
          <button
            type="button"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#802B36] group-hover:bg-[#681E27] text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-[#802B36]/25 transition-all group-hover:scale-[1.02] cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
            <span>Choose Photo</span>
            <span className="text-sm sm:text-base font-sans leading-none">→</span>
          </button>
        </div>

        {/* Card 2: Use Live Camera */}
        <div
          onClick={() => setMode('camera')}
          className="relative rounded-2xl sm:rounded-[32px] bg-[#FFF8F5]/90 backdrop-blur-xs border border-[#EBDCD5] shadow-[0_12px_40px_rgba(201,130,123,0.12)] hover:shadow-[0_16px_50px_rgba(201,130,123,0.2)] hover:border-[#C9827B]/60 transition-all duration-300 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-between text-center min-h-[210px] sm:min-h-[300px] cursor-pointer group"
        >
          {/* Camera Icon */}
          <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FCEEEA] flex items-center justify-center text-[#802B36] shadow-inner border border-[#EBDCD5]/60 group-hover:scale-105 transition-transform duration-300">
            <ScanFace className="w-6 h-6 sm:w-9 sm:h-9 stroke-[1.8]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#4D292C] my-3 sm:my-4">
            Use Live Camera
          </h2>

          {/* Outlined Burgundy Button */}
          <button
            type="button"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full border-[1.5px] border-[#802B36] text-[#802B36] bg-transparent group-hover:bg-[#802B36] group-hover:text-white text-xs sm:text-sm font-medium tracking-wide shadow-xs transition-all group-hover:scale-[1.02] cursor-pointer"
          >
            <ScanFace className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Start Camera</span>
            <span className="text-sm sm:text-base font-sans leading-none">→</span>
          </button>
        </div>
      </div>

      {/* 3. Studio Models — 4 Diverse Skin Tone Models */}
      <div className="w-full">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <span className="w-8 sm:w-14 h-px bg-[#4D292C]/20" />
          <h3 className="font-serif text-lg sm:text-2xl text-[#4D292C] font-normal tracking-tight">
            Or Try with Studio Models
          </h3>
          <span className="w-8 sm:w-14 h-px bg-[#4D292C]/20" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
          {STUDIO_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => loadDemoPortrait(model.url)}
              className="flex items-center justify-between p-2 sm:p-2.5 pr-2.5 sm:pr-4 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white border border-[#EBDCD5] hover:border-[#802B36]/40 shadow-xs hover:shadow-md transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-cover bg-center shrink-0 border border-black/5"
                  style={{ backgroundImage: `url(${model.url})` }}
                />
                <div className="min-w-0">
                  <span className="font-serif text-sm sm:text-lg text-[#4D292C] font-medium truncate block leading-tight">
                    {model.name}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-mono text-[#8B2D3E] font-medium block uppercase tracking-normal sm:tracking-wider mt-0.5 truncate">
                    {model.skinTone}
                  </span>
                </div>
              </div>
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#FCEEEA] text-[#802B36] flex items-center justify-center text-[10px] sm:text-xs group-hover:translate-x-0.5 transition-transform shrink-0 ml-1 sm:ml-1.5">
                →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Processing Status & Error Message */}
      <div className="mt-6">
        <ProcessingStatus />
        {loadError && (
          <div className="p-3 bg-rosewood-50 text-rosewood-800 border border-rosewood-200 rounded-xl text-xs text-center max-w-md mx-auto mt-4">
            {loadError}
          </div>
        )}
      </div>
    </div>
  );
};
