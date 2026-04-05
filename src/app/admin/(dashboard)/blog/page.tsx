'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { AdminInsightsPanel } from '@/components/admin/AdminInsightsPanel';
import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { getEditTokenForClient } from '@/lib/api';

export default function AdminBlogPage() {
  useEffect(() => {
    if (!getEditTokenForClient()) {
      window.location.replace('/admin/login');
    }
  }, []);

  return (
    <AdminPageSection
      id="blog-heading"
      eyebrow="Content"
      title="Blog"
      description="Posts on /blog and anywhere they are featured. Create drafts, refine copy and imagery, or remove posts you no longer need."
      actions={
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#015B51] bg-white px-4 py-2.5 font-campton text-sm font-semibold text-[#015B51] shadow-[0_1px_2px_rgba(20,34,24,0.04)] transition hover:border-[#014238] hover:bg-[#015B51]/08 hover:text-[#014238]"
        >
          View live blog
          <span aria-hidden className="text-base leading-none">
            →
          </span>
        </Link>
      }
    >
      <AdminInsightsPanel />
    </AdminPageSection>
  );
}
