import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

const MAX_EXPORT_ROWS = 10_000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const n = parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  if (max != null) return Math.min(max, Math.floor(n));
  return Math.floor(n);
}

/**
 * List membership applications for landing admins (service role; not exposed to applicants).
 *
 * Query:
 * - `export=all` — full rows for CSV (up to MAX_EXPORT_ROWS); ignores pagination.
 * - `page` (1-based), `pageSize` (1–100, default 50) — paginated list + `total` count.
 */
export async function GET(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY to load applications.',
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const exportAll = url.searchParams.get('export') === 'all';

  if (exportAll) {
    const { data, error } = await service
      .schema('landing')
      .from('community_applications')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(MAX_EXPORT_ROWS);

    if (error) {
      return NextResponse.json(
        { error: 'Could not load applications.', message: error.message },
        { status: 500 },
      );
    }

    const list = data ?? [];
    return NextResponse.json(
      {
        applications: list,
        total: list.length,
        exportAll: true,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const pageSize = parsePositiveInt(
    url.searchParams.get('pageSize'),
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const page = parsePositiveInt(url.searchParams.get('page'), 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await service
    .schema('landing')
    .from('community_applications')
    .select('*', { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json(
      { error: 'Could not load applications.', message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      applications: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
