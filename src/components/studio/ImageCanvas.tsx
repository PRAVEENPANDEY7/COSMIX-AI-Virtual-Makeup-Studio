'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  RefreshCw,
  Upload,
  Eye,
  Camera,
  Maximize2,
  Minimize2,
  Video,
  ChevronLeft,
} from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { useMakeupRenderer } from '@/hooks/use-makeup-renderer';
import { downloadCanvasImage } from '@/lib/image/image-export';

export const ImageCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    originalImage,
    selectedShade,
    finish,
    intensity,
    isComparing,
    compareRatio,
    isFaceDetected,
    setOriginalImage,
    setMode,
    setIsComparing,
  } = useStudioStore();

  const { renderFrame } = useMakeupRenderer();

  // Re-render lipstick instantaneously whenever configuration changes
  useEffect(() => {
    if (canvasRef.current && originalImage) {
      renderFrame(canvasRef.current);
    }
  }, [
    renderFrame,
    originalImage,
    selectedShade,
    finish,
    intensity,
    isComparing,
    compareRatio,
  ]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const filename = `cosmix-${selectedShade.id}-${finish}`;
    downloadCanvasImage(canvasRef.current, filename, 'image/png');
  };

  const handleNewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalImage(img, url, file, { width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-[28px] overflow-hidden bg-[#180E13] border border-[#3E1D24]/40 shadow-2xl flex items-center justify-center group select-none"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleNewPhoto}
        className="hidden"
      />

      {/* Main Image Canvas Display */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />

      {/* Top Floating Controls */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 z-20 flex items-center justify-between pointer-events-none">
        {/* Top-Left: Back to Studio Models + Face Mesh Status */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => {
              const store = useStudioStore.getState();
              store.resetSession();
              store.setMode('upload');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md text-xs font-sans font-medium transition-all cursor-pointer shadow-md group"
            title="Go back to Model portraits & photo selection"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-cosmix-gold group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium text-white/95">Studio Models</span>
          </button>

          {isFaceDetected ? (
            <div className="flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-300 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono border border-emerald-500/30">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face Tracked</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 bg-amber-500/15 text-amber-300 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono border border-amber-500/30">
              <span>Scanning Face...</span>
            </div>
          )}
        </div>

        {/* Top-Right: Change Photo & Switch to Camera */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-sans backdrop-blur-md border border-white/15 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 opacity-80" />
            <span>Change Photo</span>
          </button>

          <button
            onClick={() => setMode('camera')}
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 bg-[#7D2433] hover:bg-[#962B3D] text-white rounded-full text-xs font-sans font-medium backdrop-blur-md shadow-xs transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Right Edge Action Column */}
      <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-2.5">
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleDownload}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title="Save Photo"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
            isComparing
              ? 'bg-[#8B2D3E] text-white border-white/30'
              : 'bg-black/40 hover:bg-black/65 border-white/15 text-white/90 hover:text-white'
          }`}
          title="Toggle Before / After Makeup"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom-Left Shade Tag */}
      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 z-20 flex items-center space-x-3 p-1.5 pr-4 rounded-2xl bg-[#140A0E]/90 backdrop-blur-md border border-white/15 shadow-xl">
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0 relative flex items-center justify-center shadow-inner">
          <div
            className="w-8 h-4 rounded-full blur-[1px] transform -rotate-12 transition-colors duration-300"
            style={{ backgroundColor: selectedShade.hex }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/30"
            style={{ backgroundColor: selectedShade.hex }}
          />
          <span className="font-serif text-sm font-medium text-white tracking-wide">
            {selectedShade.name}
          </span>
        </div>

        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-medium">
          {finish}
        </span>
      </div>
    </div>
  );
};
