import Link from 'next/link';

import { readersHubAppStoreUrl, readersHubPlayStoreUrl } from '@/constants/readers-hub-stores';
import { Logo } from '@/components/ui/Logo';

export default function ApplyThankYouPage() {
  const playUrl = readersHubPlayStoreUrl();
  const appStoreUrl = readersHubAppStoreUrl();

  return (
    <main className="min-h-screen px-4 pb-16 pt-10 md:flex md:items-center md:justify-center md:py-16">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <Link href="/" className="mb-8 inline-flex" aria-label="Emprinte home">
          <Logo />
        </Link>

        <div className="w-full rounded-2xl border border-black/6 bg-white p-8 md:p-10">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#005D51]/15 bg-white text-3xl"
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

          <div className="mt-8 border-t border-black/6 pt-8">
            <p className="font-poppins text-sm font-semibold text-[#142218]">
              Start reading on the app while you wait
            </p>
            <p className="mt-2 font-poppins text-sm leading-relaxed text-[#5c6b5f]">
              Download Emprinte Readers Hub on your phone — explore books and your library
              while we follow up on your application.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-[#142218] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#0f1a14] sm:max-w-[220px]"
              >
                Google Play
              </a>
              {appStoreUrl ? (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border-2 border-[#142218]/12 bg-white px-5 font-poppins text-sm font-semibold text-[#142218] transition hover:border-[#005D51]/35 sm:max-w-[220px]"
                >
                  App Store
                </a>
              ) : (
                <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#142218]/15 bg-[#fafcfb] px-4 py-3 font-poppins text-xs leading-snug text-[#5c6b5f] sm:max-w-[220px]">
                  App Store link: add{' '}
                  <code className="mx-1 rounded bg-[#142218]/08 px-1 py-0.5 text-[11px]">
                    NEXT_PUBLIC_READERS_HUB_APP_STORE_URL
                  </code>{' '}
                  in hosting env, then redeploy.
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#005D51] px-8 font-poppins text-sm font-semibold text-white transition hover:bg-[#004438]"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
