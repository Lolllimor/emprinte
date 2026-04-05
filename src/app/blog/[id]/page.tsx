import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { BlogPostView } from '@/components/sections/BlogPostView';
import { insightArticles } from '@/constants/data';
import { fetchInsightArticleById } from '@/lib/insights-public';
import { getSiteSettings } from '@/lib/site-settings-server';

type PageProps = {
  params: Promise<{ id: string }>;
};

async function resolveArticle(id: string) {
  const fromApi = await fetchInsightArticleById(id);
  if (fromApi) return fromApi;
  return insightArticles.find((a) => a.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await resolveArticle(id);
  if (!article) {
    return { title: 'Post not found | Emprinte Readers Hub' };
  }
  const desc =
    article.description.slice(0, 155) +
    (article.description.length > 155 ? '…' : '');
  return {
    title: `${article.title} | Emprinte Readers Hub`,
    description: desc,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const article = await resolveArticle(id);

  if (!article) {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-white">
      <Header contactEmail={settings.contactInfo.email} />
      <BlogPostView article={article} />
      <Footer contactInfo={settings.contactInfo} />
    </main>
  );
}
