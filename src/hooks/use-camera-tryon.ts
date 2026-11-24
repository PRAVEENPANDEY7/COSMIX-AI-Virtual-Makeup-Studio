import { useEffect, useRef, useState, useCallback } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { CameraManager } from '@/lib/camera/camera-manager';
import { detectFaceInVideo } from '@/lib/vision/face-landmarker';
import { extractLipContours } from '@/lib/vision/landmarks';
import { LipRenderer } from '@/lib/makeup/lip-renderer';
import { NormalizedLandmark } from '@/types/makeup';

/**
 * Adaptive velocity-based filter (One-Euro style) for facial landmarks.
 * When lips move fast (talking, smiling, turning head), factor increases towards 0.92 for ZERO lag.
 * When lips are still, factor lowers to 0.35 to eliminate micro-jitter completely.
 */
function smoothLandmarksAdaptive(
  prev: NormalizedLandmark[] | null,
  curr: NormalizedLandmark[]
): NormalizedLandmark[] {
  if (!prev || prev.length !== curr.length) return curr;

  // Measure movement speed using lip center landmarks (13: upper inner, 14: lower inner)
  const p14 = curr[14];
  const prev14 = prev[14];
  const p13 = curr[13];
  const prev13 = prev[13];

  let speed = 0;
  if (p14 && prev14 && p13 && prev13) {
    const d14 = Math.hypot(p14.x - prev14.x, p14.y - prev14.y);
    const d13 = Math.hypot(p13.x - prev13.x, p13.y - prev13.y);
    speed = (d14 + d13) * 0.5;
  }

  // Dynamic alpha factor between 0.35 (still) and 0.92 (rapid motion)
  const minAlpha = 0.35;
  const maxAlpha = 0.92;
  const factor = Math.min(maxAlpha, Math.max(minAlpha, minAlpha + speed * 85.0));
  const oneMinusFactor = 1 - factor;

  const len = curr.length;
  const result: NormalizedLandmark[] = new Array(len);
  for (let i = 0; i < len; i++) {
    const c = curr[i];
    const p = prev[i];
    result[i] = {
      x: p.x * oneMinusFactor + c.x * factor,
      y: p.y * oneMinusFactor + c.y * factor,
      z: p.z * oneMinusFactor + c.z * factor,
    };
  }

  return result;
}

export function useCameraTryOn() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const rendererRef = useRef<LipRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const smoothedLandmarksRef = useRef<NormalizedLandmark[] | null>(null);

  const [fps, setFps] = useState<number>(0);
  const [isFaceTracked, setIsFaceTracked] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const {
    isCameraActive,
    selectedShade,
    finish,
    intensity,
    setCameraActive,
    setCameraError,
  } = useStudioStore();

  // Initialize camera manager and renderer
  useEffect(() => {
    cameraManagerRef.current = new CameraManager();
    rendererRef.current = new LipRenderer();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      cameraManagerRef.current?.stop();
      rendererRef.current?.dispose();
    };
  }, []);

  const startCamera = useCallback(async (desiredMode?: 'user' | 'environment') => {
    if (!videoRef.current || !cameraManagerRef.current) return;
    const mode = desiredMode || facingMode;
    try {
      setCameraError(null);
      await cameraManagerRef.current.start(videoRef.current, {
        facingMode: mode,
        width: 1280,
        height: 720,
      });
      setFacingMode(mode);
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start camera.';
      setCameraError(msg);
      setCameraActive(false);
    }
  }, [facingMode, setCameraActive, setCameraError]);

  const flipCamera = useCallback(async () => {
    if (!videoRef.current || !cameraManagerRef.current) return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    try {
      setCameraError(null);
      await cameraManagerRef.current.start(videoRef.current, {
        facingMode: nextMode,
        width: 1280,
        height: 720,
      });
      setFacingMode(nextMode);
    } catch {
      // If environment camera is not available on this device, fall back to user camera
      try {
        await cameraManagerRef.current.start(videoRef.current, {
          facingMode: 'user',
          width: 1280,
          height: 720,
        });
        setFacingMode('user');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Camera switch failed.';
        setCameraError(msg);
      }
    }
  }, [facingMode, setCameraError]);

  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    cameraManagerRef.current?.stop();
    setCameraActive(false);
    setIsFaceTracked(false);
    smoothedLandmarksRef.current = null;
  }, [setCameraActive]);

  // Video processing & rendering loop
  useEffect(() => {
    if (!isCameraActive) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let frameCount = 0;
    let lastFpsTime = performance.now();
    let isProcessing = false;
    let lastTimestamp = 0;

    const processFrame = async () => {
      if (!isCameraActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const renderer = rendererRef.current;

      if (
        !isProcessing &&
        video &&
        canvas &&
        renderer &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        isProcessing = true;

        try {
          const width = video.videoWidth;
          const height = video.videoHeight;

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }

          let now = performance.now();
          if (now <= lastTimestamp) {
            now = lastTimestamp + 1;
          }
          lastTimestamp = now;

          const detection = await detectFaceInVideo(video, now);

          if (detection && detection.faceLandmarks && detection.faceLandmarks.length > 0) {
            setIsFaceTracked(true);
            const rawLandmarks = detection.faceLandmarks[0];
            const smoothed = smoothLandmarksAdaptive(smoothedLandmarksRef.current, rawLandmarks);
            smoothedLandmarksRef.current = smoothed;

            const contours = extractLipContours(smoothed, width, height);

            renderer.render(
              canvas,
              video,
              contours,
              {
                shade: selectedShade,
                finish,
                intensity,
                isLiveVideo: true,
              },
              width,
              height
            );
          } else {
            setIsFaceTracked(false);
            // When no face detected in frame, just draw camera feed
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, width, height);
            }
          }

          // FPS calculation
          frameCount++;
          if (now - lastFpsTime >= 1000) {
            setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
            frameCount = 0;
            lastFpsTime = now;
          }
        } catch {
          // Graceful skip
        } finally {
          isProcessing = false;
        }
      }

      if (isCameraActive) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isCameraActive, selectedShade, finish, intensity]);

  return {
    videoRef,
    canvasRef,
    fps,
    isFaceTracked,
    facingMode,
    flipCamera,
    startCamera,
    stopCamera,
  };
}
