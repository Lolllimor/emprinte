'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { AUTH_API } from '@/constants/auth-api';
import { getApiUrl, getApiUrlWithQuery } from '@/lib/api';
import { acceptInviteFormSchema } from '@/lib/validation/accept-invite';

const inputClassName =
  'w-full rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-campton focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-campton';

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token')?.trim() ?? '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [previewLoading, setPreviewLoading] = useState(!!tokenFromUrl);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  useEffect(() => {
    const t = token.trim();
    if (!t) {
      setPreviewLoading(false);
      setPreviewError(null);
      setPreviewLabel(null);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError(null);

    void (async () => {
      try {
        const res = await fetch(
          getApiUrlWithQuery(AUTH_API.invitePreview, { token: t }),
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setPreviewError(
            typeof data?.error === 'string'
              ? data.error
              : 'This invite link is invalid or has expired.',
          );
          setPreviewLabel(null);
          return;
        }
        const email =
          typeof data?.email === 'string'
            ? data.email
            : typeof data?.inviteeEmail === 'string'
              ? data.inviteeEmail
              : null;
        setPreviewLabel(email ? `Invited: ${email}` : 'Invite is valid.');
      } catch {
        if (!cancelled) setPreviewError('Could not validate invite link.');
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = acceptInviteFormSchema.safeParse({
      token: token.trim(),
      password,

      confirm,
    });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setError(
        fe.token?.[0] ??
          fe.password?.[0] ??
          fe.confirm?.[0] ??
          'Check your input.',
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.acceptInvite), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: parsed.data.token,
          password: parsed.data.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Could not complete signup.',
        );
        return;
      }

      setSuccess(true);
      setTimeout(() => router.replace('/admin/login'), 1500);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold tracking-tight text-[#142218] md:text-3xl">
          Accept invite
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-campton">
          Set your password to finish joining the admin workspace.
        </p>

        {previewLoading ? (
          <p className="mt-6 text-sm text-[#4a5c50] font-campton">
            Checking invite…
          </p>
        ) : null}

        {!previewLoading && previewError ? (
          <p className="mt-6 text-sm text-red-700 font-campton" role="alert">
            {previewError}
          </p>
        ) : null}

        {!previewLoading && previewLabel && !previewError ? (
          <p className="mt-6 text-sm text-[#015B51] font-campton">
            {previewLabel}
          </p>
        ) : null}

        {success ? (
          <p className="mt-6 text-sm text-[#015B51] font-campton" role="status">
            Account ready. Redirecting to sign in…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            {!tokenFromUrl ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="invite-token" className={labelClassName}>
                  Invite token
                </label>
                <input
                  id="invite-token"
                  name="token"
                  type="text"
                  autoComplete="off"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={busy}
                  className={inputClassName}
                  placeholder="Paste token from email if not in URL"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <label htmlFor="accept-password" className={labelClassName}>
                Password
              </label>
              <input
                id="accept-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy || !!previewError}
                className={inputClassName}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="accept-confirm" className={labelClassName}>
                Confirm password
              </label>
              <input
                id="accept-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={busy || !!previewError}
                className={inputClassName}
                placeholder="Repeat password"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-700 font-campton" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy || !!previewError || previewLoading}
              className="rounded-xl bg-[#015B51] px-4 py-3 text-base font-medium text-white font-campton disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Create account'}
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-sm font-campton">
          <Link
            href="/admin/login"
            className="text-[#015B51] underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AdminAcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0FFFD] flex items-center justify-center">
          <p className="text-sm text-[#4a5c50] font-campton">Loading…</p>
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
