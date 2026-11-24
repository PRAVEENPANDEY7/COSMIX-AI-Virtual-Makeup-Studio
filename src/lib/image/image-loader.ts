import { validateImageFile } from './image-validation';

export interface DecodedImage {
  element: HTMLImageElement;
  width: number;
  height: number;
  objectUrl: string;
}

/**
 * Loads and decodes an image file into an HTMLImageElement with dimension verification.
 */
export async function loadImageFromFile(file: File): Promise<DecodedImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.');
  }

  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (img.naturalWidth < 80 || img.naturalHeight < 80) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image dimensions too small. Please upload a photo with at least 80x80 pixels.'));
        return;
      }
      resolve({
        element: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        objectUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image. The file may be corrupted.'));
    };

    img.src = objectUrl;
  });
}
