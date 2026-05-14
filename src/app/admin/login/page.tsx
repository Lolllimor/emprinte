'use client';

import { Suspense, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const inputClassName =
  'w-full rounded-xl border border-[#005D51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-poppins transition-[box-shadow,border-color] focus:border-[#005D51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-poppins';

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = searchParams.get('error');
    if (q === 'not_allowed') {
        setError(
        'Your account is signed in but cannot use this admin. App admins need role admin on their user (same as the mobile app). Otherwise ask an owner to set landing_admin in App metadata, or add your email to LANDING_ADMIN_EMAILS on the server.',
      );
    } else if (q === 'auth') {
      setError('That sign-in link was invalid or expired. Try again.');
    }
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!supabaseConfigured()) {
      setError(
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signError) {
        setError(signError.message || 'Could not sign in.');
        return;
      }

      const next = searchParams.get('next')?.trim();
      router.replace(next && next.startsWith('/') ? next : '/admin');
    } catch {
      setError('Something went wrong. Try again.');
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
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-poppins">
          Use the same Supabase account as the app. If you are already an app admin
          (role <span className="font-medium text-[#142218]">admin</span> on your
          user), you can sign in here too. Otherwise ask an owner to set that role,
          or <span className="font-medium text-[#142218]">landing_admin</span> in App
          metadata for landing-only access.
        </p>

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
              className="text-sm text-red-700 font-poppins leading-snug"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#005D51] px-4 py-3 text-base font-medium text-white font-poppins transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-poppins">
          <Link
            href="/admin/forgot-password"
            className="text-[#005D51] underline underline-offset-2 hover:no-underline"
          >
            Forgot password?
          </Link>
        </p>

        <p className="mt-8 text-center text-sm font-poppins">
          <Link
            href="/"
            className="text-[#005D51] underline underline-offset-2 hover:no-underline"
          >
            Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F0FFFD] flex items-center justify-center px-6">
          <p className="font-poppins text-sm text-[#4a5c50]">Loading…</p>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
