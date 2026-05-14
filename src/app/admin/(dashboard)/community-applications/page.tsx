'use client';

import { useCallback, useEffect, useState } from 'react';

import { getApiUrl } from '@/lib/api';

type ApplicationRow = {
  id: string;
  submitted_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  plan_choice: string;
  gender: string;
  professional_status: string;
};

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

export default function AdminCommunityApplicationsPage() {
  const [rows, setRows] = useState<ApplicationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('admin/community-applications'), {
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data?.message === 'string'
            ? data.message
            : typeof data?.error === 'string'
              ? data.error
              : 'Could not load applications.',
        );
        setRows([]);
        return;
      }
      setRows(Array.isArray(data?.applications) ? data.applications : []);
    } catch {
      setError('Network error while loading applications.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#005D51]/12 bg-white p-5 shadow-sm sm:p-6">
        <p className="font-poppins text-sm leading-relaxed text-[#4a5c50]">
          Submissions from the public <strong className="text-[#142218]">Apply</strong> flow
          (membership form + fee receipt). For full detail and files, open{' '}
          <strong className="text-[#142218]">Supabase</strong> →{' '}
          <strong className="text-[#142218]">Table Editor</strong> → schema{' '}
          <code className="rounded bg-[#142218]/06 px-1.5 py-0.5 text-xs">landing</code> →{' '}
          <code className="rounded bg-[#142218]/06 px-1.5 py-0.5 text-xs">
            community_applications
          </code>{' '}
          (portrait and receipt paths point to Storage).
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-[#005D51]/20 bg-white px-4 font-poppins text-sm font-semibold text-[#005D51] transition hover:border-[#005D51]/40"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-poppins text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#005D51]/12 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left font-poppins text-sm">
            <thead>
              <tr className="border-b border-[#142218]/10 bg-[#F0FFFD]/80">
                <th className="px-4 py-3 font-semibold text-[#142218]">Submitted</th>
                <th className="px-4 py-3 font-semibold text-[#142218]">Name</th>
                <th className="px-4 py-3 font-semibold text-[#142218]">Email</th>
                <th className="px-4 py-3 font-semibold text-[#142218]">Phone</th>
                <th className="px-4 py-3 font-semibold text-[#142218]">Plan</th>
                <th className="px-4 py-3 font-semibold text-[#142218]">Location</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#5c6b5f]">
                    Loading…
                  </td>
                </tr>
              ) : !rows?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#5c6b5f]">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#142218]/06 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-[#4a5c50]">
                      {formatWhen(r.submitted_at)}
                    </td>
                    <td className="px-4 py-3 text-[#142218]">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-[#142218]">{r.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#4a5c50]">{r.phone}</td>
                    <td className="px-4 py-3 text-[#4a5c50]">{r.plan_choice}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-[#4a5c50]">{r.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
