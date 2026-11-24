import { Point2D, LipContours } from '@/types/makeup';

/**
 * Draws a smooth Catmull-Rom / Cardinal spline closed polygon path on a 2D canvas context.
 */
function drawSmoothClosedPath(ctx: CanvasRenderingContext2D, points: Point2D[], tension = 0.5): void {
  if (points.length < 3) return;

  ctx.beginPath();
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    if (i === 0) {
      ctx.moveTo(p1.x, p1.y);
    }

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }

  ctx.closePath();
}

/**
 * Creates an alpha mask canvas where the lip area is pure white (with feathered edges)
 * and teeth/mouth opening and outside skin are pure black (alpha = 0).
 */
export function createLipMaskCanvas(
  contours: LipContours,
  width: number,
  height: number,
  featherRadius = 2.5
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  // Clear canvas to fully transparent
  ctx.clearRect(0, 0, width, height);

  // 1. Draw outer lip solid mask
  ctx.save();
  ctx.fillStyle = '#ffffff';

  // Apply subtle blur filter for natural anti-aliased edge feathering
  const blurAmount = Math.max(1, Math.min(6, (featherRadius * width) / 1000));
  ctx.filter = `blur(${blurAmount.toFixed(1)}px)`;

  drawSmoothClosedPath(ctx, contours.fullOuter, 0.45);
  ctx.fill();

  // 2. If mouth is open, punch out inner mouth cavity (teeth + mouth interior)
  if (contours.isMouthOpen && contours.fullInner.length >= 6) {
    ctx.globalCompositeOperation = 'destination-out';
    // Slightly smaller blur for inner teeth boundary to maintain crisp edge while avoiding harsh aliasing
    ctx.filter = `blur(${Math.max(1, blurAmount * 0.75).toFixed(1)}px)`;
    drawSmoothClosedPath(ctx, contours.fullInner, 0.45);
    ctx.fill();
  }

  ctx.restore();
  return canvas;
}

/**
 * Generates specular reflection mask data for GLOSS finish.
 * Calculates highlights centered near lower lip center and cupid's bow.
 */
export function generateGlossHighlights(
  contours: LipContours,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, width, height);

  // Find lower lip center
  const lowerOuter = contours.lowerOuter;
  const lowerInner = contours.lowerInner;
  if (!lowerOuter.length || !lowerInner.length) return canvas;

  // Center of lower lip bottom (landmark 17) and inner (14)
  const centerBottom = lowerOuter[Math.floor(lowerOuter.length / 2)] || { x: width / 2, y: height / 2 };
  const centerInner = lowerInner[Math.floor(lowerInner.length / 2)] || centerBottom;

  const glossX = (centerBottom.x + centerInner.x) / 2;
  const glossY = (centerBottom.y * 0.65 + centerInner.y * 0.35);

  const radiusX = Math.abs(contours.fullOuter[10]?.x - contours.fullOuter[0]?.x) * 0.18 || 20;
  const radiusY = Math.abs(centerBottom.y - centerInner.y) * 0.45 || 10;

  // Draw radial gradient for specular reflection
  const gradient = ctx.createRadialGradient(glossX, glossY, 2, glossX, glossY, Math.max(radiusX, radiusY));
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(glossX, glossY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return canvas;
}
