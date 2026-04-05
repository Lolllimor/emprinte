'use client';

import { useCallback, useEffect, useState } from 'react';

import { editApiAuthHeaders, getApiUrl } from '@/lib/api';
import type { NewsletterSubscriber } from '@/types';

function formatSubscribedAt(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function escapeCsvCell(value: string): string {
  if (value.includes('"')) {
    value = value.replace(/"/g, '""');
  }
  return /[",\n\r]/.test(value) ? `"${value}"` : value;
}

function buildSubscribersCsv(rows: NewsletterSubscriber[]): string {
  const header = ['id', 'full_name', 'email', 'phone', 'subscribed_at'];
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        escapeCsvCell(r.id),
        escapeCsvCell(r.fullName),
        escapeCsvCell(r.email),
        escapeCsvCell(r.phone),
        escapeCsvCell(r.createdAt ?? ''),
      ].join(',')
    ),
  ];
  return '\uFEFF' + lines.join('\n');
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminSubscribersPanel() {
  const [list, setList] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('emails'), {
        headers: editApiAuthHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          'Could not load subscribers.';
        throw new Error(msg);
      }
      if (!Array.isArray(data)) {
        setList([]);
        return;
      }
      setList(data as NewsletterSubscriber[]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not load subscribers.'
      );
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(
      buildSubscribersCsv(list),
      `newsletter-subscribers-${stamp}.csv`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => load()}
          className="rounded-lg border border-[#dce5e0] bg-white px-4 py-2 font-campton text-sm font-medium text-[#2a3d32] hover:bg-[#f8faf9]"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={list.length === 0 || loading}
          className="rounded-lg bg-[#015B51] px-4 py-2 font-campton text-sm font-medium text-white hover:bg-[#014238] disabled:opacity-50"
        >
          Download CSV
        </button>
      </div>

      {error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="font-campton text-sm text-[#5a6b62]">Loading subscribers…</p>
      ) : list.length === 0 ? (
        <p className="font-campton text-sm text-[#5a6b62]">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#dce5e0] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8faf9] font-campton text-[#3d4a42]">
              <tr>
                <th className="px-3 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium">Email</th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                  Phone
                </th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                  Subscribed
                </th>
                <th className="px-3 py-2.5 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id || row.email} className="border-t border-[#eef3f0] font-campton">
                  <td className="px-3 py-2 text-[#142218]">{row.fullName || '—'}</td>
                  <td className="px-3 py-2 text-[#142218]">{row.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-[#5a6b62]">
                    {row.phone || '—'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-[#5a6b62]">
                    {formatSubscribedAt(row.createdAt)}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-[#6b7f75]">
                    {row.id || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
