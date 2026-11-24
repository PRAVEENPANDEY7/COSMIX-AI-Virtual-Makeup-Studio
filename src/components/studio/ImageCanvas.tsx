'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  RefreshCw,
  Upload,
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
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    if (typeof document !== 'undefined') {
      try {
        const el = containerRef.current as any;
        const doc = document as any;
        if (nextState) {
          if (el?.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if (el?.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
          } else if (el?.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else if (el?.msRequestFullscreen) {
            el.msRequestFullscreen();
          }
        } else {
          if (doc.exitFullscreen && doc.fullscreenElement) {
            doc.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen && doc.mozFullScreenElement) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen && doc.msFullscreenElement) {
            doc.msExitFullscreen();
          }
        }
      } catch {
        // Fall back cleanly to CSS fullscreen
      }
    }
  };

  useEffect(() => {
    const onFSChange = () => {
      const isFS = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isFS && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('webkitfullscreenchange', onFSChange);
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#180E13] border border-[#3E1D24]/40 shadow-2xl flex items-center justify-center group select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen h-[100dvh] rounded-none border-none'
          : 'aspect-[3/4] max-h-[65vh] sm:max-h-none sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl sm:rounded-[28px]'
      }`}
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
      <div className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 right-2.5 sm:right-5 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Top-Left: Back to Studio Models */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto">
          <button
            onClick={() => {
              const store = useStudioStore.getState();
              store.resetSession();
              store.setMode('upload');
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-sans font-medium transition-all cursor-pointer shadow-md group shrink-0"
            title="Go back to Model portraits & photo selection"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-cosmix-gold group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="font-medium text-white/95 hidden xs:inline">Studio Models</span>
            <span className="font-medium text-white/95 xs:hidden">Models</span>
          </button>
        </div>

        {/* Top-Right: Change Photo & Switch to Camera */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[11px] sm:text-xs font-sans backdrop-blur-md border border-white/15 transition-all cursor-pointer shrink-0"
            title="Change Photo"
          >
            <Upload className="w-3.5 h-3.5 opacity-80 shrink-0" />
            <span className="hidden sm:inline">Change Photo</span>
          </button>

          <button
            onClick={() => setMode('camera')}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-[#7D2433] hover:bg-[#962B3D] text-white rounded-full text-[11px] sm:text-xs font-sans font-medium backdrop-blur-md shadow-xs transition-all cursor-pointer shrink-0"
            title="Live Camera"
          >
            <Video className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Live Camera</span>
          </button>
        </div>
      </div>

      {/* Right Edge Action Column */}
      <div className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-2.5 sm:space-y-3">
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/95 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleDownload}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/95 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title="Save Photo"
          aria-label="Save Photo"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
            isComparing
              ? 'bg-[#8B2D3E] text-white border-white/40'
              : 'bg-black/50 hover:bg-black/75 border-white/20 text-white/95 hover:text-white'
          }`}
          title="Toggle Before / After Makeup"
          aria-label="Toggle Before / After Makeup"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom-Left Shade Tag */}
      <div className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-5 z-20 flex items-center space-x-2 sm:space-x-3 p-1 sm:p-1.5 pr-2.5 sm:pr-4 rounded-xl sm:rounded-2xl bg-[#140A0E]/90 backdrop-blur-md border border-white/15 shadow-xl max-w-[calc(100%-60px)] sm:max-w-none">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0 relative flex items-center justify-center shadow-inner">
          <div
            className="w-6 h-3 sm:w-8 sm:h-4 rounded-full blur-[1px] transform -rotate-12 transition-colors duration-300"
            style={{ backgroundColor: selectedShade.hex }}
          />
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <div
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ring-1 ring-white/30"
            style={{ backgroundColor: selectedShade.hex }}
          />
          <span className="font-serif text-xs sm:text-sm font-medium text-white tracking-wide truncate">
            {selectedShade.name}
          </span>
        </div>

        <span className="font-mono text-[8px] sm:text-[9px] uppercase px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-medium shrink-0">
          {finish}
        </span>
      </div>
    </div>
  );
};
