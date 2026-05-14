import type { Area } from 'react-easy-crop';

/** Medium-style story cover: width ÷ height = 2 (2:1). */
export const BLOG_ARTICLE_HERO_ASPECT = 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.src = src;
  });
}

/**
 * Rasterize the cropped region to a JPEG `File` for upload.
 */
export async function getCroppedHeroJpegFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName = 'hero.jpg',
  quality = 0.92,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const w = Math.max(1, Math.floor(pixelCrop.width));
  const h = Math.max(1, Math.floor(pixelCrop.height));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.drawImage(
    image,
    Math.floor(pixelCrop.x),
    Math.floor(pixelCrop.y),
    w,
    h,
    0,
    0,
    w,
    h,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Crop produced an empty image'));
          return;
        }
        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      quality,
    );
  });
}
