import { z } from 'zod';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ImageFileSchema = z
  .instanceof(File, { message: 'Please select a valid image file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, {
    message: 'Image size exceeds maximum limit of 10 MB.',
  })
  .refine((file) => ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()), {
    message: 'Unsupported format. Please upload JPG, JPEG, PNG, or WebP.',
  });

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

export function validateImageFile(file: File): ImageValidationResult {
  const parseResult = ImageFileSchema.safeParse(file);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors[0]?.message || 'Invalid image file.';
    return { valid: false, error: errorMsg };
  }
  return { valid: true, file };
}
