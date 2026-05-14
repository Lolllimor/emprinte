'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { resetPasswordFormSchema } from '@/lib/validation/auth-reset';

const inputClassName =
  'w-full rounded-xl border border-[#005D51]/25 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-poppins transition-[box-shadow,border-color] focus:border-[#005D51] focus:ring-2 focus:ring-[#6FE19B]/50 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-[#4a5c50] font-poppins';

export default function AdminUpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setReady(true);
          if (!data.session) {
            setError(
              'Open the reset link from your email on this same device and browser, or request a new link.',
            );
          }
        }
      } catch {
        if (!cancelled) {
          setReady(true);
          setError('Supabase is not configured.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: parsed.data.password,
      });
      if (updateError) {
        setError(updateError.message || 'Could not update password.');
        return;
      }
      router.replace('/admin');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold tracking-tight text-[#142218] md:text-3xl">
          Choose a new password
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4a5c50] font-poppins">
          After using the link in your email, set a new password here. Then you
          can open the admin dashboard.
        </p>

        {!ready ? (
          <p className="mt-8 font-poppins text-sm text-[#7B7B7B]">Loading…</p>
        ) : (
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
              />
            </div>

            {error ? (
              <p className="text-sm text-red-700 font-poppins" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#005D51] px-4 py-3 text-base font-medium text-white font-poppins transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save password'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm font-poppins">
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
