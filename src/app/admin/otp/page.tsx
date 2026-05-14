import Link from 'next/link';

import { AdminBrandLogo } from '@/components/admin/AdminBrandLogo';

export default function AdminOtpPage() {
  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px] text-center">
        <AdminBrandLogo href="/" priority />
        <h1 className="mt-6 font-lora text-2xl font-semibold text-[#142218]">
          Verification code
        </h1>
        <p className="mt-4 font-poppins text-[15px] leading-relaxed text-[#4a5c50]">
          Admin password reset now uses Supabase email links. Start from{' '}
          <Link href="/admin/forgot-password" className="text-[#005D51] underline">
            Forgot password
          </Link>
          , then open the link we send you and set a new password on{' '}
          <span className="font-medium text-[#142218]">/admin/update-password</span>.
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
