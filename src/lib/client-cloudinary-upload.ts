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

/** Same as `uploadImageToCloudinary` but reports upload bytes sent (0–100). */
export function uploadImageToCloudinaryWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/cloudinary');
    xhr.withCredentials = true;
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && ev.total > 0) {
        onProgress(Math.min(100, Math.round((ev.loaded / ev.total) * 100)));
      }
    };
    xhr.onload = () => {
      onProgress(100);
      let data: { url?: string } = {};
      try {
        data = JSON.parse(xhr.responseText) as { url?: string };
      } catch {
        data = {};
      }
      if (xhr.status >= 200 && xhr.status < 300 && typeof data.url === 'string' && data.url) {
        resolve({ ok: true, url: data.url });
        return;
      }
      resolve({
        ok: false,
        message: getApiErrorMessage(data, xhr.status === 0 ? 'Upload failed.' : 'Upload failed'),
      });
    };
    xhr.onerror = () => {
      resolve({ ok: false, message: 'Upload failed.' });
    };
    xhr.onabort = () => {
      resolve({ ok: false, message: 'Upload cancelled.' });
    };
    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });
}
