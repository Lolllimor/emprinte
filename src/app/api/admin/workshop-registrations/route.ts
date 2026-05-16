import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

const BUCKET = 'workshop-registrations';
const MAX_EXPORT_ROWS = 10_000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;
const SIGNED_URL_TTL_SEC = 3600;

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const n = parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  if (max != null) return Math.min(max, Math.floor(n));
  return Math.floor(n);
}

async function attachReceiptUrls<T extends { receipt_storage_path: string | null }>(
  service: ReturnType<typeof createSupabaseServiceRoleClient>,
  rows: T[],
): Promise<(T & { receipt_signed_url: string | null })[]> {
  return Promise.all(
    rows.map(async (row) => {
      const path = row.receipt_storage_path?.trim();
      if (!path || !service) {
        return { ...row, receipt_signed_url: null };
      }
      const { data, error } = await service.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL_SEC);
      return {
        ...row,
        receipt_signed_url: error || !data?.signedUrl ? null : data.signedUrl,
      };
    }),
  );
}

export async function GET(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY to load workshop registrations.',
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const exportAll = url.searchParams.get('export') === 'all';
  const workshopId = url.searchParams.get('workshopId')?.trim() || null;

  let webQuery = service.schema('landing').from('workshop_registrations').select('*');

  if (workshopId) {
    webQuery = webQuery.eq('workshop_id', workshopId);
  }

  if (exportAll) {
    const { data, error } = await webQuery
      .order('submitted_at', { ascending: false })
      .limit(MAX_EXPORT_ROWS);

    if (error) {
      return NextResponse.json(
        { error: 'Could not load registrations.', message: error.message },
        { status: 500 },
      );
    }

    const list = await attachReceiptUrls(service, data ?? []);
    return NextResponse.json(
      {
        registrations: list,
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

  let paginatedQuery = service
    .schema('landing')
    .from('workshop_registrations')
    .select('*', { count: 'exact' });

  if (workshopId) {
    paginatedQuery = paginatedQuery.eq('workshop_id', workshopId);
  }

  const { data, error, count } = await paginatedQuery
    .order('submitted_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json(
      { error: 'Could not load registrations.', message: error.message },
      { status: 500 },
    );
  }

  const list = await attachReceiptUrls(service, data ?? []);

  return NextResponse.json(
    {
      registrations: list,
      total: count ?? 0,
      page,
      pageSize,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
