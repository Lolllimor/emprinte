'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
  HiOutlineUserPlus,
} from 'react-icons/hi2';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';
import { AdminHeaderUserMenu } from '@/components/admin/AdminHeaderUserMenu';

const navClass =
  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-poppins transition-colors';
const navIconClass = 'size-[1.125rem] shrink-0 text-[#142218]/45';
const navInactive =
  'font-medium text-[#142218]/80 hover:bg-[#005D51]/08 hover:text-[#142218]';
const navActive = 'bg-[#005D51]/12 font-semibold text-[#005D51]';

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const siteInfoActive = pathname === '/admin';
  const blogActive = pathname === '/admin/blog';
  const newsletterActive = pathname === '/admin/newsletter';
  const profileActive = pathname === '/admin/profile';
  const inviteActive = pathname === '/admin/invite';

  const headerTitle = inviteActive
    ? 'Send invite'
    : profileActive
      ? 'Profile'
      : newsletterActive
        ? 'Newsletter subscribers'
        : blogActive
          ? 'Blog'
          : 'Site info';

  return (
    <div className="flex h-[100dvh] min-h-0 overflow-hidden bg-[#F0FFFD] text-[#142218]">
      <aside className="flex h-full w-56 shrink-0 flex-col overflow-y-auto rounded-r-2xl border-r border-[#005D51]/15 bg-white">
        <div className="border-b border-[#005D51]/10 p-5">
          <AdminBrandLogo href="/admin" width={120} height={50} priority />
          <p className="mt-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#005D51]">
            Admin
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1" aria-label="Admin sections">
          <Link
            href="/admin"
            className={`${navClass} ${siteInfoActive ? navActive : navInactive}`}
          >
            <HiOutlineSquares2X2
              className={`${navIconClass} ${siteInfoActive ? 'text-[#005D51]' : ''}`}
              aria-hidden
            />
            <span>Site info</span>
          </Link>
          <Link
            href="/admin/blog"
            className={`${navClass} ${blogActive ? navActive : navInactive}`}
          >
            <HiOutlineDocumentText
              className={`${navIconClass} ${blogActive ? 'text-[#005D51]' : ''}`}
              aria-hidden
            />
            <span>Blog</span>
          </Link>
          <Link
            href="/admin/newsletter"
            className={`${navClass} ${newsletterActive ? navActive : navInactive}`}
          >
            <HiOutlineEnvelope
              className={`${navIconClass} ${newsletterActive ? 'text-[#005D51]' : ''}`}
              aria-hidden
            />
            <span>Newsletter subscribers</span>
          </Link>
          <Link
            href="/admin/profile"
            className={`${navClass} ${profileActive ? navActive : navInactive}`}
          >
            <HiOutlineUserCircle
              className={`${navIconClass} ${profileActive ? 'text-[#005D51]' : ''}`}
              aria-hidden
            />
            <span>Profile</span>
          </Link>
          <Link
            href="/admin/invite"
            className={`${navClass} ${inviteActive ? navActive : navInactive}`}
          >
            <HiOutlineUserPlus
              className={`${navIconClass} ${inviteActive ? 'text-[#005D51]' : ''}`}
              aria-hidden
            />
            <span>Send invite</span>
          </Link>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#005D51]/10 bg-white px-5 sm:px-6">
          <p className="min-w-0 truncate font-lora text-xl font-semibold tracking-tight text-[#142218] md:text-2xl md:leading-snug">
            {headerTitle}
          </p>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden rounded-lg border-2 border-[#005D51] bg-white px-3 py-2 font-poppins text-sm font-medium text-[#005D51] transition-colors duration-200 hover:border-[#004438] hover:bg-[#005D51]/10 hover:text-[#004438] sm:inline-flex"
            >
              View site
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-lg border-2 border-[#005D51] bg-white p-2 text-[#005D51] transition-colors duration-200 hover:border-[#004438] hover:bg-[#005D51]/10 hover:text-[#004438] sm:hidden"
              aria-label="View public site"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
            <AdminHeaderUserMenu />
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto max-w-[1300px] px-6 py-10 md:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
