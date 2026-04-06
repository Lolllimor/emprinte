'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import {
  AUTH_API,
  SESSION_PW_RESET_EMAIL_KEY,
  SESSION_PW_RESET_TOKEN_KEY,
} from '@/constants/auth-api';
import { getApiUrl, isBackendApiConfigured } from '@/lib/api';
import { resetPasswordFormSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-campton transition-[box-shadow,border-color] focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-campton';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isBackendApiConfigured()) return;
    try {
      const t = sessionStorage.getItem(SESSION_PW_RESET_TOKEN_KEY);
      if (t) return;
    } catch {
      /* */
    }
    router.replace('/admin/forgot-password');
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordFormSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setError(
        fe.password?.[0] ?? fe.confirm?.[0] ?? 'Check your new password.',
      );
      return;
    }

    let resetToken: string | null = null;
    try {
      resetToken = sessionStorage.getItem(SESSION_PW_RESET_TOKEN_KEY);
    } catch {
      /* */
    }

    if (!resetToken) {
      setError('Session expired. Start again from forgot password.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.resetPassword), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          password: parsed.data.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Could not update password.',
        );
        return;
      }

      try {
        sessionStorage.removeItem(SESSION_PW_RESET_TOKEN_KEY);
        sessionStorage.removeItem(SESSION_PW_RESET_EMAIL_KEY);
      } catch {
        /* */
      }

      router.replace('/admin/login');
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
          New password
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-campton">
          Choose a new password. Your API stores it and you will use it on the
          sign-in page.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="new-password" className={labelClassName}>
              New password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className={inputClassName}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className={labelClassName}>
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={busy}
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
            disabled={busy}
            className="rounded-xl bg-[#015B51] px-4 py-3 text-base font-medium text-white font-campton disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save password'}
          </button>
        </form>

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
