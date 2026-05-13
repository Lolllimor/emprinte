import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';

export default function ApplyThankYouPage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-10 md:flex md:items-center md:justify-center md:py-16">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-black/[0.04] transition hover:bg-white"
          aria-label="Emprinte home"
        >
          <Logo />
        </Link>

        <div className="w-full rounded-2xl border border-black/[0.06] bg-white/95 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] ring-1 ring-white/80 backdrop-blur-sm md:p-10">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FFFD] text-3xl ring-2 ring-[#005D51]/15"
            aria-hidden
          >
            ✓
          </div>
          <h1 className="font-lora text-2xl font-semibold leading-tight text-[#142218] md:text-3xl">
            We received your application
          </h1>
          <p className="mt-4 font-poppins text-[15px] leading-relaxed text-[#4a5c50]">
            Admissions run in cycles. Your answers are saved for the next intake. Our
            operations team will review everything and contact you within{' '}
            <strong className="font-semibold text-[#142218]">five working days</strong>{' '}
            using the email on your account.
          </p>
          <p className="mt-6 font-poppins text-sm font-medium text-[#142218]">
            With care,
            <br />
            Emprinte Readers Hub
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#005D51] px-8 font-poppins text-sm font-semibold text-white shadow-md transition hover:bg-[#004438]"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
