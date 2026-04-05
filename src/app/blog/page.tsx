import type { Metadata } from 'next';

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { BlogArticleList } from '@/components/sections/BlogArticleList';
import { insightArticles } from '@/constants/data';
import { getSiteSettings } from '@/lib/site-settings-server';

export const metadata: Metadata = {
  title: 'Blog | Emprinte Readers Hub',
  description:
    'Stories and updates from Emprinte Readers Hub — reading that changes the world.',
};



export default async function BlogPage() {
  const settings = await getSiteSettings();

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-white">
      <Header contactEmail={settings.contactInfo.email} />
      <BlogArticleList articles={insightArticles} />
      <Footer contactInfo={settings.contactInfo} />
    </main>
  );
}
