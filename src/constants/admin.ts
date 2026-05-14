import { todayIsoLocal } from '@/lib/insight-date';
import type { InsightFormInput } from '@/types';

export function createDefaultInsightForm(): InsightFormInput {
  return {
    title: '',
    description: '',
    body: '',
    date: todayIsoLocal(),
    image: '',
    href: '',
    authorName: '',
    authorRole: '',
  };
}
