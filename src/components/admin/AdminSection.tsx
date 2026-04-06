import type { ReactNode } from 'react';

import { adminSectionTitle } from './admin-styles';

interface AdminSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function AdminSection({
  title,
  children,
  className = 'mb-16',
}: AdminSectionProps) {
  return (
    <section className={className}>
      <h2 className={adminSectionTitle}>{title}</h2>
      {children}
    </section>
  );
}
