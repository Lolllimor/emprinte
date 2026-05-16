import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BootcampRegistrationWizard } from '@/components/bootcamp/BootcampRegistrationWizard';
import { Logo } from '@/components/ui/Logo';
import { pageCopyFromBootcamp } from '@/constants/bootcamp-registration';
import {
  bootcampRegistrationOpen,
  fetchBootcampById,
} from '@/lib/landing-bootcamps-db';

type PageProps = {
  searchParams: Promise<{ bootcampId?: string }>;
};

/** Bootcamp sign-up for non-members happens on the web; app members request in-app. */
export default async function BootcampRegisterPage({ searchParams }: PageProps) {
  const { bootcampId: idParam } = await searchParams;
  const bootcampId = idParam?.trim();
  if (!bootcampId) {
    notFound();
  }

  const bootcamp = await fetchBootcampById(bootcampId);
  if (!bootcamp || !bootcampRegistrationOpen(bootcamp.status)) {
    notFound();
  }

  const pageCopy = pageCopyFromBootcamp(bootcamp);

  return (
    <main className="min-h-screen px-4 pb-28 pt-6 md:pb-32 md:pt-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 inline-flex" aria-label="Emprinte home">
            <Logo />
          </Link>
          <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.18em] text-[#005D51]/85 sm:text-xs sm:tracking-[0.2em]">
            {pageCopy.kicker}
          </p>
          <h1 className="mt-2 font-lora text-2xl font-semibold leading-tight text-[#142218] md:text-3xl">
            {pageCopy.title}
          </h1>
        </header>

        <BootcampRegistrationWizard bootcamp={bootcamp} pageCopy={pageCopy} />
      </div>
    </main>
  );
}
