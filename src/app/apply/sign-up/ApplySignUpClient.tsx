'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { safeApplicantAuthRedirectPath } from '@/lib/apply-auth-redirect';
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from '@/lib/supabase/client';

const inputClass =
  'w-full rounded-xl border border-[#142218]/12 bg-white px-4 py-3.5 text-base text-[#142218] outline-none font-poppins transition placeholder:text-[#9aa89e] focus:border-[#005D51] focus:ring-[3px] focus:ring-[#6FE19B]/35 disabled:opacity-60';

const labelClass =
  'text-xs font-semibold uppercase tracking-[0.12em] text-[#4a5c50] font-poppins';

export function ApplySignUpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeApplicantAuthRedirectPath(searchParams.get('next'));
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  function stripErrorQueryFromUrl() {
    if (!searchParams.has('error')) return;
    const q = new URLSearchParams();
    q.set('next', next);
    router.replace(`/apply/sign-up?${q.toString()}`);
  }

  function clearErrorAndStaleAuthUrl() {
    setError(null);
    stripErrorQueryFromUrl();
  }

  useEffect(() => {
    const q = searchParams.get('error');
    if (q === 'auth') {
      setError('That link expired or was already used. Request a new one below.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!cancelled && session) {
          router.replace(next);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, next]);

  function authRedirectUrl(): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = `/auth/callback?next=${encodeURIComponent(next)}`;
    return `${origin}${path}`;
  }

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    clearErrorAndStaleAuthUrl();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter the email you want to use for this application.');
      return;
    }

    if (!isSupabaseBrowserConfigured()) {
      setError(
        'This environment is missing Supabase settings. For local testing, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local in the emprinte folder, then restart npm run dev.',
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: authRedirectUrl(),
        },
      });
      if (otpError) {
        setError(otpError.message || 'We could not send the link. Try again.');
        return;
      }
      setMagicSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg.includes('Missing NEXT_PUBLIC_SUPABASE')
          ? 'Supabase is not configured in this build. Check .env.local and restart the dev server.'
          : msg || 'Something went wrong. Try again in a moment.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    clearErrorAndStaleAuthUrl();
    if (!isSupabaseBrowserConfigured()) {
      setError(
        'This environment is missing Supabase settings. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.',
      );
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: authRedirectUrl(),
        },
      });
      if (oAuthError) {
        setError(oAuthError.message || 'Google did not open. Try the email link instead.');
        setBusy(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg.includes('Missing NEXT_PUBLIC_SUPABASE')
          ? 'Supabase is not configured in this build. Check .env.local and restart the dev server.'
          : msg || 'Something went wrong. Try again in a moment.',
      );
      setBusy(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border-2 border-[#005D51]/18 bg-linear-to-b from-[#eef7f4] to-[#e2f0eb] p-[3px] shadow-[0_8px_30px_rgba(0,93,81,0.06)]">
        <div className="rounded-[calc(1rem-2px)] border border-black/6 bg-white p-6 md:p-8">
        {magicSent ? (
          <div className="text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#005D51]/15 bg-white text-2xl"
              aria-hidden
            >
              ✉️
            </div>
            <h2 className="font-lora text-xl font-semibold text-[#142218]">Check your inbox</h2>
            <p className="mt-3 font-poppins text-sm leading-relaxed text-[#4a5c50]">
              Open the link we sent to{' '}
              <span className="font-semibold text-[#142218]">{email.trim()}</span> on this device.
              It expires after a while.
            </p>
            <button
              type="button"
              className="mt-6 font-poppins text-sm font-semibold text-[#005D51] underline decoration-[#005D51]/30 underline-offset-4 hover:decoration-[#005D51]"
              onClick={() => {
                setMagicSent(false);
                clearErrorAndStaleAuthUrl();
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center md:text-left">
              <h2 className="font-lora text-2xl font-semibold leading-tight tracking-tight text-[#142218] sm:text-[1.65rem]">
                Start your application
              </h2>
              <p className="mt-2 font-poppins text-sm leading-snug text-[#5c6b5f] sm:text-[15px] sm:leading-relaxed">
                Use email or Google — we&apos;ll bring you back here after you sign in.
              </p>
            </div>
            <form onSubmit={sendMagicLink} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="apply-email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrorAndStaleAuthUrl();
                  }}
                  onFocus={clearErrorAndStaleAuthUrl}
                  disabled={busy}
                  className={inputClass}
                  placeholder="you@example.com"
                />
                <p className="font-poppins text-xs leading-snug text-[#7B7B7B]">
                  Used for this application and Emprinte updates only.
                </p>
              </div>
              {error ? (
                <div
                  className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                  role="alert"
                >
                  <p className="font-poppins text-sm leading-snug text-red-800">{error}</p>
                  <button
                    type="button"
                    onClick={clearErrorAndStaleAuthUrl}
                    className="shrink-0 self-end font-poppins text-xs font-semibold text-red-900 underline decoration-red-300 underline-offset-2 hover:decoration-red-800 sm:self-start"
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="min-h-[52px] w-full rounded-2xl bg-[#005D51] font-poppins text-base font-semibold text-white transition hover:bg-[#004438] disabled:opacity-55"
              >
                {busy ? 'Sending link…' : 'Email me a secure link'}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
              <span className="shrink-0 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa89e]">
                or
              </span>
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#142218]/10 bg-white font-poppins text-base font-semibold text-[#142218] transition hover:border-[#005D51]/25 hover:bg-white disabled:opacity-55"
            >
              <span className="text-lg" aria-hidden>
                G
              </span>
              Continue with Google
            </button>

            <p className="mt-6 text-center font-poppins text-xs text-[#7B7B7B]">
              Returning? Same email or Google — we&apos;ll open your form.
            </p>
          </>
        )}
        </div>
      </div>

      <p className="text-center font-poppins text-sm">
        <Link
          href="/"
          className="font-semibold text-[#005D51] underline decoration-[#005D51]/25 underline-offset-[5px] transition hover:decoration-[#005D51]"
        >
          Back to homepage
        </Link>
      </p>
    </>
  );
}
