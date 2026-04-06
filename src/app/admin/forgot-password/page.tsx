'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { AUTH_API, SESSION_PW_RESET_EMAIL_KEY } from '@/constants/auth-api';
import { getApiUrl, isBackendApiConfigured } from '@/lib/api';
import { forgotPasswordEmailSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-campton transition-[box-shadow,border-color] focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-campton';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isBackendApiConfigured()) {
      setError(
        'Set NEXT_PUBLIC_API_URL to your API server so it can send the reset code.',
      );
      return;
    }

    const parsed = forgotPasswordEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.flatten().fieldErrors.email?.[0] ?? 'Check your email.',
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.forgotPassword), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Could not start reset. Try again later.',
        );
        return;
      }

      try {
        sessionStorage.setItem(
          SESSION_PW_RESET_EMAIL_KEY,
          parsed.data.email.trim().toLowerCase(),
        );
      } catch {
        /* quota */
      }
      router.push('/admin/otp');
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold tracking-tight text-[#142218] md:text-3xl">
          Forgot your password?
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-campton">
          Enter the email for your admin account. Your API will send a 4-digit
          code (valid 5 minutes). Codes are created and checked on the server, not
          in this app.
        </p>

        {!isBackendApiConfigured() ? (
          <p
            className="mt-4 text-sm text-amber-900/90 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 font-campton"
            role="status"
          >
            Set <code className="text-[13px]">NEXT_PUBLIC_API_URL</code> in{' '}
            <code className="text-[13px]">.env</code> to your backend.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="reset-email" className={labelClassName}>
              Email
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              className={inputClassName}
              placeholder="you@example.com"
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
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-4 text-sm font-campton sm:flex-row sm:justify-between">
          <Link
            href="/admin/login"
            className="text-[#015B51] underline underline-offset-2 hover:no-underline"
          >
            ← Back to sign in
          </Link>
          <Link
            href="/"
            className="text-[#4a5c50] underline underline-offset-2 hover:text-[#142218]"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
