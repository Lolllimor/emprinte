import { cache } from 'react';

import { getDefaultSiteSettings } from '@/constants/data';
import { resolvePublicFetchUrl } from '@/lib/api';
import type { SiteSettings } from '@/types';

/**
 * Server-only: loads public site settings from `GET /api/settings` (same origin or
 * `NEXT_PUBLIC_API_URL`). Cached per request; revalidates every 60s.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const defaults = getDefaultSiteSettings();
  try {
    const res = await fetch(resolvePublicFetchUrl('settings'), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaults;
    const raw: unknown = await res.json();
    if (!raw || typeof raw !== 'object') return defaults;
    const o = raw as Partial<SiteSettings>;
    if (!o.contactInfo || typeof o.contactInfo.email !== 'string') {
      return defaults;
    }
    return {
      ...defaults,
      ...o,
      contactInfo: {
        ...defaults.contactInfo,
        ...o.contactInfo,
        phone:
          Array.isArray(o.contactInfo.phone) && o.contactInfo.phone.length > 0
            ? o.contactInfo.phone
            : defaults.contactInfo.phone,
      },
    };
  } catch {
    return defaults;
  }
});
