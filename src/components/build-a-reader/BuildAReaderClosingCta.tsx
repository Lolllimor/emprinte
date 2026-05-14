'use client';

import { toast } from 'sonner';

const PROJECTS_EMAIL = 'projects@emprintereaders.com';

const mailtoHref = `mailto:${PROJECTS_EMAIL}?subject=${encodeURIComponent(
  'Partnership inquiry — #BuildAReader',
)}&body=${encodeURIComponent(
  'Hi Emprinte team,\n\nWe would like to discuss sponsoring #BuildAReader.\n\n',
)}`;

export function BuildAReaderClosingCta() {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROJECTS_EMAIL);
      toast.success('Email address copied');
    } catch {
      toast.error('Could not copy — you can select the address in your mail app');
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#005D51]/20 bg-linear-to-br from-[#142218] via-[#183226] to-[#0d1812] text-white"
      role="region"
      aria-labelledby="bar-closing-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#005D51]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#E63715]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14">
        <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          After the deck
        </p>
        <h2
          id="bar-closing-heading"
          className="mt-3 max-w-xl font-lora text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-[2rem] md:leading-[1.15]"
        >
          Pick up the thread right here
        </h2>
        <p className="mt-4 max-w-lg font-poppins text-[15px] leading-relaxed text-white/78 sm:text-base">
          You already made it through Emprinte—no new tab required. One note to{' '}
          <span className="font-medium text-white/95">{PROJECTS_EMAIL}</span> is enough for the
          team to route sponsorship, tiers, and school visits.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href={mailtoHref}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#E63715] px-6 py-3.5 text-center font-poppins text-[15px] font-semibold text-white transition hover:bg-[#cf3212] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Write to projects@emprintereaders.com
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 font-poppins text-[15px] font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Copy email address
          </button>
        </div>
      </div>
    </div>
  );
}
