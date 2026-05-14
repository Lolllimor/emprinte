import { headers } from 'next/headers';

/**
 * Absolute origin for public URLs (share links, OG, etc.).
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — set in Vercel (Production) to your canonical domain, e.g.
 *    `https://www.emprintereaders.com`, so links never use a deployment hostname.
 * 2. Request `Host` / `X-Forwarded-Host` — when unset, production traffic on your custom domain
 *    still gets correct links (Vercel’s `VERCEL_URL` alone is always `*.vercel.app`).
 * 3. `VERCEL_URL` — fallback when there is no request host (e.g. some build contexts).
 */
export async function getPublicSiteOrigin(): Promise<string> {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;

  const h = await headers();
  const rawHost = h.get('x-forwarded-host') ?? h.get('host');
  const host = rawHost?.split(',')[0]?.trim();
  const rawProto = h.get('x-forwarded-proto') ?? 'http';
  const proto = rawProto.split(',')[0]?.trim() || 'http';
  if (host) {
    return `${proto}://${host}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const vhost = vercel.replace(/^https?:\/\//, '');
    return `https://${vhost}`;
  }

  return `http://127.0.0.1:${process.env.PORT ?? '3000'}`;
}
