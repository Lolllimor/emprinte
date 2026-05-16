import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workshop Registration | Emprinte Readers Hub',
  description:
    'Register for Practical Steps to Financial Independence — an exclusive Emprinte workshop.',
};

export default function WorkshopRegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-[#142218] antialiased">{children}</div>
  );
}
