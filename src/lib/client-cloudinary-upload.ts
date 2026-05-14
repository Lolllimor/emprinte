import { getApiErrorMessage } from '@/lib/api-errors';

const MAX_BYTES = 3 * 1024 * 1024;

/** Client-side checks before POST /api/upload/cloudinary (must match server rules). */
export function validateJpegPngUnder3Mb(file: File): string | null {
  const allowed = new Set(['image/jpeg', 'image/jpg', 'image/png']);
  if (file.type && !allowed.has(file.type)) {
    return 'Only JPG and PNG images are allowed.';
  }
  if (file.size > MAX_BYTES) {
    return 'File must be 3 MB or smaller.';
  }
  return null;
}

export async function uploadImageToCloudinary(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const body = new FormData();
  body.append('file', file);
  try {
    const res = await fetch('/api/upload/cloudinary', {
      method: 'POST',
      credentials: 'include',
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string };
    if (!res.ok) {
      return { ok: false, message: getApiErrorMessage(data, 'Upload failed') };
    }
    if (typeof data.url === 'string' && data.url) {
      return { ok: true, url: data.url };
    }
    return { ok: false, message: 'Upload did not return an image URL.' };
  } catch {
    return { ok: false, message: 'Upload failed.' };
  }
}
