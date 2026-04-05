'use client';

import { FormEvent, useEffect, useState } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { AUTH_API } from '@/constants/auth-api';
import {
  getApiUrl,
  getEditTokenForClient,
  isBackendApiConfigured,
  jsonHeadersWithEditAuth,
} from '@/lib/api';
import { forgotPasswordEmailSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full max-w-md rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-campton font-medium transition focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/40 disabled:opacity-60';

export default function AdminInvitePage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getEditTokenForClient()) {
      window.location.replace('/admin/login');
    }
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isBackendApiConfigured()) {
      setError('Set NEXT_PUBLIC_API_URL to your API server.');
      return;
    }

    const parsed = forgotPasswordEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.flatten().fieldErrors.email?.[0] ?? 'Enter a valid email.',
      );
      return;
    }

    const token = getEditTokenForClient();
    if (!token) {
      window.location.replace('/admin/login');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.invites), {
        method: 'POST',
        headers: jsonHeadersWithEditAuth(),
        body: JSON.stringify({ email: parsed.data.email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : typeof data?.message === 'string'
              ? data.message
              : 'Could not send invite.',
        );
        return;
      }

      setSuccess('Invite sent. They will receive an email with next steps.');
      setEmail('');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPageSection
      id="invite-heading"
      eyebrow="Team"
      title="Send an invite"
      description="Invite someone to the admin workspace. Your API emails them a link; they finish signup on the accept-invite page."
    >
      <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="invite-email"
            className="font-campton text-sm font-semibold uppercase tracking-[0.12em] text-[#015B51]"
          >
            Email
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className={inputClassName}
            placeholder="colleague@example.com"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-700 font-campton" role="alert">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="font-campton text-sm font-medium text-[#015B51]" role="status">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-fit rounded-xl bg-[#015B51] px-5 py-3 font-campton text-sm font-medium text-white hover:bg-[#014238] disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Send invite'}
        </button>
      </form>
    </AdminPageSection>
  );
}
