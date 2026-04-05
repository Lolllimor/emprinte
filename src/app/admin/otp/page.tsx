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
import { verifyOtpSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] text-center tracking-[0.35em] font-campton outline-none transition-[box-shadow,border-color] focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-campton';

export default function AdminOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    if (!isBackendApiConfigured()) return;
    try {
      const stored = sessionStorage.getItem(SESSION_PW_RESET_EMAIL_KEY)?.trim();
      if (stored) {
        setEmail(stored);
        return;
      }
    } catch {
      /* */
    }
    router.replace('/admin/forgot-password');
  }, [router]);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const t = setTimeout(() => setCooldownSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldownSec]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = verifyOtpSchema.safeParse({ email, code });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setError(fe.code?.[0] ?? fe.email?.[0] ?? 'Check the code.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.verifyOtp), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parsed.data.email,
          code: parsed.data.code,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.resetToken === 'string' && data.resetToken) {
        try {
          sessionStorage.setItem(SESSION_PW_RESET_TOKEN_KEY, data.resetToken);
        } catch {
          /* */
        }
        router.replace('/admin/reset-password');
        return;
      }

      setError(
        typeof data?.error === 'string'
          ? data.error
          : 'Invalid or expired code.',
      );
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    if (!email || resendBusy || cooldownSec > 0) return;

    setResendBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.resendOtp), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const sec =
          typeof data.retryAfterSeconds === 'number'
            ? data.retryAfterSeconds
            : 60;
        setCooldownSec(Math.max(1, Math.ceil(sec)));
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Wait before requesting another code.',
        );
        return;
      }

      if (!res.ok) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Could not resend the code.',
        );
        return;
      }

      setCooldownSec(60);
    } catch {
      setError('Network error.');
    } finally {
      setResendBusy(false);
    }
  }

  if (!email && isBackendApiConfigured()) {
    return (
      <div className="min-h-screen bg-[#F0FFFD] flex items-center justify-center">
        <p className="text-sm text-[#4a5c50] font-campton">Loading…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold tracking-tight text-[#142218] md:text-3xl">
          Enter verification code
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-campton">
          We sent a 4-digit code to <strong>{email}</strong>. It expires in 5
          minutes. The code is validated on your API.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="otp-code" className={labelClassName}>
              Code
            </label>
            <input
              id="otp-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              disabled={busy}
              className={inputClassName}
              placeholder="0000"
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
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => void resend()}
            disabled={resendBusy || cooldownSec > 0 || !email}
            className="font-campton text-sm text-[#015B51] underline underline-offset-2 disabled:opacity-50 disabled:no-underline"
          >
            {cooldownSec > 0
              ? `Resend code (${cooldownSec}s)`
              : resendBusy
                ? 'Sending…'
                : 'Resend code'}
          </button>
        </div>

        <p className="mt-10 text-center text-sm font-campton">
          <Link
            href="/admin/login"
            className="text-[#4a5c50] underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
