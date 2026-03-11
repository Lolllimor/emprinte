/**
 * API client for Emprinte backend.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:3001).
 * When empty, falls back to same-origin /api (Next.js routes).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function getApiUrl(path: string): string {
  const p = path.replace(/^\//, '').replace(/^api\//, '');
  const full = `api/${p}`;
  if (API_URL) {
    return `${API_URL.replace(/\/$/, '')}/${full}`;
  }
  return `/${full}`;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data?.message || data?.error || 'Request failed') as string;
    throw new Error(msg);
  }
  return data as T;
}
