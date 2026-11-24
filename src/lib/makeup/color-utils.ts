/**
 * Precision Color Science & Perceptual Blending Utilities for Virtual Makeup
 */

export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Standard Rec. 709 relative luminance.
 */
export function getLuminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Convert sRGB (0-255) to CIE-XYZ.
 */
function srgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const pivotRgb = (n: number) => {
    const v = n / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  };

  const R = pivotRgb(r);
  const G = pivotRgb(g);
  const B = pivotRgb(b);

  // D65 standard illuminant
  const x = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;

  return [x, y, z];
}

/**
 * Convert CIE-XYZ to sRGB (0-255).
 */
function xyzToSrgb(x: number, y: number, z: number): [number, number, number] {
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  const pivotXyz = (n: number) => {
    return n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n;
  };

  r = Math.max(0, Math.min(255, Math.round(pivotXyz(r) * 255)));
  g = Math.max(0, Math.min(255, Math.round(pivotXyz(g) * 255)));
  b = Math.max(0, Math.min(255, Math.round(pivotXyz(b) * 255)));

  return [r, g, b];
}

/**
 * Convert CIE-XYZ to CIE-L*a*b* (D65).
 */
function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // Reference white D65
  const Xn = 0.95047;
  const Yn = 1.0;
  const Zn = 1.08883;

  const f = (t: number) => {
    return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  };

  const fx = f(x / Xn);
  const fy = f(y / Yn);
  const fz = f(z / Zn);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [L, a, b];
}

/**
 * Convert CIE-L*a*b* to CIE-XYZ.
 */
function labToXyz(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const invF = (t: number) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  return [0.95047 * invF(fx), 1.0 * invF(fy), 1.08883 * invF(fz)];
}

export function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = srgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

export function labToSrgb(L: number, a: number, b: number): [number, number, number] {
  const [x, y, z] = labToXyz(L, a, b);
  return xyzToSrgb(x, y, z);
}

/**
 * Perceptual Lipstick Blending in CIELAB color space.
 * Preserves the user's natural lip texture, wrinkles, shadows and skin reflections.
 */
export function blendLipColor(
  origR: number,
  origG: number,
  origB: number,
  targetR: number,
  targetG: number,
  targetB: number,
  alpha: number,
  finish: 'matte' | 'satin' | 'gloss',
  specularMultiplier = 0
): [number, number, number] {
  if (alpha <= 0.001) {
    return [origR, origG, origB];
  }

  // Convert both to perceptual Lab
  const [origL, origA, origB_lab] = srgbToLab(origR, origG, origB);
  const [targetL, targetA, targetB_lab] = srgbToLab(targetR, targetG, targetB);

  // Preserve underlying lip luminance (lighting & micro-wrinkles)
  let resultL: number;
  let resultA: number;
  let resultB: number;

  switch (finish) {
    case 'matte':
      // Deep velvety pigment, soften high specular peaks
      resultL = origL * (1 - alpha * 0.2) + targetL * (alpha * 0.2);
      if (origL > 75) {
        resultL = resultL * 0.95; // Matte compresses specular blowouts
      }
      resultA = origA * (1 - alpha) + targetA * alpha;
      resultB = origB_lab * (1 - alpha) + targetB_lab * alpha;
      break;

    case 'satin':
      // Balanced luminous finish
      resultL = origL * (1 - alpha * 0.15) + targetL * (alpha * 0.15);
      resultA = origA * (1 - alpha * 0.92) + targetA * (alpha * 0.92);
      resultB = origB_lab * (1 - alpha * 0.92) + targetB_lab * (alpha * 0.92);
      break;

    case 'gloss':
      // Glossy sheen: preserves underlying luminance and amplifies specular highlights
      resultL = origL * (1 - alpha * 0.1) + targetL * (alpha * 0.1);
      resultA = origA * (1 - alpha * 0.85) + targetA * (alpha * 0.85);
      resultB = origB_lab * (1 - alpha * 0.85) + targetB_lab * (alpha * 0.85);
      break;
  }

  let [r, g, b] = labToSrgb(resultL, resultA, resultB);

  // Add glossy specular highlight if requested
  if (finish === 'gloss' && specularMultiplier > 0.01) {
    const glossLight = Math.round(specularMultiplier * 140 * alpha);
    r = Math.min(255, r + glossLight);
    g = Math.min(255, g + glossLight);
    b = Math.min(255, b + glossLight);
  }

  return [r, g, b];
}
