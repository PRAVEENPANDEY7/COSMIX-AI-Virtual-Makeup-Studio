import type {
  FaceLandmarker,
  FaceLandmarkerResult,
  FilesetResolver,
} from '@mediapipe/tasks-vision';

let landmarkerInstance: FaceLandmarker | null = null;
let currentRunningMode: 'IMAGE' | 'VIDEO' | null = null;
let isInitializing = false;
let initPromise: Promise<FaceLandmarker> | null = null;

const LOCAL_WASM_PATH = '/wasm';
const CDN_WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm';
const LOCAL_MODEL_PATH = '/models/face_landmarker.task';
const CDN_MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

/**
 * Initializes or switches the running mode of the MediaPipe FaceLandmarker.
 * Thread-safe singleton that prevents multiple concurrent loads.
 */
export async function getFaceLandmarker(
  runningMode: 'IMAGE' | 'VIDEO' = 'IMAGE'
): Promise<FaceLandmarker> {
  if (typeof window === 'undefined') {
    throw new Error('FaceLandmarker can only be initialized in the browser environment.');
  }

  // If already initialized with the correct running mode, return instance
  if (landmarkerInstance && currentRunningMode === runningMode) {
    return landmarkerInstance;
  }

  // If currently initializing, wait for it
  if (isInitializing && initPromise) {
    const instance = await initPromise;
    if (currentRunningMode === runningMode) {
      return instance;
    }
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      const visionModule = await import('@mediapipe/tasks-vision');

      // 1. Try local WASM first, fallback to CDN
      let filesetResolver: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;
      try {
        filesetResolver = await visionModule.FilesetResolver.forVisionTasks(LOCAL_WASM_PATH);
      } catch (err) {
        console.warn('Local WASM loading failed, falling back to CDN:', err);
        filesetResolver = await visionModule.FilesetResolver.forVisionTasks(CDN_WASM_PATH);
      }

      // If we already have an instance, we can reconfigure runningMode
      if (landmarkerInstance) {
        await landmarkerInstance.setOptions({ runningMode });
        currentRunningMode = runningMode;
        return landmarkerInstance;
      }

      // 2. Try loading local model, fallback to CDN
      let modelAssetPath = LOCAL_MODEL_PATH;
      try {
        // Quick HEAD/GET check to see if local model is served
        const checkRes = await fetch(LOCAL_MODEL_PATH, { method: 'HEAD' });
        if (!checkRes.ok) {
          modelAssetPath = CDN_MODEL_PATH;
        }
      } catch {
        modelAssetPath = CDN_MODEL_PATH;
      }

      landmarkerInstance = await visionModule.FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath,
            delegate: 'GPU',
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
          runningMode,
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        }
      );

      currentRunningMode = runningMode;
      return landmarkerInstance;
    } catch (error) {
      console.error('Failed to initialize FaceLandmarker with GPU delegate, retrying with CPU:', error);
      // Fallback with CPU delegate if WebGL/GPU delegate fails
      const visionModule = await import('@mediapipe/tasks-vision');
      const filesetResolver = await visionModule.FilesetResolver.forVisionTasks(CDN_WASM_PATH);

      landmarkerInstance = await visionModule.FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: CDN_MODEL_PATH,
            delegate: 'CPU',
          },
          runningMode,
          numFaces: 1,
          minFaceDetectionConfidence: 0.4,
        }
      );

      currentRunningMode = runningMode;
      return landmarkerInstance;
    } finally {
      isInitializing = false;
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Detect facial landmarks in a static HTMLImageElement or HTMLCanvasElement.
 */
export async function detectFaceInImage(
  imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<FaceLandmarkerResult | null> {
  const landmarker = await getFaceLandmarker('IMAGE');
  try {
    const result = landmarker.detect(imageElement);
    return result;
  } catch (err) {
    console.error('Error in detectFaceInImage:', err);
    return null;
  }
}

/**
 * Detect facial landmarks in a video frame with timestamp for real-time tracking.
 */
export async function detectFaceInVideo(
  videoElement: HTMLVideoElement,
  timestampMs: number
): Promise<FaceLandmarkerResult | null> {
  if (!videoElement || videoElement.readyState < 2 || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    return null;
  }
  const landmarker = await getFaceLandmarker('VIDEO');
  if (!landmarker) return null;

  try {
    const result = landmarker.detectForVideo(videoElement, timestampMs);
    return result;
  } catch (err) {
    // Avoid console.error to prevent Next.js dev runtime error overlay during video warm-up or dropped frames
    return null;
  }
}

/**
 * Dispose landmarker instance to free GPU/WASM memory.
 */
export function disposeFaceLandmarker(): void {
  if (landmarkerInstance) {
    try {
      landmarkerInstance.close();
    } catch (e) {
      console.warn('Error closing FaceLandmarker:', e);
    }
    landmarkerInstance = null;
    currentRunningMode = null;
  }
}
