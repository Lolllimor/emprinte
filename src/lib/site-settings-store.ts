import {
  navigationLinks,
  footerNavigation,
  socialMediaLinks,
  contactInfo,
  stats,
} from '@/constants/data';

/** In-memory site config (until a persistent backend is wired). */
export const siteSettings = {
  navigationLinks: [...navigationLinks],
  footerNavigation: [...footerNavigation],
  socialMediaLinks: [...socialMediaLinks],
  contactInfo: { ...contactInfo, phone: [...contactInfo.phone] },
  stats: stats.map((s, i) => ({ id: String(i), ...s })),
};

/** Normalize stat id for lookup (`0` and `"0"` both → `"0"`). */
export function normalizeStatId(id: string | number): string {
  if (typeof id === 'number') {
    if (!Number.isInteger(id) || id < 0) return '';
    return String(id);
  }
  return id.trim();
}

export type StatPatchInput = {
  id: string | number;
  value: string;
  label?: string;
};

export type PatchStatsResult =
  | { ok: true; stats: typeof siteSettings.stats }
  | {
      ok: false;
      status: 400 | 404;
      error: string;
      message?: string;
    };

/**
 * Apply stat patches by id. Validates all ids first; returns error without mutating.
 */
export function patchStatsById(
  current: typeof siteSettings.stats,
  patches: StatPatchInput[],
): PatchStatsResult {
  if (patches.length === 0) {
    return { ok: true, stats: current };
  }
  if (!current?.length) {
    return {
      ok: false,
      status: 404,
      error: 'Not found',
      message: 'No stats configured.',
    };
  }

  const byId = new Map<
    string,
    { index: number; row: (typeof current)[number] }
  >();
  current.forEach((row, index) => {
    const key = normalizeStatId(row.id != null ? row.id : String(index));
    if (key) byId.set(key, { index, row });
  });

  const seen = new Set<string>();
  for (const p of patches) {
    const key = normalizeStatId(p.id);
    if (!key) {
      return {
        ok: false,
        status: 400,
        error: 'Invalid input',
        message: 'Invalid stat id.',
      };
    }
    if (seen.has(key)) {
      return {
        ok: false,
        status: 400,
        error: 'Invalid input',
        message: 'Duplicate stat id in request.',
      };
    }
    seen.add(key);
    if (!byId.has(key)) {
      return {
        ok: false,
        status: 404,
        error: 'Not found',
        message: `Unknown stat id: ${key}`,
      };
    }
  }

  const next = current.map((r) => ({ ...r }));
  for (const p of patches) {
    const key = normalizeStatId(p.id);
    const { index } = byId.get(key)!;
    const prev = next[index];
    next[index] = {
      ...prev,
      id: prev.id ?? key,
      value: p.value,
      label: p.label !== undefined ? p.label : prev.label,
    };
  }
  return { ok: true, stats: next };
}

export function updateStatAtIndex(
  index: number,
  patch: { value: string; label?: string },
): { ok: true; stat: { value: string; label: string } } | { ok: false } {
  const list = siteSettings.stats;
  if (!list || index < 0 || index >= list.length) {
    return { ok: false };
  }
  const prev = list[index];
  const next = {
    ...prev,
    value: patch.value,
    label: patch.label !== undefined ? patch.label : prev.label,
  };
  list[index] = next;
  return { ok: true, stat: { value: next.value, label: next.label } };
}
