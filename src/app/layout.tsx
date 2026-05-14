import type { Metadata } from 'next';
import { Lora, Poppins } from 'next/font/google';

import { AppToaster } from '@/components/AppToaster';
import './globals.css';

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'EMPRINTE Readers Hub - Transforming Africa, One Book at a Time',
  description:
    'Join Emprinte Readers Hub - Where Books Connect, Inspire, and Change Lives.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon.png', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${poppins.variable} antialiased`}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
