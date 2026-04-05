import { resolvePublicFetchUrl } from '@/lib/api';
import type { InsightArticle } from '@/types';

export async function fetchInsightArticleById(
  id: string,
): Promise<InsightArticle | null> {
  try {
    const res = await fetch(
      resolvePublicFetchUrl(`insights/${encodeURIComponent(id)}`),
      {
        next: { revalidate: 60 },
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
