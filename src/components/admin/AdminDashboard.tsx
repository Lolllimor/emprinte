'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { AdminDashboardProps, DashboardTile, Snapshot } from '@/types';
import { getSameOriginApiUrl } from '@/lib/api';

function StatSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="h-3 w-20 max-w-full rounded bg-[#005D51]/12" />
      <div className="h-10 w-28 max-w-[90%] animate-pulse rounded-lg bg-[#005D51]/10" />
      <div className="h-3.5 w-full max-w-[85%] rounded bg-[#005D51]/08" />
    </div>
  );
}

const tileAccent: Record<string, string> = {
  blog: 'border-l-[#005D51] from-[#005D51]/[0.06] to-white',
  buildAReader: 'border-l-[#e63715] from-[#e63715]/[0.07] to-white',
  testimonials: 'border-l-[#6b5cff] from-[#6b5cff]/[0.06] to-white',
  settings: 'border-l-[#0d8bd9] from-[#0d8bd9]/[0.06] to-white',
};

function MetricPill({
  label,
  value,
  sub,
  loading,
  footer,
}: {
  label: string;
  value: string;
  sub?: string | null;
  loading: boolean;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-full min-w-0 flex-col rounded-xl border border-[#142218]/08 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(20,34,24,0.04)] sm:px-5 sm:py-3.5">
      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-[#142218]/45">
        {label}
      </p>
      {loading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-[#005D51]/10" />
      ) : (
        <p className="mt-1 truncate font-poppins text-xl font-bold tabular-nums tracking-tight text-[#142218] sm:text-2xl">
          {value}
        </p>
      )}
      {sub && !loading ? (
        <p className="mt-0.5 truncate font-poppins text-xs font-medium text-[#5c6b5f]">{sub}</p>
      ) : null}
      {footer ? <div className="mt-auto min-w-0 pt-3">{footer}</div> : null}
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
          fetch(getSameOriginApiUrl('insights')),
          fetch(getSameOriginApiUrl('testimonials')),
          fetch(getSameOriginApiUrl('build-a-reader')),
          fetch(getSameOriginApiUrl('settings')),
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

  const bookProgressPct =
    !snap.loading &&
    snap.booksCollected != null &&
    snap.totalBooks != null &&
    snap.totalBooks > 0
      ? Math.min(100, Math.round((snap.booksCollected / snap.totalBooks) * 100))
      : null;

  return (
    <div className="space-y-10 md:space-y-12">
      <AdminPageSection
        id="site-overview"
        eyebrow="Site overview"
        title="Manage what appears on your public site"
        description={
          <>
            Control what visitors see on the public site: homepage sections, book drive,
            quotes, and contact details. Editors below open in a panel except{' '}
            <Link
              href="/admin/blog"
              className="font-medium text-[#005D51] underline decoration-[#005D51]/30 underline-offset-[3px] hover:text-[#004438] hover:decoration-[#005D51]"
            >
              Blog
            </Link>
            , which has its own tab. Newsletter signups and CSV export live under{' '}
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

      <section aria-label="Key metrics" className="scroll-mt-4">
        <h2 className="sr-only">Key metrics</h2>
        <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <MetricPill
            label="Articles"
            value={snap.loading ? '—' : String(snap.insightCount)}
            sub="Live on /blog"
            loading={snap.loading}
          />
          <MetricPill
            label="Books collected"
            value={
              snap.loading || snap.booksCollected == null || snap.totalBooks == null
                ? '—'
                : `${snap.booksCollected} / ${snap.totalBooks}`
            }
            sub={bookProgressPct != null ? `${bookProgressPct}% of goal` : null}
            loading={snap.loading}
            footer={
              bookProgressPct != null && !snap.loading ? (
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-[#142218]/10"
                  role="progressbar"
                  aria-valuenow={bookProgressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress toward book collection goal"
                >
                  <div
                    className="h-full rounded-full bg-[#005D51] transition-[width] duration-500"
                    style={{ width: `${bookProgressPct}%` }}
                  />
                </div>
              ) : null
            }
          />
          <MetricPill
            label="Quotes"
            value={snap.loading ? '—' : String(snap.testimonialCount)}
            sub="Homepage carousel"
            loading={snap.loading}
          />
          <Link
            href="/admin/newsletter"
            className="flex min-h-full min-w-0 flex-col rounded-xl border border-[#005D51]/20 bg-linear-to-br from-[#005D51]/08 to-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(20,34,24,0.04)] transition hover:border-[#005D51]/35 hover:shadow-[0_4px_20px_rgba(0,93,81,0.1)] sm:px-5 sm:py-3.5"
          >
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-[#005D51]">
              Newsletter
            </p>
            <p className="mt-1 font-poppins text-sm font-semibold text-[#142218]">View subscribers</p>
            <p className="mt-0.5 font-poppins text-xs font-medium text-[#5c6b5f]">
              Export CSV anytime
            </p>
          </Link>
        </div>
      </section>

      <section className="scroll-mt-4">
        <h2 className="mb-4 font-poppins text-xs font-bold uppercase tracking-[0.14em] text-[#142218]/45">
          Content editors
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-5">
          {tiles.map((t) => {
            const accent = tileAccent[t.key] ?? 'border-l-[#005D51] from-[#005D51]/06 to-white';
            const tileClassName = [
              'group relative flex min-h-[260px] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-[#142218]/08 bg-linear-to-b text-left shadow-[0_2px_8px_rgba(20,34,24,0.04)] transition duration-200',
              'border-l-[4px] hover:border-[#142218]/12 hover:shadow-[0_12px_40px_rgba(0,93,81,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005D51]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef5f2]',
              accent,
            ].join(' ');

            const body = (
              <>
                <div className="flex flex-1 flex-col px-5 pb-5 pt-5 md:px-6 md:pt-6">
                  <div className="min-h-0 flex-1">
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-[#142218]/45">
                      {t.statLabel}
                    </p>
                    <div className="mt-2 min-h-10">
                      {snap.loading ? (
                        <StatSkeleton />
                      ) : (
                        <>
                          <p className="font-poppins text-2xl font-bold tabular-nums leading-tight tracking-tight text-[#142218] sm:text-[1.75rem] wrap-anywhere">
                            {t.highlight}
                          </p>
                          {t.detail ? (
                            <p className="mt-1.5 font-poppins text-sm font-medium leading-snug text-[#5c6b5f]">
                              {t.detail}
                            </p>
                          ) : null}
                        </>
                      )}
                    </div>
                    <h3 className="mt-5 font-lora text-lg font-semibold text-[#142218]">{t.title}</h3>
                    <p className="mt-1.5 font-poppins text-sm leading-relaxed text-[#7B7B7B]">{t.blurb}</p>
                  </div>
                  <span className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#005D51] px-4 py-3 font-poppins text-sm font-semibold text-white transition group-hover:bg-[#004438] sm:py-3.5">
                    {'href' in t ? 'Open blog' : 'Open editor'}
                    <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </>
            );

            return (
              <li key={t.key} className="flex">
                {'href' in t ? (
                  <Link href={t.href} className={tileClassName} aria-label={`Open blog: ${t.title}`}>
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

      <section
        aria-labelledby="quick-actions-heading"
        className="rounded-2xl border border-[#142218]/08 bg-white p-5 shadow-[0_2px_12px_rgba(20,34,24,0.04)] sm:p-6 md:p-8"
      >
        <h2
          id="quick-actions-heading"
          className="font-lora text-lg font-semibold text-[#142218] sm:text-xl"
        >
          Quick actions
        </h2>
        <p className="mt-1 max-w-2xl font-poppins text-sm leading-relaxed text-[#5c6b5f]">
          Same destinations as the sidebar—use this row when you already know where
          you&apos;re headed.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { href: '/admin/newsletter', label: 'Newsletter list', hint: 'Subscribers & export' },
              {
                href: '/admin/community-applications',
                label: 'Membership applications',
                hint: 'Review requests',
              },
              { href: '/admin/invite', label: 'Send invite', hint: 'New admin access' },
              { href: '/admin/blog', label: 'Write on blog', hint: 'Articles & drafts' },
            ] as const
          ).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full min-h-18 flex-col justify-center rounded-xl border border-[#142218]/08 bg-[#fafcfb] px-4 py-3 transition hover:border-[#005D51]/25 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,93,81,0.08)]"
              >
                <span className="font-poppins text-sm font-semibold text-[#142218]">{item.label}</span>
                <span className="mt-0.5 font-poppins text-xs font-medium text-[#5c6b5f]">{item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-dashed border-[#005D51]/25 bg-[#005D51]/3 px-5 py-5 sm:px-6 sm:py-6">
        <h2 className="font-lora text-base font-semibold text-[#142218] sm:text-lg">
          Getting started
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 font-poppins text-sm leading-relaxed text-[#4a5c50] marker:font-semibold marker:text-[#005D51]">
          <li>Set your primary contact email and social links under Site details.</li>
          <li>Add at least one homepage quote in Testimonials.</li>
          <li>Publish your first blog post when you are ready.</li>
          <li>Check Newsletter subscribers after campaigns go live.</li>
        </ol>
      </section>
    </div>
  );
}
