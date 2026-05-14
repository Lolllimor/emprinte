import Link from 'next/link';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';

export default function AdminResetPasswordLegacyPage() {
  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px] text-center">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold text-[#142218]">
          Reset password
        </h1>
        <p className="mt-4 font-poppins text-[15px] leading-relaxed text-[#4a5c50]">
          Use the link from your Supabase reset email, then set your new password on{' '}
          <Link href="/admin/update-password" className="text-[#005D51] underline">
            this page
          </Link>
          . Or start again from{' '}
          <Link href="/admin/forgot-password" className="text-[#005D51] underline">
            Forgot password
          </Link>
          .
        </p>
        <p className="mt-8">
          <Link
            href="/admin/login"
            className="font-poppins text-sm text-[#005D51] underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
