/**
 * API client for Emprinte backend.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:3001).
 * When empty, falls back to same-origin /api (Next.js routes).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/** Admin auth and content API live on the backend; set NEXT_PUBLIC_API_URL in .env. */
export function isBackendApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}

/** sessionStorage key after signing in at `/admin/login`. */
export const ADMIN_EDIT_TOKEN_SESSION_KEY = 'emprinte_admin_edit_token';

export function getStoredEditToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem(ADMIN_EDIT_TOKEN_SESSION_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function setStoredEditToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ADMIN_EDIT_TOKEN_SESSION_KEY, token);
  } catch {
    /* private mode / quota */
  }
}

export function clearStoredEditToken(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(ADMIN_EDIT_TOKEN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Edit token for admin API calls (browser only). Order:
 * 1. sessionStorage (set after `/admin/login`)
 * 2. NEXT_PUBLIC_EDIT_API_TOKEN (or EDIT_API_TOKEN via next.config `env`, e.g. for local tooling)
 */
export function getEditTokenForClient(): string {
  if (typeof window !== 'undefined') {
    const fromSession = getStoredEditToken();
    if (fromSession) return fromSession;
  }
  return process.env.NEXT_PUBLIC_EDIT_API_TOKEN?.trim() ?? '';
}

export function editApiAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = getEditTokenForClient().trim();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function jsonHeadersWithEditAuth(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...editApiAuthHeaders(),
  };
}

export function getApiUrl(path: string): string {
  const p = path.replace(/^\//, '').replace(/^api\//, '');
  const full = `api/${p}`;
  if (API_URL) {
    return `${API_URL.replace(/\/$/, '')}/${full}`;
  }
  return `/${full}`;
}

/**
 * Absolute URL for fetch() in Server Components (same-origin API or configured backend).
 */
export function resolvePublicFetchUrl(path: string): string {
  const rel = getApiUrl(path);
  if (/^https?:\/\//i.test(rel)) {
    return rel;
  }
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  if (base) {
    return `${base}${rel.startsWith('/') ? rel : `/${rel}`}`;
  }
  return `http://127.0.0.1:${process.env.PORT || '3000'}${
    rel.startsWith('/') ? rel : `/${rel}`
  }`;
}

/** Same as getApiUrl but with query string (e.g. `?id=…` for DELETE). */
export function getApiUrlWithQuery(
  path: string,
  params: Record<string, string | undefined | null>,
): string {
  const base = getApiUrl(path);
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') q.set(key, value);
  }
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
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
