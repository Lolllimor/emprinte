'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { toast } from 'sonner';

import type { BookProgressProps, FormSubmitStatus } from '@/types';
import { getApiErrorMessage } from '@/lib/api-errors';
import { getApiUrl, adminJsonHeaders } from '@/lib/api';

export function useAdminBuildAReader() {
  const [data, setData] = useState<BookProgressProps | null>(null);
  const [status, setStatus] = useState<FormSubmitStatus>({ type: 'idle' });

  useEffect(() => {
    fetch(getApiUrl('build-a-reader'))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const updateField = useCallback(
    (field: keyof BookProgressProps, value: number) => {
      setData((d) => (d ? { ...d, [field]: value } : d));
    },
    [],
  );

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!data) return;

      setStatus({ type: 'loading' });
      try {
        const res = await fetch(getApiUrl('build-a-reader'), {
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
      } catch {
        setStatus({ type: 'error', message: 'Request failed.' });
      }
    },
    [data],
  );

  return { data, updateField, status, submit };
}
