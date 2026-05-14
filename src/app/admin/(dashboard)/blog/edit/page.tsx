'use client';

import { Suspense } from 'react';

import { InsightArticleEditorClient } from '@/components/admin/InsightArticleEditorClient';

function EditorFallback() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center font-poppins text-sm text-[#5a6570]">
      Loading…
    </div>
  );
}

export default function AdminBlogEditPage() {
  return (
    <Suspense fallback={<EditorFallback />}>
      <InsightArticleEditorClient />
    </Suspense>
  );
}
