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

          <div className="mt-8 border-t border-black/6 pt-8 text-left">
            <p className="text-center font-poppins text-sm font-semibold text-[#142218]">
              Start reading on the app while you wait
            </p>
            <p className="mt-2 text-center font-poppins text-sm leading-relaxed text-[#5c6b5f]">
              Download Emprinte Readers Hub on your phone — explore books and your library
              while we follow up on your application.
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3">
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#142218] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#0f1a14]"
              >
                Get it on Google Play
              </a>
              {appStoreUrl ? (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border-2 border-[#142218]/14 bg-white px-5 font-poppins text-sm font-semibold text-[#142218] transition hover:border-[#005D51]/35 hover:bg-[#fafcfb]"
                >
                  Download on the App Store
                </a>
              ) : (
                <div className="w-full rounded-2xl border border-[#142218]/10 bg-[#f6faf8] px-4 py-4 sm:px-5 sm:py-4">
                  <p className="font-poppins text-sm font-semibold text-[#142218]">
                    App Store (iPhone &amp; iPad)
                  </p>
                  <p className="mt-2 font-poppins text-xs leading-relaxed text-[#5c6b5f] sm:text-sm">
                    A direct App Store link will appear here soon. Until then, open the App
                    Store and search for{' '}
                    <span className="font-semibold text-[#142218]">Emprinte Readers Hub</span>.
                  </p>
                </div>
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
