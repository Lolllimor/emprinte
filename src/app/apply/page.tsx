import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const steps = [
  { label: 'Account', detail: 'Email or Google' },
  { label: 'About You', detail: 'Contact & background' },
  { label: 'Membership', detail: 'Choose a plan' },
  { label: 'Reading', detail: 'Habits & interests' },
  { label: 'Commitment', detail: 'Goals & photo' },
  { label: 'Fee & Send', detail: 'Receipt & submit' },
];

export default async function ApplyLandingPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <main className="min-h-screen px-4 pb-16 pt-8 md:pt-12">
      <div className="mx-auto max-w-lg md:max-w-2xl">
        <header className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 inline-flex" aria-label="Emprinte home">
            <Logo />
          </Link>
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-[#005D51]/80">
            Membership application
          </p>
          <h1 className="mt-3 font-lora text-3xl font-semibold leading-tight tracking-tight text-[#142218] md:text-[2.25rem]">
            Join Emprinte Readers Hub
          </h1>
          <p className="mt-4 max-w-md font-poppins text-[15px] leading-relaxed text-[#4a5c50]">
            A paid reading community built around growth, accountability, and African
            voices. Start here—we will guide you through a short application.
          </p>
        </header>

        {user ? (
          <div className="mb-8 rounded-2xl border border-[#005D51]/20 bg-white px-5 py-4 text-left">
            <p className="font-poppins text-sm font-medium text-[#142218]">
              You&apos;re signed in
            </p>
            <p className="mt-1 font-poppins text-sm leading-relaxed text-[#4a5c50]">
              Continue where you left off. You can still review the steps below before
              you start the form.
            </p>
          </div>
        ) : null}

        <section
          aria-labelledby="apply-steps-heading"
          className="mb-10 rounded-2xl border border-black/[0.06] bg-white p-6 md:p-8"
        >
          <h2
            id="apply-steps-heading"
            className="font-lora text-lg font-semibold text-[#142218]"
          >
            How it works
          </h2>
          <ol className="mt-5 space-y-4">
            {steps.map((s, i) => (
              <li key={s.label} className="flex gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005D51] font-poppins text-sm font-semibold text-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-poppins text-sm font-semibold text-[#142218]">
                    {s.label}
                  </p>
                  <p className="mt-0.5 font-poppins text-sm leading-snug text-[#4a5c50]">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10 rounded-2xl border border-black/[0.06] bg-white p-6 md:p-8">
          <h2 className="font-lora text-lg font-semibold text-[#142218]">
            Before you begin
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 font-poppins text-sm leading-relaxed text-[#4a5c50] marker:text-[#005D51]">
            <li>
              There is a <strong className="text-[#142218]">₦3,000</strong> application
              fee. You&apos;ll upload proof of payment on the last step.
            </li>
            <li>
              Applying does not guarantee a seat—we admit in cycles and may use a
              waitlist.
            </li>
            <li>
              Shortlisted applicants are invited to a conversation with our team before
              membership is confirmed.
            </li>
          </ul>
          <div className="mt-6 rounded-xl border border-[#005D51]/10 bg-white px-4 py-3">
            <p className="font-poppins text-xs leading-relaxed text-[#4a5c50]">
              <span className="font-semibold text-[#142218]">Privacy.</span> We use your
              account email and your answers only for admissions and Emprinte-related
              updates. We do not sell your data.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          {user ? (
            <Link
              href="/apply/form"
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-[#005D51] px-8 font-poppins text-base font-semibold text-white transition hover:bg-[#004438] sm:flex-initial sm:min-w-[220px]"
            >
              Continue application
            </Link>
          ) : (
            <Link
              href="/apply/sign-up?next=/apply/form"
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-[#005D51] px-8 font-poppins text-base font-semibold text-white transition hover:bg-[#004438] sm:flex-initial sm:min-w-[220px]"
            >
              Sign up to apply
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border-2 border-[#005D51]/20 bg-white px-8 font-poppins text-base font-medium text-[#005D51] transition hover:border-[#005D51]/35 hover:bg-white sm:flex-initial sm:min-w-[180px]"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
