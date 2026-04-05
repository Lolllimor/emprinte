import type { InsightArticle } from '@/types';

let adminInsights: InsightArticle[] = [];

export function getAllInsights(): InsightArticle[] {
  return [...adminInsights];
}

export function findInsightById(id: string): InsightArticle | undefined {
  return adminInsights.find((i) => i.id === id);
}

export function prependInsight(item: InsightArticle): void {
  adminInsights = [item, ...adminInsights];
}

export function replaceInsight(item: InsightArticle): void {
  const idx = adminInsights.findIndex((i) => i.id === item.id);
  if (idx === -1) return;
  adminInsights[idx] = item;
}

export function deleteInsight(id: string): boolean {
  const next = adminInsights.filter((i) => i.id !== id);
  if (next.length === adminInsights.length) return false;
  adminInsights = next;
  return true;
}
