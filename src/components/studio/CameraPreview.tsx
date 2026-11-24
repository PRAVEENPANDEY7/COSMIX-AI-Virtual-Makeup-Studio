'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ScanFace,
  CameraOff,
  Video,
  Activity,
  AlertTriangle,
  Image as ImageIcon,
  Camera,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import { useCameraTryOn } from '@/hooks/use-camera-tryon';
import { useStudioStore } from '@/stores/studio-store';

export const CameraPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    videoRef,
    canvasRef,
    fps,
    isFaceTracked,
    startCamera,
    stopCamera,
  } = useCameraTryOn();

  const {
    isCameraActive,
    cameraError,
    selectedShade,
    finish,
    setOriginalImage,
    setMode,
    isComparing,
    setIsComparing,
  } = useStudioStore();

  // Auto-start camera when mounting in camera mode
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Handle file upload from Choose Photo button
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      stopCamera();
      setOriginalImage(img, url, file, { width: img.naturalWidth, height: img.naturalHeight });
      setMode('upload');
    };
    img.src = url;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Snapshot capture
  const handleTakeSnapshot = () => {
    if (!canvasRef.current) return;
    try {
      const link = document.createElement('a');
      link.download = `cosmix-${selectedShade.id}-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.warn('Snapshot capture failed:', e);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] max-h-[65vh] sm:max-h-none sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl sm:rounded-[28px] overflow-hidden bg-[#180E13] border border-[#3E1D24]/40 shadow-2xl flex items-center justify-center group select-none"
    >
      {/* Hidden file input for Choose Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Hidden source video */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Main Mirrored Live Video Canvas (Fills entire card edge-to-edge) */}
      {isCameraActive ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block transform -scale-x-100" // Mirrored selfie view
        />
      ) : (
        /* Camera Inactive State */
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center p-8 bg-[#180E13]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9827B]">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <p className="font-serif text-lg text-[#FFF6F0] font-light">
              Camera is currently inactive
            </p>
            <p className="text-xs text-[#FFF6F0]/60 mt-1 max-w-xs font-sans leading-relaxed">
              Click &apos;Start Camera&apos; to enable real-time mirror lipstick tracking.
            </p>
          </div>
          <button
            onClick={startCamera}
            className="px-6 py-2.5 rounded-full bg-[#8B2D3E] hover:bg-[#A3364A] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            Enable Camera
          </button>
        </div>
      )}

      {/* Top Floating Controls Overlay */}
      <div className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 right-2.5 sm:right-5 z-20 flex items-center justify-between pointer-events-none gap-1.5 sm:gap-2">
        {/* Top-Left: Back to Studio Models & Tracking Badges */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto">
          {/* Back button to Model selection page */}
          <button
            onClick={() => {
              stopCamera();
              const store = useStudioStore.getState();
              store.resetSession();
              store.setMode('upload');
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md text-xs font-sans font-medium transition-all cursor-pointer shadow-md group shrink-0"
            title="Go back to Model portraits & photo selection"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-cosmix-gold group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium text-white/95 hidden xs:inline">Studio Models</span>
            <span className="font-medium text-white/95 xs:hidden">Models</span>
          </button>

          <div
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono backdrop-blur-md border shrink-0 ${
              isFaceTracked
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="hidden xs:inline">{isFaceTracked ? 'Face Tracked' : 'Center Face'}</span>
            <span className="xs:hidden">{isFaceTracked ? 'Tracked' : 'Align'}</span>
          </div>

          {isCameraActive && (
            <div className="hidden sm:block bg-white/10 text-white/90 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono border border-white/10 shrink-0">
              {fps || 18} FPS
            </div>
          )}
        </div>

        {/* Top-Right: Choose Photo & Stop/Start Camera Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 pointer-events-auto shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[11px] sm:text-xs font-sans backdrop-blur-md border border-white/15 transition-all cursor-pointer shrink-0"
            title="Upload photo from device"
          >
            <ImageIcon className="w-3.5 h-3.5 opacity-80 shrink-0" />
            <span className="hidden sm:inline">Choose Photo</span>
          </button>

          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-[#7D2433] hover:bg-[#962B3D] text-white rounded-full text-[11px] sm:text-xs font-sans font-medium backdrop-blur-md shadow-xs transition-all cursor-pointer shrink-0"
              title="Stop live camera mirror"
            >
              <CameraOff className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[11px] sm:text-xs font-sans font-medium backdrop-blur-md shadow-xs transition-all cursor-pointer shrink-0"
              title="Start live camera mirror"
            >
              <ScanFace className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Start Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Edge Floating Action Buttons (Vertical Column) */}
      <div className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-2 sm:space-y-2.5">
        {/* 1. Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          aria-label="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* 2. Snapshot Capture */}
        <button
          onClick={handleTakeSnapshot}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title="Take Snapshot"
          aria-label="Take Snapshot"
        >
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* 3. Compare / Toggle Original */}
        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
            isComparing
              ? 'bg-[#8B2D3E] text-white border-white/30'
              : 'bg-black/40 hover:bg-black/65 border-white/15 text-white/90 hover:text-white'
          }`}
          title="Toggle Before / After Makeup"
          aria-label="Toggle Before / After"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Bottom-Left Floating Lip Zoom Preview Card */}
      <div className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-5 z-20 flex items-center space-x-2 sm:space-x-3 p-1 sm:p-1.5 pr-2.5 sm:pr-4 rounded-xl sm:rounded-2xl bg-[#140A0E]/90 backdrop-blur-md border border-white/15 shadow-xl max-w-[calc(100%-60px)] sm:max-w-none">
        {/* Square Lip Zoom Preview Box */}
        <div
          className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0 relative flex items-center justify-center shadow-inner"
        >
          {/* Swatch or zoomed lip preview representation */}
          <div
            className="w-6 h-3 sm:w-8 sm:h-4 rounded-full blur-[1px] transform -rotate-12 transition-colors duration-300"
            style={{ backgroundColor: selectedShade.hex }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none"
          />
        </div>

        {/* Shade Dot & Name */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <div
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ring-1 ring-white/30"
            style={{ backgroundColor: selectedShade.hex }}
          />
          <span className="font-serif text-xs sm:text-sm font-medium text-white tracking-wide truncate">
            {selectedShade.name}
          </span>
        </div>

        {/* Finish Badge */}
        <span className="font-mono text-[8px] sm:text-[9px] uppercase px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-medium shrink-0">
          {finish}
        </span>
      </div>

      {/* Camera Error Banner */}
      {cameraError && (
        <div className="absolute bottom-16 left-4 right-4 z-30 flex items-center space-x-2 p-3 bg-red-950/90 text-red-200 border border-red-800 rounded-xl text-xs max-w-md mx-auto shadow-2xl backdrop-blur-md">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}
    </div>
  );
};
