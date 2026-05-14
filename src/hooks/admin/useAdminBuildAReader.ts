'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { toast } from 'sonner';

import type { BookProgressProps, FormSubmitStatus } from '@/types';
import { getApiErrorMessage } from '@/lib/api-errors';
import { getSameOriginApiUrl, adminJsonHeaders } from '@/lib/api';

function normalizeBuildAReader(raw: unknown): BookProgressProps | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<BookProgressProps>;
  if (
    typeof o.booksCollected !== 'number' ||
    typeof o.totalBooks !== 'number' ||
    typeof o.pricePerBook !== 'number'
  ) {
    return null;
  }
  const slides = Array.isArray(o.slideshowUrls)
    ? o.slideshowUrls.filter(
        (s): s is string => typeof s === 'string' && /^https?:\/\//i.test(s.trim()),
      )
    : [];
  return {
    booksCollected: o.booksCollected,
    totalBooks: o.totalBooks,
    pricePerBook: o.pricePerBook,
    slideshowUrls: slides.map((s) => s.trim()).slice(0, 5),
  };
}

export function useAdminBuildAReader() {
  const [data, setData] = useState<BookProgressProps | null>(null);
  const [status, setStatus] = useState<FormSubmitStatus>({ type: 'idle' });

  useEffect(() => {
    fetch(getSameOriginApiUrl('build-a-reader'), { cache: 'no-store' })
      .then((r) => r.json())
      .then((raw) => setData(normalizeBuildAReader(raw)))
      .catch(() => setData(null));
  }, []);

  const updateField = useCallback(
    (field: 'booksCollected' | 'totalBooks' | 'pricePerBook', value: number) => {
      setData((d) => (d ? { ...d, [field]: value } : d));
    },
    [],
  );

  const appendSlideUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return;
    setData((d) => {
      if (!d) return d;
      const cur = d.slideshowUrls ?? [];
      if (cur.length >= 5) return d;
      return { ...d, slideshowUrls: [...cur, trimmed] };
    });
  }, []);

  const removeSlideAt = useCallback((index: number) => {
    setData((d) => {
      if (!d) return d;
      const cur = [...(d.slideshowUrls ?? [])];
      cur.splice(index, 1);
      return { ...d, slideshowUrls: cur };
    });
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!data) return;

      setStatus({ type: 'loading' });
      try {
        const res = await fetch(getSameOriginApiUrl('build-a-reader'), {
          method: 'PUT',
          credentials: 'include',
          headers: adminJsonHeaders(),
          body: JSON.stringify(data),
        });
        const body = await res.json();
        if (!res.ok) {
          setStatus({
            type: 'error',
            message: getApiErrorMessage(body, 'Failed to update'),
          });
          return;
        }
        toast.success('Build a Reader updated.');
        setStatus({ type: 'success', message: 'Build a Reader updated.' });
        if (body?.data) {
          const next = normalizeBuildAReader(body.data);
          if (next) setData(next);
        }
      } catch {
        setStatus({ type: 'error', message: 'Request failed.' });
      }
    },
    [data],
  );

  return { data, updateField, appendSlideUrl, removeSlideAt, status, submit };
}
