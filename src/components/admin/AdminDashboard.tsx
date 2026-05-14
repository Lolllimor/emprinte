'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { AdminDashboardProps, DashboardTile, Snapshot } from '@/types';
import { getApiUrl } from '@/lib/api';

function StatSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="h-3 w-16 max-w-full rounded bg-[#005D51]/12" />
      <div className="h-9 w-24 max-w-[80%] animate-pulse rounded-md bg-[#005D51]/12" />
      <div className="h-4 w-32 max-w-full rounded bg-[#005D51]/08" />
    </div>
  );
}

export function AdminDashboard({ refreshKey, onManage }: AdminDashboardProps) {
  const [snap, setSnap] = useState<Snapshot>({
    booksCollected: null,
    testimonialCount: 0,
    contactEmail: null,
    totalBooks: null,
    insightCount: 0,
    loading: true,
    error: null,
  });
  const [loadRetry, setLoadRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [insRes, testRes, barRes, setRes] = await Promise.all([
          fetch(getApiUrl('insights')),
          fetch(getApiUrl('testimonials')),
          fetch(getApiUrl('build-a-reader')),
          fetch(getApiUrl('settings')),
        ]);

        const [ins, test, bar, set] = await Promise.all([
          insRes.json(),
          testRes.json(),
          barRes.json(),
          setRes.json(),
        ]);

        if (cancelled) return;

        setSnap({
          insightCount: Array.isArray(ins) ? ins.length : 0,
          testimonialCount: Array.isArray(test) ? test.length : 0,
          booksCollected: typeof bar?.booksCollected === 'number' ? bar.booksCollected : null,
          totalBooks: typeof bar?.totalBooks === 'number' ? bar.totalBooks : null,
          contactEmail: typeof set?.contactInfo?.email === 'string' ? set.contactInfo.email : null,
          loading: false,
          error: null,
        });
      } catch {
        if (!cancelled) {
          setSnap((s) => ({
            ...s,
            loading: false,
            error:
              'We could not load this overview. Check your connection or try again in a moment.',
          }));
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, loadRetry]);

  const tiles: DashboardTile[] = [
    {
      key: 'blog',
      href: '/admin/blog',
      title: 'Blog',
      blurb: 'Stories and updates on /blog and anywhere they are featured.',
      statLabel: 'Articles',
      highlight: snap.loading ? '' : String(snap.insightCount),
      detail: snap.loading
        ? null
        : snap.insightCount === 0
          ? 'No articles yet — add your first one.'
          : snap.insightCount === 1
            ? 'article live'
            : 'articles live',
    },
    {
      key: 'buildAReader',
      manage: 'buildAReader',
      title: 'Build a Reader',
      blurb: 'Book drive progress, goal, and donation amount visitors see.',
      statLabel: 'Books collected',
      highlight:
        snap.loading || snap.booksCollected == null || snap.totalBooks == null
          ? ''
          : String(snap.booksCollected),
      detail:
        snap.loading || snap.booksCollected == null || snap.totalBooks == null
          ? null
          : `of ${snap.totalBooks} toward your goal`,
    },
    {
      key: 'testimonials',
      manage: 'testimonials',
      title: 'Testimonials',
      blurb: 'Reader quotes shown on the homepage.',
      statLabel: 'Quotes',
      highlight: snap.loading ? '' : String(snap.testimonialCount),
      detail: snap.loading
        ? null
        : snap.testimonialCount === 0
          ? 'None yet — add quotes when you are ready.'
          : snap.testimonialCount === 1
            ? 'quote on the site'
            : 'quotes on the site',
    },
    {
      key: 'settings',
      manage: 'settings',
      title: 'Site details',
      blurb: 'Navigation, footer, contact info, social links, and headline numbers.',
      statLabel: 'Primary email',
      highlight: snap.loading
        ? ''
        : snap.contactEmail
          ? snap.contactEmail.length > 36
            ? `${snap.contactEmail.slice(0, 34)}…`
            : snap.contactEmail
          : 'Not set',
      detail: snap.loading
        ? null
        : snap.contactEmail
          ? 'Shown to visitors'
          : 'Add email, links, and stats',
    },
  ];

  return (
    <div className="space-y-12">
      <AdminPageSection
        id="site-overview"
        eyebrow="Site overview"
        title="Manage what appears on your public site"
        description={
          <>
            Each tile opens an editor here, except{' '}
            <Link
              href="/admin/blog"
              className="font-medium text-[#005D51] underline decoration-[#005D51]/30 underline-offset-[3px] hover:text-[#004438] hover:decoration-[#005D51]"
            >
              Blog
            </Link>
            , which has its own page in the sidebar. Saving updates the live
            site. For newsletter signups and CSV export, go to{' '}
            <Link
              href="/admin/newsletter"
              className="font-medium text-[#005D51] underline decoration-[#005D51]/30 underline-offset-[3px] hover:text-[#004438] hover:decoration-[#005D51]"
            >
              Newsletter subscribers
            </Link>
            .
          </>
        }
      />

      {snap.error ? (
        <div
          className="flex flex-col gap-4 rounded-2xl border border-red-200/80 bg-red-50/90 px-5 py-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="min-w-0">{snap.error}</p>
          <button
            type="button"
            onClick={() => {
              setSnap((s) => ({ ...s, loading: true, error: null }));
              setLoadRetry((n) => n + 1);
            }}
            className="shrink-0 rounded-lg border border-red-300/80 bg-white px-4 py-2 text-sm font-medium text-red-950 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      ) : null}

      <section className="scroll-mt-4">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {tiles.map((t) => {
            const tileClassName =
              'group flex min-h-[280px] w-full flex-col rounded-2xl border border-[#005D51]/12 bg-white p-6 text-left shadow-[0_1px_2px_rgba(20,34,24,0.04)] transition duration-200 hover:border-[#005D51]/30 hover:shadow-[0_10px_32px_rgba(0,93,81,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005D51]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0FFFD] sm:min-h-[300px] md:p-7';

            const body = (
              <>
                <span
                  className="mb-4 block h-0.5 w-10 rounded-full bg-[#005D51]/35 transition group-hover:w-14 group-hover:bg-[#005D51]/55"
                  aria-hidden
                />

                <h3 className="font-lora text-lg font-semibold text-[#005D51]">
                  {t.title}
                </h3>
                <p className="mt-2 font-poppins text-sm font-medium leading-relaxed text-[#7B7B7B]">
                  {t.blurb}
                </p>

                <div className="mt-6 flex min-h-[14] flex-1 flex-col justify-end border-t border-[#142218]/08 pt-5">
                  {snap.loading ? (
                    <StatSkeleton />
                  ) : (
                    <>
                      <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.12em] text-[#005D51]/80">
                        {t.statLabel}
                      </p>
                      <p className="mt-1.5 font-poppins text-xl font-bold tabular-nums tracking-tight text-[#142218] wrap-anywhere">
                        {t.highlight}
                      </p>
                      {t.detail ? (
                        <p className="mt-1 font-poppins text-sm font-medium leading-snug text-[#7B7B7B]">
                          {t.detail}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>

                <span className="mt-5 inline-flex items-center font-poppins text-sm font-medium text-[#005D51] transition group-hover:text-[#004438]">
                  {'href' in t ? 'Open blog' : 'Open editor'}
                  <span
                    className="ml-1 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </>
            );

            return (
              <li key={t.key} className="flex">
                {'href' in t ? (
                  <Link
                    href={t.href}
                    className={tileClassName}
                    aria-label={`Open blog: ${t.title}`}
                  >
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => onManage(t.manage)}
                    className={tileClassName}
                    aria-label={`Open editor: ${t.title}`}
                  >
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
