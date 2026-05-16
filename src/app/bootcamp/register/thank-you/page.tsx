import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Logo } from '@/components/ui/Logo';
import { BOOTCAMP_THANK_YOU_COPY } from '@/constants/bootcamp-registration';
import { fetchBootcampById } from '@/lib/landing-bootcamps-db';

type PageProps = {
  searchParams: Promise<{ bootcampId?: string }>;
};

export default async function BootcampThankYouPage({ searchParams }: PageProps) {
  const { bootcampId: idParam } = await searchParams;
  const bootcampId = idParam?.trim();
  if (!bootcampId) {
    notFound();
  }

  const bootcamp = await fetchBootcampById(bootcampId);
  if (!bootcamp) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-10 md:flex md:items-center md:justify-center md:py-16">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <Link href="/" className="mb-8 inline-flex" aria-label="Emprinte home">
          <Logo />
        </Link>

        <div className="w-full rounded-2xl border border-black/6 bg-white p-8 md:p-10">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#005D51]/15 bg-[#eef7f4] text-3xl text-[#005D51]"
            aria-hidden
          >
            ✓
          </div>
          <h1 className="font-lora text-2xl font-semibold leading-tight text-[#142218] md:text-3xl">
            {BOOTCAMP_THANK_YOU_COPY.title}
          </h1>
          <p className="mt-4 font-poppins text-[15px] leading-relaxed text-[#4a5c50]">
            {BOOTCAMP_THANK_YOU_COPY.body}
          </p>
          <p className="mt-2 font-poppins text-sm text-[#5c6b5f]">{bootcamp.title}</p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-[#142218]/10 bg-white px-8 font-poppins text-sm font-semibold text-[#142218] transition hover:border-[#005D51]/25"
        >
          {BOOTCAMP_THANK_YOU_COPY.cta}
        </Link>
      </div>
    </main>
  );
}
