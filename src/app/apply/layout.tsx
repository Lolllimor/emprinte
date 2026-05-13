import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply | Emprinte Readers Hub',
  description:
    'Apply to join Emprinte Readers Hub — create your applicant account, complete the form, and submit your application fee receipt.',
};

export default function ApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCE4EC] via-[#FFF5F7] to-[#F0FFFD] text-[#142218] antialiased">
      {children}
    </div>
  );
}
