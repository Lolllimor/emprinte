'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { toast } from 'sonner';

import type { FormSubmitStatus, Testimonial } from '@/types';
import { getApiErrorMessage } from '@/lib/api-errors';
import { getSameOriginApiUrl, adminJsonHeaders } from '@/lib/api';

export function useAdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [status, setStatus] = useState<FormSubmitStatus>({ type: 'idle' });

  useEffect(() => {
    fetch(getSameOriginApiUrl('testimonials'))
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const updateItem = useCallback(
    (idx: number, field: keyof Testimonial, value: string | number) => {
      setItems((list) =>
        list.map((t, i) => (i === idx ? { ...t, [field]: value } : t)),
      );
    },
    [],
  );

  const addItem = useCallback(() => {
    setItems((list) => [
      ...list,
      { id: String(Date.now()), text: '', name: '', title: '', rating: 5 },
    ]);
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((list) => list.filter((_, i) => i !== idx));
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setStatus({ type: 'loading' });
      try {
        const res = await fetch(getSameOriginApiUrl('testimonials'), {
          method: 'PUT',
          credentials: 'include',
          headers: adminJsonHeaders(),
          body: JSON.stringify(items),
        });
        const body = await res.json();
        if (!res.ok) {
          setStatus({
            type: 'error',
            message: getApiErrorMessage(body, 'Failed to update'),
          });
          return;
        }
        toast.success('Testimonials updated.');
        setStatus({ type: 'success', message: 'Testimonials updated.' });
      } catch {
        setStatus({ type: 'error', message: 'Request failed.' });
      }
    },
    [items],
  );

  return { items, updateItem, addItem, removeItem, status, submit };
}
