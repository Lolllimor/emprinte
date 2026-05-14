import Image from 'next/image';
import Link from 'next/link';

import { ArticleShareBar } from '@/components/blog/ArticleShareBar';
import type { InsightArticle } from '@/types';

const articleShell =
  'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-[75px] xl:max-w-[1320px] xl:px-[120px]';

function authorInitials(authorName: string, authorRole: string): string {
  const n = authorName.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const r = authorRole.trim();
  if (r) return r.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || '•';
  return '?';
}

function ArticleParagraphs({ text, isLead }: { text: string; isLead?: boolean }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {blocks.map((block, i) => {
        const lead = Boolean(isLead && i === 0);
        return (
          <p
            key={i}
            className={
              lead
                ? 'font-lora text-base leading-relaxed text-[#142218] sm:text-lg'
                : 'font-poppins text-sm leading-[1.75] text-[#2d3640] sm:text-base sm:leading-[1.72]'
            }
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}

type BlogPostViewProps = {
  article: InsightArticle;
  /** Canonical URL for this post (e.g. `https://…/blog/my-id`). */
  articleUrl: string;
};

export function BlogPostView({ article, articleUrl }: BlogPostViewProps) {
  const hasBody = Boolean(article.body?.trim());
  const showExternal =
    Boolean(article.href?.trim()) &&
    /^https?:\/\//i.test(article.href!.trim());

  const proseText = hasBody
    ? article.body!.trim()
    : article.description.trim();

  return (
    <article className="w-full bg-white">
      <div className={`${articleShell} pt-7 pb-9 md:pt-9 md:pb-10`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 font-poppins text-xs font-semibold text-[#005D51] transition-colors hover:text-[#004438]"
          >
            <span aria-hidden>←</span>
            <span>All posts</span>
          </Link>

          <header className="mt-6 flex w-full flex-col gap-3 sm:gap-4 lg:mt-8">
            <p className="font-poppins text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#005D51]">
              <time dateTime={article.date}>{article.date}</time>
            </p>
            <h1 className="max-w-4xl font-lora text-xl font-bold leading-snug tracking-tight text-[#142218] sm:text-2xl md:text-3xl lg:text-[2rem]">
              {article.title}
            </h1>
            {hasBody && article.description.trim() ? (
              <p className="w-full max-w-none border-l-2 border-[#005D51]/35 pl-4 font-lora text-sm italic leading-snug text-[#4d575f] sm:text-base lg:text-lg">
                {article.description}
              </p>
            ) : null}
          </header>
        </div>

      <div className={`${articleShell} pb-14 pt-7 md:pb-16 md:pt-9`}>
        <figure className="relative aspect-2/1 w-full overflow-hidden rounded-xl bg-[#dfecea] shadow-[0_12px_36px_-20px_rgba(20,34,24,0.28)] ring-1 ring-[#005D51]/10 lg:max-h-[min(480px,52vh)] lg:min-h-[260px]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        </figure>

        <div className="mt-8 w-full md:mt-10">
          <ArticleShareBar articleUrl={articleUrl} title={article.title} />

          <ArticleParagraphs text={proseText} isLead={hasBody} />

          {showExternal && !hasBody ? (
            <div className="mt-10 rounded-xl border border-[#005D51]/12 bg-white px-4 py-6">
              <p className="font-poppins text-xs leading-relaxed text-[#5a6570] sm:text-sm">
                The full story lives on an external site. After you finish
                here, you can continue there.
              </p>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-lg bg-[#005D51] px-4 py-2.5 font-poppins text-xs font-semibold text-white transition-colors hover:bg-[#004438] sm:text-sm"
              >
                Open full article
              </a>
            </div>
          ) : null}

          {article.authorName?.trim() || article.authorRole?.trim() ? (
            <aside
              className="mt-12 border-t border-[#005D51]/10 pt-10 md:mt-16 md:pt-12"
              aria-label="About the author"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#005D51]/8 bg-white shadow-[0_1px_0_rgba(0,93,81,0.05),0_28px_56px_-32px_rgba(20,34,24,0.18)] ring-1 ring-[#005D51]/6">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#f0fffd]/90 via-white to-white" />
                <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#005D51] text-xl font-semibold tracking-tight text-white shadow-[0_10px_28px_-12px_rgba(0,93,81,0.55)] ring-4 ring-white sm:h-22 sm:w-22 sm:text-2xl"
                    aria-hidden
                  >
                    {authorInitials(
                      article.authorName ?? '',
                      article.authorRole ?? '',
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-poppins text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#005D51]/90">
                      About the author
                    </p>
                    {article.authorName?.trim() ? (
                      <p
                        id="blog-post-author-name"
                        className="mt-2 font-lora text-xl font-semibold leading-snug tracking-tight text-[#142218] sm:text-2xl"
                      >
                        {article.authorName.trim()}
                      </p>
                    ) : null}
                    {article.authorRole?.trim() ? (
                      <p className="mt-2 max-w-2xl font-poppins text-sm font-medium leading-relaxed text-[#5a6570] sm:text-base">
                        {article.authorRole.trim()}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
