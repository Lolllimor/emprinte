'use client';

import Image from 'next/image';
import Link from 'next/link';

type AdminBrandLogoProps = {
  /** When set, the logo is wrapped in a link (e.g. `/` on auth pages, `/admin` in the dashboard). */
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function AdminBrandLogo({
  href = '/',
  width = 139,
  height = 58,
  className = '',
  priority = false,
}: AdminBrandLogoProps) {
  const image = (
    <Image
      src="/Logo.png"
      alt="Emprinte Readers Hub"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto max-w-full ${className}`.trim()}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block shrink-0 rounded outline-none focus-visible:ring-2 focus-visible:ring-[#005D51]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {image}
      </Link>
    );
  }

  return image;
}
