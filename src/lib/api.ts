/**
 * API client for Emprinte backend.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:3001).
 * When empty, falls back to same-origin /api (Next.js routes).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/** Optional separate API base URL (legacy / other services). */
export function isBackendApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}

/** Same-origin admin API: Supabase session cookie (no bearer header). */
export function adminJsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

/** @deprecated Use adminJsonHeaders — auth is cookie-based. */
export function jsonHeadersWithEditAuth(): HeadersInit {
  return adminJsonHeaders();
}

/** @deprecated No-op — auth is cookie-based. */
export function editApiAuthHeaders(): Record<string, string> {
  return {};
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
 * Always `/api/...` on the current Next origin. Use from Client Components for
 * Route Handlers defined in this app so reads match admin writes (avoids
 * `NEXT_PUBLIC_API_URL` pointing at another host).
 */
export function getSameOriginApiUrl(path: string): string {
  const p = path.replace(/^\//, '').replace(/^api\//, '');
  return `/api/${p}`;
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

const PUBLIC_API_FETCH_TIMEOUT_MS = 8_000;

/**
 * Merge into server `fetch` calls that hit `resolvePublicFetchUrl` during static
 * generation so `next build` does not hang when no server is listening.
 */
export function publicApiFetchInit(): Pick<RequestInit, 'signal'> {
  return { signal: AbortSignal.timeout(PUBLIC_API_FETCH_TIMEOUT_MS) };
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

/** Same-origin `/api/...?…` for admin client fetches. */
export function getSameOriginApiUrlWithQuery(
  path: string,
  params: Record<string, string | undefined | null>,
): string {
  const base = getSameOriginApiUrl(path);
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
