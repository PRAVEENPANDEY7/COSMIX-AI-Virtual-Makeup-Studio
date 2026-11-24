import { LipContours, RenderOptions } from '@/types/makeup';
import { createLipMaskCanvas } from './lip-mask';
import { ShaderManager } from './shader-manager';
import { blendLipColor, getLuminance } from './color-utils';

export class LipRenderer {
  private webglCanvas: HTMLCanvasElement | null = null;
  private shaderManager: ShaderManager | null = null;
  private reusableMaskCanvas: HTMLCanvasElement | null = null;
  private cachedMask: HTMLCanvasElement | null = null;
  private cachedMaskKey: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.webglCanvas = document.createElement('canvas');
      this.shaderManager = new ShaderManager(this.webglCanvas);
      this.reusableMaskCanvas = document.createElement('canvas');
    }
  }

  /**
   * Generates a cached mask key to avoid regenerating the lip mask
   * when only lipstick shade, finish, or intensity changes.
   */
  private getMaskKey(contours: LipContours, width: number, height: number): string {
    const p1 = contours.fullOuter[0] || { x: 0, y: 0 };
    const p2 = contours.fullOuter[10] || { x: 0, y: 0 };
    return `${width}x${height}-${p1.x.toFixed(1)},${p1.y.toFixed(1)}-${p2.x.toFixed(1)},${p2.y.toFixed(1)}-${contours.isMouthOpen}`;
  }

  /**
   * Renders lipstick onto the target canvas without mutating the original source image.
   */
  public render(
    targetCanvas: HTMLCanvasElement,
    sourceImage: CanvasImageSource,
    contours: LipContours,
    options: RenderOptions,
    width: number,
    height: number
  ): void {
    if (targetCanvas.width !== width || targetCanvas.height !== height) {
      targetCanvas.width = width;
      targetCanvas.height = height;
    }

    if (!this.reusableMaskCanvas) {
      this.reusableMaskCanvas = document.createElement('canvas');
    }

    // 1. Get or create lip mask (stream into reusable GPU-accelerated canvas for 60 FPS video)
    let mask: HTMLCanvasElement;
    if (options.isLiveVideo) {
      mask = createLipMaskCanvas(
        contours,
        width,
        height,
        options.featherRadius || 2.5,
        this.reusableMaskCanvas
      );
    } else {
      const maskKey = this.getMaskKey(contours, width, height);
      if (!this.cachedMask || this.cachedMaskKey !== maskKey) {
        this.cachedMask = createLipMaskCanvas(
          contours,
          width,
          height,
          options.featherRadius || 2.5,
          this.reusableMaskCanvas
        );
        this.cachedMaskKey = maskKey;
      }
      mask = this.cachedMask;
    }

    // 2. Try WebGL2 Shader rendering (Hardware Accelerated)
    if (this.shaderManager && this.shaderManager.isSupported() && this.webglCanvas) {
      if (this.webglCanvas.width !== width || this.webglCanvas.height !== height) {
        this.webglCanvas.width = width;
        this.webglCanvas.height = height;
      }

      const success = this.shaderManager.render(
        sourceImage as TexImageSource,
        mask as TexImageSource,
        options.shade.rgb,
        options.finish,
        options.intensity
      );

      if (success) {
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          if (!options.isLiveVideo) {
            ctx.fillStyle = '#FFF8F5';
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(this.webglCanvas, 0, 0);
          return;
        }
      }
    }

    // 3. Fallback: High-precision 2D Canvas CPU rendering
    this.render2DFallback(targetCanvas, sourceImage, mask, options, width, height);
  }

  /**
   * Precision 2D Canvas fallback using CIELAB color blending and texture preservation.
   */
  private render2DFallback(
    targetCanvas: HTMLCanvasElement,
    sourceImage: CanvasImageSource,
    maskCanvas: HTMLCanvasElement,
    options: RenderOptions,
    width: number,
    height: number
  ): void {
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    // Draw luxury warm background, then image
    ctx.fillStyle = '#FFF8F5';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(sourceImage, 0, 0, width, height);

    if (options.intensity <= 0.01) {
      return;
    }

    // Get mask data
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    const pixels = imgData.data;
    const maskPixels = maskData.data;
    const [targetR, targetG, targetB] = options.shade.rgb;
    const intensity = options.intensity;
    const finish = options.finish;

    const len = pixels.length;
    for (let i = 0; i < len; i += 4) {
      const maskAlpha = maskPixels[i + 3] / 255;
      if (maskAlpha < 0.01) continue;

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const effectiveAlpha = maskAlpha * intensity;
      const lum = getLuminance(r, g, b);
      const specularMultiplier = finish === 'gloss' ? Math.pow(Math.max(0, lum), 2.5) : 0;

      const [blendedR, blendedG, blendedB] = blendLipColor(
        r,
        g,
        b,
        targetR,
        targetG,
        targetB,
        effectiveAlpha,
        finish,
        specularMultiplier
      );

      pixels[i] = blendedR;
      pixels[i + 1] = blendedG;
      pixels[i + 2] = blendedB;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  public clearCache(): void {
    this.cachedMask = null;
    this.cachedMaskKey = '';
  }

  public dispose(): void {
    if (this.shaderManager) {
      this.shaderManager.dispose();
      this.shaderManager = null;
    }
    this.webglCanvas = null;
    this.reusableMaskCanvas = null;
    this.cachedMask = null;
  }
}
