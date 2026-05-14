import { headers } from 'next/headers';

/**
 * Absolute origin for public URLs (OG, share links, emails).
 * Prefer `NEXT_PUBLIC_SITE_URL` in production.
 */
export async function getPublicSiteOrigin(): Promise<string> {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const rawProto = h.get('x-forwarded-proto') ?? 'http';
  const proto = rawProto.split(',')[0]?.trim() || 'http';
  if (host) {
    return `${proto}://${host}`;
  }

  return `http://127.0.0.1:${process.env.PORT ?? '3000'}`;
}
