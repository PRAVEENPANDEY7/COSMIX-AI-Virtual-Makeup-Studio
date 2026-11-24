import { Point2D, NormalizedLandmark, LipContours } from '@/types/makeup';
import { BoundingBox } from '@/types/vision';

// Standard 468/478 FaceMesh Lip Landmark Indices
export const LIP_LANDMARK_INDICES = {
  // Upper Lip Outer contour: from left corner (61) to right corner (291)
  upperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],

  // Upper Lip Inner contour: from left corner (78) to right corner (308)
  upperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],

  // Lower Lip Outer contour: from right corner (291) to left corner (61)
  lowerOuter: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61],

  // Lower Lip Inner contour: from right corner (308) to left corner (78)
  lowerInner: [308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],

  // Full continuous outer loop (clockwise: upper outer then lower outer)
  fullOuter: [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
    375, 321, 405, 314, 17, 84, 181, 91, 146,
  ],

  // Full continuous inner cavity loop (clockwise: upper inner then lower inner)
  fullInner: [
    78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
    324, 318, 402, 317, 14, 87, 178, 88, 95,
  ],

  // Critical key points
  leftCornerOuter: 61,
  rightCornerOuter: 291,
  leftCornerInner: 78,
  rightCornerInner: 308,
  cupidsBowCenter: 0,
  upperInnerCenter: 13,
  lowerInnerCenter: 14,
  lowerOuterCenter: 17,
};

/**
 * Convert normalized landmark (0-1) to image pixel coordinate.
 */
export function normalizedToPixel(
  landmark: NormalizedLandmark,
  width: number,
  height: number
): Point2D {
  return {
    x: Math.max(0, Math.min(width, landmark.x * width)),
    y: Math.max(0, Math.min(height, landmark.y * height)),
  };
}

/**
 * Extract lip contours with open-mouth detection.
 */
export function extractLipContours(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
): LipContours {
  const getPoints = (indices: number[]): Point2D[] =>
    indices.map((idx) => {
      const lm = landmarks[idx];
      if (!lm) {
        return { x: 0, y: 0 };
      }
      return normalizedToPixel(lm, width, height);
    });

  const upperOuter = getPoints(LIP_LANDMARK_INDICES.upperOuter);
  const upperInner = getPoints(LIP_LANDMARK_INDICES.upperInner);
  const lowerOuter = getPoints(LIP_LANDMARK_INDICES.lowerOuter);
  const lowerInner = getPoints(LIP_LANDMARK_INDICES.lowerInner);
  const fullOuter = getPoints(LIP_LANDMARK_INDICES.fullOuter);
  const fullInner = getPoints(LIP_LANDMARK_INDICES.fullInner);

  // Compute mouth opening ratio
  const ptLeft = landmarks[LIP_LANDMARK_INDICES.leftCornerOuter];
  const ptRight = landmarks[LIP_LANDMARK_INDICES.rightCornerOuter];
  const ptUpperInner = landmarks[LIP_LANDMARK_INDICES.upperInnerCenter];
  const ptLowerInner = landmarks[LIP_LANDMARK_INDICES.lowerInnerCenter];

  let mouthOpenRatio = 0;
  let isMouthOpen = false;

  if (ptLeft && ptRight && ptUpperInner && ptLowerInner) {
    const lipWidth = Math.hypot(ptRight.x - ptLeft.x, ptRight.y - ptLeft.y);
    const innerGap = Math.hypot(
      ptLowerInner.x - ptUpperInner.x,
      ptLowerInner.y - ptUpperInner.y
    );
    mouthOpenRatio = innerGap / Math.max(lipWidth, 0.001);
    // If inner gap is larger than ~3% of mouth width, mouth is open (teeth/cavity visible)
    isMouthOpen = mouthOpenRatio > 0.035;
  }

  return {
    upperOuter,
    upperInner,
    lowerOuter,
    lowerInner,
    fullOuter,
    fullInner,
    isMouthOpen,
    mouthOpenRatio,
  };
}

/**
 * Calculate bounding box around the lips with padding for localized processing.
 */
export function getLipBoundingBox(
  contours: LipContours,
  imageWidth: number,
  imageHeight: number,
  paddingPercent = 0.25
): BoundingBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of contours.fullOuter) {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const padX = width * paddingPercent;
  const padY = height * paddingPercent;

  const xMin = Math.max(0, Math.floor(minX - padX));
  const yMin = Math.max(0, Math.floor(minY - padY));
  const xMax = Math.min(imageWidth, Math.ceil(maxX + padX));
  const yMax = Math.min(imageHeight, Math.ceil(maxY + padY));

  return {
    xMin,
    yMin,
    xMax,
    yMax,
    width: xMax - xMin,
    height: yMax - yMin,
  };
}
