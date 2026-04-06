'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { clearStoredEditToken } from '@/lib/api';

interface AdminPageHeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  showSignOut?: boolean;
}

export function AdminPageHeader({
  title = 'Admin',
  backHref = '/',
  backLabel = 'Back to site',
  showSignOut = false,
}: AdminPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-12">
      <h1 className="text-2xl font-bold text-[#015B51] font-lora">{title}</h1>
      <div className="flex flex-wrap items-center gap-4">
        {showSignOut ? (
          <button
            type="button"
            onClick={() => {
              clearStoredEditToken();
              router.replace('/admin/login');
            }}
            className="font-campton text-sm text-[#4a5c50] underline underline-offset-2 hover:text-[#142218]"
          >
            Sign out
          </button>
        ) : null}
        <Link
          href={backHref}
          className="font-campton text-[#015B51] underline underline-offset-2 hover:no-underline"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
