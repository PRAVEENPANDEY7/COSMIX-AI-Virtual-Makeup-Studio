import { useEffect, useRef, useCallback } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { LipRenderer } from '@/lib/makeup/lip-renderer';

export function useMakeupRenderer() {
  const rendererRef = useRef<LipRenderer | null>(null);

  const {
    originalImage,
    imageDimensions,
    lipContours,
    selectedShade,
    finish,
    intensity,
    isComparing,
    compareRatio,
  } = useStudioStore();

  useEffect(() => {
    rendererRef.current = new LipRenderer();
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  const renderFrame = useCallback(
    (targetCanvas: HTMLCanvasElement | null) => {
      if (!targetCanvas || !originalImage || !imageDimensions) return;
      const { width, height } = imageDimensions;

      const renderer = rendererRef.current;
      if (!renderer) return;

      if (!lipContours) {
        // Just draw original photo
        targetCanvas.width = width;
        targetCanvas.height = height;
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFF8F5';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(originalImage, 0, 0, width, height);
        }
        return;
      }

      // Render makeup
      renderer.render(
        targetCanvas,
        originalImage,
        lipContours,
        {
          shade: selectedShade,
          finish,
          intensity,
        },
        width,
        height
      );

      // Handle before/after split screen
      if (isComparing) {
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          const splitX = Math.round(width * compareRatio);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, height);
          ctx.clip();
          ctx.drawImage(originalImage, 0, 0, width, height);
          ctx.restore();

          // Draw vertical divider line
          ctx.save();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(2, Math.round(width / 400));
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, height);
          ctx.stroke();
          ctx.restore();
        }
      }
    },
    [
      originalImage,
      imageDimensions,
      lipContours,
      selectedShade,
      finish,
      intensity,
      isComparing,
      compareRatio,
    ]
  );

  return { renderFrame, renderer: rendererRef.current };
}
