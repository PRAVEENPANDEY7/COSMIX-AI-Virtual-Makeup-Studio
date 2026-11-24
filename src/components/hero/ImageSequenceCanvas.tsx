'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useImageSequence, TOTAL_FRAMES } from './useImageSequence';

interface ImageSequenceCanvasProps {
  progress: number; // 0.0 to 1.0
  className?: string;
}

export const ImageSequenceCanvas: React.FC<ImageSequenceCanvasProps> = ({
  progress,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetIndexRef = useRef<number>(1);
  const currentIndexRef = useRef<number>(1);

  const { isFirstFrameLoaded, getFrame } = useImageSequence();

  // Draw frame with pristine 1080p fidelity and exact integer pixel alignment
  const renderFrameToCanvas = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const img = getFrame(frameIndex);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Enable maximum image quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover-fit math preserving center focal point
      const imgRatio = iw / ih;
      const canvasRatio = cw / ch;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX = 0;
      let offsetY = 0;

      // 1.06x subtle center-zoom to naturally crop out bottom-right AI video watermark while preserving pristine 1080p quality
      const cropScale = 1.06;

      if (canvasRatio > imgRatio) {
        drawWidth = cw * cropScale;
        drawHeight = (cw / imgRatio) * cropScale;
        offsetX = (cw - drawWidth) / 2;
        offsetY = (ch - drawHeight) / 2;
      } else {
        drawHeight = ch * cropScale;
        drawWidth = (ch * imgRatio) * cropScale;
        offsetX = (cw - drawWidth) / 2;
        offsetY = (ch - drawHeight) / 2;
      }

      // Round pixel values to eliminate sub-pixel softening/blur
      ctx.drawImage(
        img,
        Math.round(offsetX),
        Math.round(offsetY),
        Math.round(drawWidth),
        Math.round(drawHeight)
      );
    },
    [getFrame]
  );

  // Resize canvas according to display width, height and DPR
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (
      targetWidth > 0 &&
      targetHeight > 0 &&
      (canvas.width !== targetWidth || canvas.height !== targetHeight)
    ) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      renderFrameToCanvas(Math.round(currentIndexRef.current));
    }
  }, [renderFrameToCanvas]);

  // Handle window resize events and ResizeObserver for instant responsive re-render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(canvas);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  // Update target frame from progress
  useEffect(() => {
    const mappedIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
    );
    targetIndexRef.current = mappedIndex;
  }, [progress]);

  // Balanced, Natural Momentum RAF Loop (0.20)
  useEffect(() => {
    let animId: number;

    const smoothPlaybackLoop = () => {
      const diff = targetIndexRef.current - currentIndexRef.current;

      if (Math.abs(diff) > 0.04) {
        // Ultra-fluid damping (0.30) tuned for 448 high-granularity frames
        currentIndexRef.current += diff * 0.30;
        const frameToDraw = Math.round(currentIndexRef.current);
        renderFrameToCanvas(frameToDraw);
      } else if (currentIndexRef.current !== targetIndexRef.current) {
        currentIndexRef.current = targetIndexRef.current;
        renderFrameToCanvas(targetIndexRef.current);
      }

      animId = requestAnimationFrame(smoothPlaybackLoop);
    };

    animId = requestAnimationFrame(smoothPlaybackLoop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [renderFrameToCanvas]);

  // Initial render when first frame is loaded
  useEffect(() => {
    if (isFirstFrameLoaded) {
      handleResize();
      renderFrameToCanvas(1);
    }
  }, [isFirstFrameLoaded, handleResize, renderFrameToCanvas]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        className="block"
      />
    </div>
  );
};
