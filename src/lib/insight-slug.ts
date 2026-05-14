import type { InsightArticle } from '@/types';

const MAX_SLUG_LEN = 96;

/** URL-safe slug from a title (lowercase, hyphens, no leading/trailing hyphen). */
export function slugifyTitle(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > 0) return s.slice(0, MAX_SLUG_LEN);
  return 'post';
}

/** Ensure `candidate` is unique against `used` (adds -2, -3, … if needed). */
export function uniqueSlug(candidate: string, used: Set<string>): string {
  const base = candidate.slice(0, MAX_SLUG_LEN).replace(/-+$/g, '') || 'post';
  let out = base;
  let n = 0;
  while (used.has(out)) {
    n += 1;
    const suffix = `-${n}`;
    out = `${base.slice(0, MAX_SLUG_LEN - suffix.length)}${suffix}`;
  }
  used.add(out);
  return out;
}

export function pickSlugForCreate(
  title: string,
  requestedSlug: string | undefined,
  existing: Pick<InsightArticle, 'id' | 'slug'>[],
): string {
  const used = new Set<string>();
  for (const e of existing) {
    if (e.slug?.trim()) used.add(e.slug.trim().toLowerCase());
    used.add(e.id);
  }
  const raw = requestedSlug?.trim().toLowerCase();
  if (raw && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) {
    return uniqueSlug(raw, used);
  }
  return uniqueSlug(slugifyTitle(title), used);
}

export function pickSlugForUpdate(
  article: Pick<InsightArticle, 'id' | 'slug'>,
  requestedSlug: string | undefined,
  existing: Pick<InsightArticle, 'id' | 'slug'>[],
): string {
  const current = article.slug?.trim().toLowerCase() || article.id;
  const raw = requestedSlug?.trim().toLowerCase();

  if (!raw || raw === current) {
    return current;
  }

  const used = new Set<string>();
  for (const e of existing) {
    if (e.id === article.id) continue;
    if (e.slug?.trim()) used.add(e.slug.trim().toLowerCase());
    used.add(e.id);
  }

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) {
    return uniqueSlug(raw, used);
  }
  return current;
}

export function articlePublicPath(article: { slug?: string; id: string }): string {
  const s = article.slug?.trim();
  if (s) return s;
  return article.id;
}
