'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { forgotPasswordEmailSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full rounded-xl border border-[#005D51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-poppins transition-[box-shadow,border-color] focus:border-[#005D51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-poppins';

function originForRedirect(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const parsed = forgotPasswordEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.flatten().fieldErrors.email?.[0] ?? 'Check your email.',
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${originForRedirect()}/admin/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        parsed.data.email.trim(),
        { redirectTo },
      );

      if (resetError) {
        setError(resetError.message || 'Could not start reset.');
        return;
      }

      setInfo('If an account exists for that email, we sent a reset link. Check your inbox.');
      setEmail('');
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
          Reset password
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-poppins">
          We will email you a link to choose a new password. Add this site URL and
          /admin/update-password to your Supabase Auth redirect allow list if you
          have not already.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="forgot-email" className={labelClassName}>
              Email
            </label>
            <input
              id="forgot-email"
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
            <p className="text-sm text-red-700 font-poppins" role="alert">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="text-sm font-medium text-[#005D51] font-poppins" role="status">
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#005D51] px-4 py-3 text-base font-medium text-white font-poppins transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-poppins">
          <Link
            href="/admin/login"
            className="text-[#005D51] underline underline-offset-2 hover:no-underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
