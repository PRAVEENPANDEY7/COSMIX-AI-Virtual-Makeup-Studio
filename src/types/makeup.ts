export type LipstickFinish = 'matte' | 'satin' | 'gloss';

export type ShadeCategory = 'Red' | 'Pink' | 'Nude' | 'Berry' | 'Coral' | 'Wine' | 'Brown' | 'Mauve';

export interface LipstickShade {
  id: string;
  name: string;
  hex: string;
  category: ShadeCategory;
  defaultFinish: LipstickFinish;
  description: string;
  rgb: [number, number, number];
}

export interface Point2D {
  x: number;
  y: number;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

export interface LipContours {
  upperOuter: Point2D[];
  upperInner: Point2D[];
  lowerOuter: Point2D[];
  lowerInner: Point2D[];
  fullOuter: Point2D[];
  fullInner: Point2D[];
  isMouthOpen: boolean;
  mouthOpenRatio: number;
}

export interface RenderOptions {
  shade: LipstickShade;
  finish: LipstickFinish;
  intensity: number; // 0.0 to 1.0
  glossBoost?: number; // 0.0 to 1.0
  featherRadius?: number; // pixels
}

export type ProcessingStage =
  | 'idle'
  | 'loading-image'
  | 'initializing-ai'
  | 'detecting-face'
  | 'identifying-lips'
  | 'applying-lipstick'
  | 'ready'
  | 'error';

export interface ProcessingStatusInfo {
  stage: ProcessingStage;
  message: string;
  progress?: number;
}
