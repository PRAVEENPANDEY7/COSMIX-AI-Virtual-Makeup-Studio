import { useEffect, useRef, useState, useCallback } from 'react';

export const TOTAL_FRAMES = 299;

function getFrameUrl(index: number): string {
  const pad = String(index).padStart(3, '0');
  return `/assets/cosmix/sequence/ezgif-frame-${pad}.jpg`;
}

export function useImageSequence() {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Progressive Preloading Pipeline
  useEffect(() => {
    let isCancelled = false;

    // Helper to load a single frame
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imagesRef.current[index]) {
          return resolve(imagesRef.current[index]!);
        }

        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          setLoadedCount((c) => c + 1);
          resolve(img);
        };
        img.onerror = reject;
      });
    };

    // Stage 1: Load First Frame Immediately
    loadFrame(1)
      .then(() => {
        if (!isCancelled) setIsFirstFrameLoaded(true);
      })
      .catch((err) => console.warn('Failed to load first frame:', err));

    // Stage 2: Load Key Anchors (every 10th frame)
    const anchorIndices: number[] = [];
    for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
      anchorIndices.push(i);
    }

    // Stage 3: Progressive Batch Loader
    const loadAllProgressively = async () => {
      // Load anchors first
      for (const idx of anchorIndices) {
        if (isCancelled) return;
        try {
          await loadFrame(idx);
        } catch {}
      }

      // Concurrency worker queue for the rest of frames
      const remainingIndices: number[] = [];
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) remainingIndices.push(i);
      }

      const concurrency = 4;
      let currentIndex = 0;

      const worker = async () => {
        while (currentIndex < remainingIndices.length && !isCancelled) {
          const idx = remainingIndices[currentIndex++];
          try {
            await loadFrame(idx);
          } catch {}
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);
    };

    // Run progressive loader in idle/background
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        loadAllProgressively();
      }, 50);
      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }
  }, []);

  /**
   * Returns the exact frame or the nearest loaded frame to avoid flickering
   */
  const getFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, targetIndex));
    if (imagesRef.current[clamped]) {
      return imagesRef.current[clamped];
    }

    // Search nearest available frame
    for (let offset = 1; offset < 30; offset++) {
      if (clamped - offset >= 1 && imagesRef.current[clamped - offset]) {
        return imagesRef.current[clamped - offset];
      }
      if (clamped + offset <= TOTAL_FRAMES && imagesRef.current[clamped + offset]) {
        return imagesRef.current[clamped + offset];
      }
    }

    return imagesRef.current[1] || null;
  }, []);

  return {
    isFirstFrameLoaded,
    loadedCount,
    totalFrames: TOTAL_FRAMES,
    getFrame,
  };
}
