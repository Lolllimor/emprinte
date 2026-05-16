'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { getSameOriginApiUrl } from '@/lib/api';

type AdminBootcampOption = { id: string; title: string };

type BootcampRegistrationRow = {
  id: string;
  bootcamp_id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  message?: string;
  submitted_at: string;
  request_status?: string;
  participant_type?: string;
  bootcamp_title?: string | null;
};

type RegistrationSource = 'web' | 'app';

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function listUrl(
  page: number,
  pageSize: number,
  bootcampId: string | null,
  source: RegistrationSource,
): string {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    source,
  });
  if (bootcampId) params.set('bootcampId', bootcampId);
  return `${getSameOriginApiUrl('admin/bootcamp-registrations')}?${params.toString()}`;
}

export default function AdminBootcampRegistrationsPage() {
  const [bootcamps, setBootcamps] = useState<AdminBootcampOption[]>([]);
  const [bootcampId, setBootcampId] = useState('');
  const [source, setSource] = useState<RegistrationSource>('web');
  const [rows, setRows] = useState<BootcampRegistrationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(getSameOriginApiUrl('admin/bootcamps'), {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        const list = Array.isArray(data?.bootcamps) ? data.bootcamps : [];
        setBootcamps(
          list.map((b: { id: string; title: string }) => ({ id: b.id, title: b.title })),
        );
      } catch {
        /* optional */
      }
    })();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filterId = bootcampId.trim() || null;
    try {
      const res = await fetch(listUrl(page, pageSize, filterId, source), {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data?.message === 'string'
            ? data.message
            : 'Could not load bootcamp registrations.',
        );
        setRows([]);
        setTotal(0);
        return;
      }
      setRows((Array.isArray(data?.registrations) ? data.registrations : []) as BootcampRegistrationRow[]);
      setTotal(typeof data?.total === 'number' ? data.total : 0);
    } catch {
      setError('Network error while loading registrations.');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, bootcampId, source]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  const headerActions = useMemo(
    () => (
      <button
        type="button"
        onClick={() => void load()}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-[#005D51]/20 bg-white px-4 font-poppins text-sm font-semibold text-[#005D51] transition hover:border-[#005D51]/40 hover:bg-[#005D51]/06"
      >
        Refresh
      </button>
    ),
    [load],
  );

  return (
    <AdminPageSection
      id="bootcamp-registrations-heading"
      eyebrow="People"
      title="Bootcamp registrations"
      description="Web sign-ups from non-members and in-app join requests from community members with an active subscription."
      actions={headerActions}
    >
      <div className="flex gap-2 rounded-xl border border-[#142218]/10 bg-white p-1 font-poppins text-sm">
        <button
          type="button"
          onClick={() => {
            setSource('web');
            setPage(1);
          }}
          className={`min-h-9 flex-1 rounded-lg px-3 font-semibold transition ${
            source === 'web'
              ? 'bg-[#005D51] text-white'
              : 'text-[#4a5c50] hover:bg-[#005D51]/06'
          }`}
        >
          Web registrations
        </button>
        <button
          type="button"
          onClick={() => {
            setSource('app');
            setPage(1);
          }}
          className={`min-h-9 flex-1 rounded-lg px-3 font-semibold transition ${
            source === 'app'
              ? 'bg-[#005D51] text-white'
              : 'text-[#4a5c50] hover:bg-[#005D51]/06'
          }`}
        >
          App join requests
        </button>
      </div>

      {bootcamps.length > 0 ? (
        <label className="flex max-w-md flex-col gap-1.5 font-poppins text-sm text-[#4a5c50]">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#5c6b5f]">
            Bootcamp
          </span>
          <select
            value={bootcampId}
            onChange={(e) => {
              setBootcampId(e.target.value);
              setPage(1);
            }}
            className="min-h-10 rounded-xl border border-[#142218]/12 bg-white px-3 py-2 text-sm text-[#142218] outline-none focus:border-[#005D51] focus:ring-2 focus:ring-[#6FE19B]/35"
          >
            <option value="">All bootcamps</option>
            {bootcamps.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {error ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-poppins text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="max-w-full overflow-hidden rounded-2xl border border-[#005D51]/12 bg-white shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left font-poppins text-xs">
            <thead>
              <tr>
                <Th>Submitted</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                {source === 'web' ? (
                  <>
                    <Th>Phone</Th>
                    <Th>Message</Th>
                  </>
                ) : (
                  <>
                    <Th>Status</Th>
                    <Th>Type</Th>
                    <Th>Bootcamp</Th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={source === 'web' ? 5 : 6} className="px-4 py-10 text-center text-[#5c6b5f]">
                    Loading…
                  </td>
                </tr>
              ) : !rows.length ? (
                <tr>
                  <td colSpan={source === 'web' ? 5 : 6} className="px-4 py-10 text-center text-[#5c6b5f]">
                    No registrations yet.
                  </td>
                </tr>
              ) : source === 'app' ? (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#142218]/06 last:border-0">
                    <Td title={r.submitted_at}>{formatWhen(r.submitted_at)}</Td>
                    <Td bold>{r.full_name}</Td>
                    <Td>{r.email}</Td>
                    <Td>{r.request_status ?? '—'}</Td>
                    <Td>{r.participant_type ?? '—'}</Td>
                    <Td title={r.bootcamp_title ?? undefined}>{r.bootcamp_title ?? '—'}</Td>
                  </tr>
                ))
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#142218]/06 last:border-0">
                    <Td title={r.submitted_at}>{formatWhen(r.submitted_at)}</Td>
                    <Td bold>{r.full_name}</Td>
                    <Td>{r.email}</Td>
                    <Td>{r.phone?.trim() || '—'}</Td>
                    <Td title={r.message}>{r.message ?? '—'}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && total > 0 ? (
        <p className="font-poppins text-sm text-[#5c6b5f]">
          Page {page} of {totalPages} · {total} total
        </p>
      ) : null}
    </AdminPageSection>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="sticky top-0 z-1 whitespace-nowrap border-b border-[#142218]/10 bg-[#F0FFFD] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#142218]">
      {children}
    </th>
  );
}

function Td({
  children,
  title,
  bold,
}: {
  children: ReactNode;
  title?: string;
  bold?: boolean;
}) {
  return (
    <td
      className={`max-w-[min(18rem,36vw)] px-3 py-2.5 align-top break-words ${
        bold ? 'font-medium text-[#142218]' : 'text-[#4a5c50]'
      }`}
      title={title}
    >
      {children}
    </td>
  );
}
