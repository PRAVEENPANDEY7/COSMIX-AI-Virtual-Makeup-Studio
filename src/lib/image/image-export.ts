/**
 * Export high-resolution rendered canvas to user device
 */
export function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  filenamePrefix = 'makeup-tryon',
  format: 'image/png' | 'image/jpeg' = 'image/png'
): void {
  const extension = format === 'image/jpeg' ? 'jpg' : 'png';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${filenamePrefix}-${timestamp}.${extension}`;

  const dataUrl = canvas.toDataURL(format, 0.95);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
