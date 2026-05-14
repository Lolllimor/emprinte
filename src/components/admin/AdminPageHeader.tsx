'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

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
      <h1 className="text-2xl font-bold text-[#005D51] font-lora">{title}</h1>
      <div className="flex flex-wrap items-center gap-4">
        {showSignOut ? (
          <button
            type="button"
            onClick={async () => {
              try {
                const supabase = createSupabaseBrowserClient();
                await supabase.auth.signOut();
              } catch {
                /* */
              }
              router.replace('/admin/login');
            }}
            className="font-poppins text-sm text-[#4a5c50] underline underline-offset-2 hover:text-[#142218]"
          >
            Sign out
          </button>
        ) : null}
        <Link
          href={backHref}
          className="font-poppins text-[#005D51] underline underline-offset-2 hover:no-underline"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
