import { publicApiFetchInit, resolvePublicFetchUrl } from '@/lib/api';
import type { InsightArticle } from '@/types';

/** Public list for `/blog` — same source as admin (`GET /api/insights`). */
export async function fetchInsightArticlesList(): Promise<
  InsightArticle[] | null
> {
  try {
    const res = await fetch(resolvePublicFetchUrl('insights'), {
      next: { revalidate: 60 },
      ...publicApiFetchInit(),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as InsightArticle[];
  } catch {
    return null;
  }
}

/** Resolve a post by URL segment (`slug` or legacy `id`). */
export async function fetchInsightArticleBySlugParam(
  slug: string,
): Promise<InsightArticle | null> {
  try {
    const res = await fetch(
      resolvePublicFetchUrl(`insights/${encodeURIComponent(slug)}`),
      {
        next: { revalidate: 60 },
        ...publicApiFetchInit(),
      },
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (data && typeof data === 'object' && 'id' in data) {
      return data as InsightArticle;
    }
    return null;
  } catch {
    return null;
  }
}
