import { create } from 'zustand';
import {
  LipstickShade,
  LipstickFinish,
  ShadeCategory,
  LipContours,
  NormalizedLandmark,
  ProcessingStatusInfo,
} from '@/types/makeup';
import { LIPSTICK_SHADES, DEFAULT_SHADE } from '@/data/lipstick-shades';

export interface StudioState {
  // Mode
  mode: 'upload' | 'camera';

  // Photo session
  uploadedFile: File | null;
  originalImage: HTMLImageElement | null;
  originalImageUrl: string | null;
  imageDimensions: { width: number; height: number } | null;

  // Face landmarks & lip contours
  landmarks: NormalizedLandmark[] | null;
  lipContours: LipContours | null;
  isFaceDetected: boolean;
  faceError: string | null;

  // Makeup configurations
  selectedShade: LipstickShade;
  finish: LipstickFinish;
  intensity: number; // 0.0 to 1.0
  activeCategory: ShadeCategory | 'All';

  // Interactive controls
  isComparing: boolean;
  compareRatio: number; // 0.0 to 1.0
  processingStatus: ProcessingStatusInfo;

  // Camera session
  isCameraActive: boolean;
  cameraError: string | null;

  // Actions
  setMode: (mode: 'upload' | 'camera') => void;
  setOriginalImage: (
    image: HTMLImageElement,
    url: string,
    file: File,
    dimensions: { width: number; height: number }
  ) => void;
  setLandmarks: (landmarks: NormalizedLandmark[] | null, contours: LipContours | null) => void;
  setFaceError: (error: string | null) => void;
  setSelectedShade: (shade: LipstickShade) => void;
  setFinish: (finish: LipstickFinish) => void;
  setIntensity: (intensity: number) => void;
  setActiveCategory: (cat: ShadeCategory | 'All') => void;
  setIsComparing: (comparing: boolean) => void;
  setCompareRatio: (ratio: number) => void;
  setProcessingStatus: (status: ProcessingStatusInfo) => void;
  setCameraActive: (active: boolean) => void;
  setCameraError: (err: string | null) => void;
  resetMakeup: () => void;
  resetSession: () => void;
}

const initialStatus: ProcessingStatusInfo = {
  stage: 'idle',
  message: '',
};

export const useStudioStore = create<StudioState>((set, get) => ({
  mode: 'camera',

  uploadedFile: null,
  originalImage: null,
  originalImageUrl: null,
  imageDimensions: null,

  landmarks: null,
  lipContours: null,
  isFaceDetected: false,
  faceError: null,

  selectedShade: DEFAULT_SHADE,
  finish: DEFAULT_SHADE.defaultFinish,
  intensity: 0.85,
  activeCategory: 'All',

  isComparing: false,
  compareRatio: 0.5,
  processingStatus: initialStatus,

  isCameraActive: false,
  cameraError: null,

  setMode: (mode) => set({ mode }),

  setOriginalImage: (image, url, file, dimensions) => {
    const prevUrl = get().originalImageUrl;
    if (prevUrl && prevUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
    }
    set({
      originalImage: image,
      originalImageUrl: url,
      uploadedFile: file,
      imageDimensions: dimensions,
      faceError: null,
    });
  },

  setLandmarks: (landmarks, contours) =>
    set({
      landmarks,
      lipContours: contours,
      isFaceDetected: !!landmarks && !!contours,
      faceError: null,
    }),

  setFaceError: (faceError) => set({ faceError, isFaceDetected: false }),

  setSelectedShade: (shade) =>
    set({
      selectedShade: shade,
      finish: shade.defaultFinish,
    }),

  setFinish: (finish) => set({ finish }),

  setIntensity: (intensity) => set({ intensity }),

  setActiveCategory: (activeCategory) => set({ activeCategory }),

  setIsComparing: (isComparing) => set({ isComparing }),

  setCompareRatio: (compareRatio) => set({ compareRatio }),

  setProcessingStatus: (processingStatus) => set({ processingStatus }),

  setCameraActive: (isCameraActive) => set({ isCameraActive, cameraError: null }),

  setCameraError: (cameraError) => set({ cameraError, isCameraActive: false }),

  resetMakeup: () =>
    set({
      selectedShade: DEFAULT_SHADE,
      finish: DEFAULT_SHADE.defaultFinish,
      intensity: 0.85,
    }),

  resetSession: () => {
    const prevUrl = get().originalImageUrl;
    if (prevUrl && prevUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
    }
    set({
      uploadedFile: null,
      originalImage: null,
      originalImageUrl: null,
      imageDimensions: null,
      landmarks: null,
      lipContours: null,
      isFaceDetected: false,
      faceError: null,
      isCameraActive: false,
      cameraError: null,
      isComparing: false,
      compareRatio: 0.5,
      processingStatus: initialStatus,
    });
  },
}));
