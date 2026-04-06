import Image from 'next/image';
import Link from 'next/link';
import type { InsightArticle } from '@/types';

const articleShell =
  'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-[75px] xl:max-w-[1320px] xl:px-[120px]';

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
                : 'font-campton text-sm leading-[1.75] text-[#2d3640] sm:text-base sm:leading-[1.72]'
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
};

export function BlogPostView({ article }: BlogPostViewProps) {
  const hasBody = Boolean(article.body?.trim());
  const showExternal =
    Boolean(article.href?.trim()) &&
    /^https?:\/\//i.test(article.href!.trim());

  const proseText = hasBody
    ? article.body!.trim()
    : article.description.trim();

  return (
    <article className="w-full bg-[#f4faf8]">
      <div className=" bg-[#eef8f5]">
        <div className={`${articleShell} pt-7 pb-9 md:pt-9 md:pb-10`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 font-campton text-xs font-semibold text-[#015B51] transition-colors hover:text-[#014238]"
          >
            <span aria-hidden>←</span>
            <span>All posts</span>
          </Link>

          <header className="mt-6 flex w-full flex-col gap-3 sm:gap-4 lg:mt-8">
            <p className="font-campton text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#015B51]">
              <time dateTime={article.date}>{article.date}</time>
            </p>
            <h1 className="max-w-4xl font-lora text-xl font-bold leading-snug tracking-tight text-[#142218] sm:text-2xl md:text-3xl lg:text-[2rem]">
              {article.title}
            </h1>
            {hasBody && article.description.trim() ? (
              <p className="max-w-3xl border-l-2 border-[#015B51]/35 pl-4 font-lora text-sm italic leading-snug text-[#4d575f] sm:text-base lg:text-lg">
                {article.description}
              </p>
            ) : null}
          </header>
        </div>
      </div>

      <div className={`${articleShell} pb-14 pt-7 md:pb-16 md:pt-9`}>
        <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#dfecea] shadow-[0_12px_36px_-20px_rgba(20,34,24,0.28)] ring-1 ring-[#015B51]/10 sm:aspect-[2/1] lg:max-h-[min(480px,52vh)] lg:min-h-[260px]">
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

        <div className="mt-8 w-full  md:mt-10 ">
          <ArticleParagraphs text={proseText} isLead={hasBody} />

          {showExternal && !hasBody ? (
            <div className="mt-10 rounded-xl border border-[#015B51]/12 bg-white/90 px-4 py-6">
              <p className="font-campton text-xs leading-relaxed text-[#5a6570] sm:text-sm">
                The full story lives on an external site. After you finish
                here, you can continue there.
              </p>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-lg bg-[#015B51] px-4 py-2.5 font-campton text-xs font-semibold text-white transition-colors hover:bg-[#014238] sm:text-sm"
              >
                Open full article
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
