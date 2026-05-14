'use client';

import Link from 'next/link';
import { HiOutlineArrowRightOnRectangle, HiOutlineUserCircle } from 'react-icons/hi2';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { profileFromSupabaseUser, profileInitial } from '@/lib/admin-profile';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function AdminHeaderUserMenuInner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const supabase = createSupabaseBrowserClient();
      subscription = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setUser(session?.user ?? null);
      }).data.subscription;
      void supabase.auth.getUser().then(({ data: { user: u } }) => {
        if (!cancelled) setUser(u);
      });
    } catch {
      /* misconfigured env */
    }
    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const preview = profileFromSupabaseUser(user);
  const initial = profileInitial(user);
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

  async function signOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* */
    }
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
        className="flex items-center gap-2 rounded-xl border border-[#005D51]/20 bg-white py-1.5 pl-1.5 pr-3 text-left shadow-sm transition hover:border-[#005D51]/35 hover:bg-[#F0FFFD]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005D51]/30"
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#005D51]/12 font-poppins text-sm font-semibold text-[#005D51]"
          aria-hidden
        >
          {initial}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate font-poppins text-sm font-medium text-[#142218]">
            {preview.name || 'Admin'}
          </span>
          <span className="block truncate font-poppins text-xs font-medium text-[#7B7B7B]">
            {subtitle}
          </span>
        </span>
        <span className="text-[#005D51]/70 sm:ml-0.5" aria-hidden>
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
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#005D51]/15 bg-white py-1 shadow-[0_12px_36px_rgba(0,93,81,0.12)]"
        >
          <Link
            href="/admin/profile"
            role="menuitem"
            onClick={close}
            className="flex items-center gap-2.5 px-3 py-2.5 font-poppins text-sm font-medium text-[#142218] transition hover:bg-[#005D51]/08"
          >
            <HiOutlineUserCircle className="size-4 shrink-0 text-[#005D51]" aria-hidden />
            Profile
          </Link>
          <div className="my-1 border-t border-[#005D51]/10" role="separator" />
          <button
            type="button"
            role="menuitem"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 font-poppins text-sm font-medium text-[#142218] transition hover:bg-[#005D51]/08"
          >
            <HiOutlineArrowRightOnRectangle
              className="size-4 shrink-0 text-[#005D51]"
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
