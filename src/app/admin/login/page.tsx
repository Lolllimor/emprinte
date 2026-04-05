'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AUTH_API, jwtFromLoginResponse } from '@/constants/auth-api';
import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import {
  isBackendApiConfigured,
  setStoredEditToken,
  getApiUrl,
} from '@/lib/api';

const inputClassName =
  'w-full rounded-xl border border-[#015B51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-campton transition-[box-shadow,border-color] focus:border-[#015B51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-campton';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);



  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isBackendApiConfigured()) {
      setError(
        'Set NEXT_PUBLIC_API_URL in .env to your API server (login returns a JWT).',
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getApiUrl(AUTH_API.login), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const jwt = jwtFromLoginResponse(data);
        if (jwt) {
          setStoredEditToken(jwt);
          try {
            localStorage.removeItem('admin_token');
          } catch {
            /* */
          }
          router.replace('/admin');
          return;
        }
      }

      if (res.status === 401) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : 'Invalid email or password.',
        );
        return;
      }

      setError(
        typeof data?.error === 'string'
          ? data.error
          : 'Could not sign in. Try again.',
      );
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold tracking-tight text-[#142218] md:text-3xl">
          Admin sign in
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-campton">
          Enter your email and password. The API returns a JWT stored for this
          session for admin requests.
        </p>

        {!isBackendApiConfigured() ? (
          <p
            className="mt-4 text-sm text-amber-900/90 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 font-campton leading-snug"
            role="status"
          >
            Set <code className="text-[13px]">NEXT_PUBLIC_API_URL</code> to your
            backend.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className={labelClassName}>
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className={labelClassName}>
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className={inputClassName}
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p
              className="text-sm text-red-700 font-campton leading-snug"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#015B51] px-4 py-3 text-base font-medium text-white font-campton transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-campton">
          <Link
            href="/admin/forgot-password"
            className="text-[#015B51] underline underline-offset-2 hover:no-underline"
          >
            Forgot password?
          </Link>
        </p>

        <p className="mt-8 text-center text-sm font-campton">
          <Link
            href="/"
            className="text-[#015B51] underline underline-offset-2 hover:no-underline"
          >
            Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
