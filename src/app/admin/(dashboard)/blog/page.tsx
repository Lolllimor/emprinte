'use client';

import Link from 'next/link';

import { AdminInsightsPanel } from '@/components/admin/AdminInsightsPanel';
import { AdminPageSection } from '@/components/admin/AdminPageSection';

export default function AdminBlogPage() {
  return (
    <AdminPageSection
      id="blog-heading"
      eyebrow="Content"
      title="Blog"
      description="Posts on /blog and anywhere they are featured. Create drafts, refine copy and imagery, or remove posts you no longer need."
      actions={
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#005D51] bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-[#005D51] shadow-[0_1px_2px_rgba(20,34,24,0.04)] transition hover:border-[#004438] hover:bg-[#005D51]/08 hover:text-[#004438]"
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
