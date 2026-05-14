import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import type { InsightArticle } from '@/types';

type Row = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  body: string | null;
  href: string | null;
  author_name: string | null;
  author_role: string | null;
};

function rowToArticle(r: Row): InsightArticle {
  return {
    id: r.id,
    date: r.date,
    title: r.title,
    description: r.description,
    image: r.image,
    ...(r.body?.trim() ? { body: r.body.trim() } : {}),
    ...(r.href?.trim() ? { href: r.href.trim() } : {}),
    ...(r.author_name?.trim() ? { authorName: r.author_name.trim() } : {}),
    ...(r.author_role?.trim() ? { authorRole: r.author_role.trim() } : {}),
  };
}

function articleToRow(item: InsightArticle): Record<string, unknown> {
  return {
    id: item.id,
    date: item.date,
    title: item.title,
    description: item.description,
    image: item.image,
    body: item.body?.trim() ? item.body.trim() : null,
    href: item.href?.trim() ? item.href.trim() : null,
    author_name: item.authorName?.trim() ? item.authorName.trim() : null,
    author_role: item.authorRole?.trim() ? item.authorRole.trim() : null,
    updated_at: new Date().toISOString(),
  };
}

/** `null` = Supabase service client not configured (local fallback uses in-memory store). */
export async function fetchAllLandingInsightsFromDb(): Promise<
  InsightArticle[] | null
> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from('landing_insights')
    .select(
      'id, date, title, description, image, body, href, author_name, author_role',
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[landing_insights] list failed', error);
    return null;
  }

  return (data as Row[] | null)?.map(rowToArticle) ?? [];
}

export async function insertLandingInsightInDb(
  item: InsightArticle,
): Promise<boolean> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return false;

  const row = {
    ...articleToRow(item),
    created_at: new Date().toISOString(),
  };

  const { error } = await sb.from('landing_insights').insert(row);

  if (error) {
    console.error('[landing_insights] insert failed', error);
    return false;
  }
  return true;
}

export async function updateLandingInsightInDb(
  item: InsightArticle,
): Promise<boolean> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return false;

  const { error } = await sb
    .from('landing_insights')
    .update(articleToRow(item))
    .eq('id', item.id);

  if (error) {
    console.error('[landing_insights] update failed', error);
    return false;
  }
  return true;
}

export async function deleteLandingInsightFromDb(id: string): Promise<boolean> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return false;

  const { data, error } = await sb
    .from('landing_insights')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('[landing_insights] delete failed', error);
    return false;
  }
  return (data?.length ?? 0) > 0;
}
