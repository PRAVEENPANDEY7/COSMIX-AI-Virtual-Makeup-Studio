import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Color utilities verification
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function srgbToXyz(r, g, b) {
  const pivotRgb = (n) => {
    const v = n / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  };
  const R = pivotRgb(r);
  const G = pivotRgb(g);
  const B = pivotRgb(b);
  return [
    R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    R * 0.2126729 + G * 0.7151522 + B * 0.072175,
    R * 0.0193339 + G * 0.119192 + B * 0.9503041,
  ];
}

function xyzToLab(x, y, z) {
  const Xn = 0.95047, Yn = 1.0, Zn = 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x / Xn), fy = f(y / Yn), fz = f(z / Zn);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labToXyz(L, a, b) {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const invF = (t) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };
  return [0.95047 * invF(fx), 1.0 * invF(fy), 1.08883 * invF(fz)];
}

function xyzToSrgb(x, y, z) {
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;
  const pivotXyz = (n) =>
    n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n;
  return [
    Math.max(0, Math.min(255, Math.round(pivotXyz(r) * 255))),
    Math.max(0, Math.min(255, Math.round(pivotXyz(g) * 255))),
    Math.max(0, Math.min(255, Math.round(pivotXyz(b) * 255))),
  ];
}

function srgbToLab(r, g, b) {
  const [x, y, z] = srgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

function labToSrgb(L, a, b) {
  const [x, y, z] = labToXyz(L, a, b);
  return xyzToSrgb(x, y, z);
}

describe('Color Science & Perceptual Blending', () => {
  test('hexToRgb should parse hex strings correctly', () => {
    assert.deepEqual(hexToRgb('#9B111E'), [155, 17, 30]);
    assert.deepEqual(hexToRgb('#ffffff'), [255, 255, 255]);
    assert.deepEqual(hexToRgb('#000000'), [0, 0, 0]);
  });

  test('getLuminance computes Rec.709 relative luminance', () => {
    const whiteLum = getLuminance(255, 255, 255);
    const blackLum = getLuminance(0, 0, 0);
    assert.equal(Math.round(whiteLum), 1);
    assert.equal(blackLum, 0);
  });

  test('srgbToLab and labToSrgb roundtrip preservation', () => {
    const original = [180, 80, 100];
    const [L, a, b] = srgbToLab(original[0], original[1], original[2]);
    const reconstructed = labToSrgb(L, a, b);
    assert.ok(Math.abs(reconstructed[0] - original[0]) <= 1);
    assert.ok(Math.abs(reconstructed[1] - original[1]) <= 1);
    assert.ok(Math.abs(reconstructed[2] - original[2]) <= 1);
  });
});

describe('Landmarks & Mouth Cavity Geometry', () => {
  const LIP_INDICES = {
    fullOuterCount: 20,
    fullInnerCount: 20,
    leftCornerOuter: 61,
    rightCornerOuter: 291,
    upperInnerCenter: 13,
    lowerInnerCenter: 14,
  };

  test('mouth opening ratio detects closed mouth', () => {
    const dummyLandmarks = new Array(478).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));
    dummyLandmarks[61] = { x: 0.4, y: 0.6, z: 0 };
    dummyLandmarks[291] = { x: 0.6, y: 0.6, z: 0 };
    // Closed mouth: inner upper 13 and inner lower 14 are touching
    dummyLandmarks[13] = { x: 0.5, y: 0.60, z: 0 };
    dummyLandmarks[14] = { x: 0.5, y: 0.602, z: 0 };

    const lipWidth = Math.hypot(dummyLandmarks[291].x - dummyLandmarks[61].x, dummyLandmarks[291].y - dummyLandmarks[61].y);
    const innerGap = Math.hypot(dummyLandmarks[14].x - dummyLandmarks[13].x, dummyLandmarks[14].y - dummyLandmarks[13].y);
    const mouthOpenRatio = innerGap / lipWidth;
    const isMouthOpen = mouthOpenRatio > 0.035;

    assert.equal(isMouthOpen, false, 'Closed mouth should not be flagged as open');
  });

  test('mouth opening ratio detects open mouth with teeth/cavity', () => {
    const dummyLandmarks = new Array(478).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));
    dummyLandmarks[61] = { x: 0.4, y: 0.6, z: 0 };
    dummyLandmarks[291] = { x: 0.6, y: 0.6, z: 0 };
    // Open mouth: gap between 13 and 14 is prominent
    dummyLandmarks[13] = { x: 0.5, y: 0.58, z: 0 };
    dummyLandmarks[14] = { x: 0.5, y: 0.63, z: 0 };

    const lipWidth = Math.hypot(dummyLandmarks[291].x - dummyLandmarks[61].x, dummyLandmarks[291].y - dummyLandmarks[61].y);
    const innerGap = Math.hypot(dummyLandmarks[14].x - dummyLandmarks[13].x, dummyLandmarks[14].y - dummyLandmarks[13].y);
    const mouthOpenRatio = innerGap / lipWidth;
    const isMouthOpen = mouthOpenRatio > 0.035;

    assert.equal(isMouthOpen, true, 'Open mouth should be identified for teeth punch-out');
  });
});
