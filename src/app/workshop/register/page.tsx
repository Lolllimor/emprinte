import Link from 'next/link';

import { WorkshopRegistrationWizard } from '@/components/workshop/WorkshopRegistrationWizard';
import { WORKSHOP_PAGE_COPY } from '@/constants/workshop-registration';
import { Logo } from '@/components/ui/Logo';

export default function WorkshopRegisterPage() {
  return (
    <main className="min-h-screen px-4 pb-28 pt-6 md:pb-32 md:pt-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 inline-flex" aria-label="Emprinte home">
            <Logo />
          </Link>
          <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.18em] text-[#005D51]/85 sm:text-xs sm:tracking-[0.2em]">
            {WORKSHOP_PAGE_COPY.kicker}
          </p>
          <h1 className="mt-2 font-lora text-2xl font-semibold leading-tight text-[#142218] md:text-3xl">
            {WORKSHOP_PAGE_COPY.title}
          </h1>
          <p className="mx-auto mt-2 max-w-md font-poppins text-sm leading-relaxed text-[#4a5c50]">
            {WORKSHOP_PAGE_COPY.lead}
          </p>
        </header>

        <WorkshopRegistrationWizard />
      </div>
    </main>
  );
}
