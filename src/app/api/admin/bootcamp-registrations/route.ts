import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

const MAX_EXPORT_ROWS = 10_000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

type RegistrationSource = 'web' | 'app';

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const n = parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  if (max != null) return Math.min(max, Math.floor(n));
  return Math.floor(n);
}

type AppBootcampParticipantRow = {
  id: string;
  bootcamp_id: string;
  user_id: string;
  request_status: string;
  participant_type: string;
  payment_status: string;
  joined_at: string;
  users: { full_name: string | null; email: string | null } | null;
  bootcamps: { title: string | null } | null;
};

function mapAppParticipant(row: AppBootcampParticipantRow) {
  return {
    source: 'app' as const,
    id: row.id,
    bootcamp_id: row.bootcamp_id,
    full_name: row.users?.full_name?.trim() || '—',
    email: row.users?.email?.trim() || '—',
    phone: null as string | null,
    request_status: row.request_status,
    participant_type: row.participant_type,
    submitted_at: row.joined_at,
    bootcamp_title: row.bootcamps?.title ?? null,
  };
}

async function fetchAppBootcampJoins(
  service: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>,
  bootcampId: string | null,
  exportAll: boolean,
  page: number,
  pageSize: number,
) {
  let query = service
    .from('bootcamp_participants')
    .select(
      'id, bootcamp_id, user_id, request_status, participant_type, payment_status, joined_at, users(full_name, email), bootcamps(title)',
      exportAll ? undefined : { count: 'exact' },
    );

  if (bootcampId) {
    query = query.eq('bootcamp_id', bootcampId);
  }

  query = query.order('joined_at', { ascending: false });

  if (exportAll) {
    const { data, error } = await query.limit(MAX_EXPORT_ROWS);
    if (error) {
      return { error: error.message, registrations: [], total: 0 };
    }
    const list = (data ?? []).map((r) => mapAppParticipant(r as unknown as AppBootcampParticipantRow));
    return { registrations: list, total: list.length };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) {
    return { error: error.message, registrations: [], total: 0 };
  }
  const list = (data ?? []).map((r) => mapAppParticipant(r as unknown as AppBootcampParticipantRow));
  return { registrations: list, total: count ?? 0 };
}

export async function GET(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY to load bootcamp registrations.',
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const exportAll = url.searchParams.get('export') === 'all';
  const bootcampId = url.searchParams.get('bootcampId')?.trim() || null;
  const source = (url.searchParams.get('source')?.trim() || 'web') as RegistrationSource;

  if (source === 'app') {
    const pageSize = parsePositiveInt(
      url.searchParams.get('pageSize'),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const page = parsePositiveInt(url.searchParams.get('page'), 1);
    const result = await fetchAppBootcampJoins(
      service,
      bootcampId,
      exportAll,
      page,
      pageSize,
    );
    if (result.error) {
      return NextResponse.json(
        { error: 'Could not load app join requests.', message: result.error },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        source: 'app',
        registrations: result.registrations,
        total: result.total,
        ...(exportAll ? { exportAll: true } : { page, pageSize }),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let webQuery = service.schema('landing').from('bootcamp_registrations').select('*');

  if (bootcampId) {
    webQuery = webQuery.eq('bootcamp_id', bootcampId);
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
    const list = (data ?? []).map((r) => ({ ...r, source: 'web' as const }));
    return NextResponse.json(
      {
        source: 'web',
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
    .from('bootcamp_registrations')
    .select('*', { count: 'exact' });

  if (bootcampId) {
    paginatedQuery = paginatedQuery.eq('bootcamp_id', bootcampId);
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

  const list = (data ?? []).map((r) => ({ ...r, source: 'web' as const }));

  return NextResponse.json(
    {
      source: 'web',
      registrations: list,
      total: count ?? 0,
      page,
      pageSize,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
