import Link from 'next/link';
import { Suspense } from 'react';

import { ApplySignUpSecondary } from '@/components/apply/ApplySignUpSecondary';
import { Logo } from '@/components/ui/Logo';

import { ApplySignUpClient } from './ApplySignUpClient';

export default function ApplySignUpPage() {
  return (
    <main className="min-h-screen px-4 pb-12 pt-6 md:flex md:items-center md:justify-center md:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-5 md:max-w-lg">
        <header className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex origin-center scale-[0.92] md:scale-95"
            aria-label="Emprinte home"
          >
            <Logo />
          </Link>
          <p className="mt-3 font-poppins text-[10px] font-semibold uppercase tracking-[0.18em] text-[#005D51]/85 sm:text-xs sm:tracking-[0.2em]">
            Membership application
          </p>
          <h1 className="mt-2 font-lora text-2xl font-semibold leading-tight tracking-tight text-[#142218] sm:text-3xl sm:leading-tight">
            Join Emprinte Readers Hub
          </h1>
          <p className="mt-2 max-w-sm font-poppins text-sm leading-snug text-[#4a5c50] sm:mt-2.5 sm:max-w-none sm:text-[15px] sm:leading-relaxed">
            Growth, accountability, and African voices — start with your email below.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="rounded-2xl border-2 border-[#005D51]/15 bg-[#FAFCFB] p-1">
              <div className="rounded-xl border border-black/6 bg-white p-8 text-center font-poppins text-sm text-[#4a5c50]">
                Loading…
              </div>
            </div>
          }
        >
          <ApplySignUpClient />
        </Suspense>

        <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

        <ApplySignUpSecondary />
      </div>
    </main>
  );
}
