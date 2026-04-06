'use client';

import Link from 'next/link';
import { HiOutlineArrowRightOnRectangle, HiOutlineUserCircle } from 'react-icons/hi2';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { profileFromJwtToken, profileInitial } from '@/lib/admin-profile';
import { clearStoredEditToken, getEditTokenForClient } from '@/lib/api';

function AdminHeaderUserMenuInner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? getEditTokenForClient() : '';
  const preview = profileFromJwtToken(token);
  const initial = profileInitial(token);
  const subtitle = preview.email || preview.name || 'Account';

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open, close]);

  function signOut() {
    clearStoredEditToken();
    try {
      localStorage.removeItem('admin_token');
    } catch {
      /* */
    }
    close();
    router.replace('/admin/login');
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        id="admin-user-menu-button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="admin-user-menu"
        className="flex items-center gap-2 rounded-xl border border-[#015B51]/20 bg-white py-1.5 pl-1.5 pr-3 text-left shadow-sm transition hover:border-[#015B51]/35 hover:bg-[#F0FFFD]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#015B51]/30"
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#015B51]/12 font-campton text-sm font-semibold text-[#015B51]"
          aria-hidden
        >
          {initial}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate font-campton text-sm font-medium text-[#142218]">
            {preview.name || 'Admin'}
          </span>
          <span className="block truncate font-campton text-xs font-medium text-[#7B7B7B]">
            {subtitle}
          </span>
        </span>
        <span className="text-[#015B51]/70 sm:ml-0.5" aria-hidden>
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          id="admin-user-menu"
          role="menu"
          aria-labelledby="admin-user-menu-button"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#015B51]/15 bg-white py-1 shadow-[0_12px_36px_rgba(1,91,81,0.12)]"
        >
          <Link
            href="/admin/profile"
            role="menuitem"
            onClick={close}
            className="flex items-center gap-2.5 px-3 py-2.5 font-campton text-sm font-medium text-[#142218] transition hover:bg-[#015B51]/08"
          >
            <HiOutlineUserCircle className="size-4 shrink-0 text-[#015B51]" aria-hidden />
            Profile
          </Link>
          <div className="my-1 border-t border-[#015B51]/10" role="separator" />
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 font-campton text-sm font-medium text-[#142218] transition hover:bg-[#015B51]/08"
          >
            <HiOutlineArrowRightOnRectangle
              className="size-4 shrink-0 text-[#015B51]"
              aria-hidden
            />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AdminHeaderUserMenu() {
  const pathname = usePathname();
  return <AdminHeaderUserMenuInner key={pathname} />;
}
