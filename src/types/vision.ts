import { Point2D, NormalizedLandmark } from './makeup';

export interface FaceLandmarksResult {
  landmarks: NormalizedLandmark[];
  pixelLandmarks: Point2D[];
  imageWidth: number;
  imageHeight: number;
  faceConfidence?: number;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  width: number;
  height: number;
}
