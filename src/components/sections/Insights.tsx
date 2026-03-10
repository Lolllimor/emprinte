import Image from 'next/image';
import { insightArticles } from '@/constants/data';
import { Badge } from '../ui';

export function Insights() {
  return (
    <section
      id="insights"
      className="w-full bg-[#F0FFFD] px-6 py-16 lg:py-24 xl:px-[120px] lg:px-[75px]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Badge>Emprinte Insider</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#015B51] font-lora leading-tight max-w-[600px]">
            Explore Insights from Emprinte Readers
          </h2>
        </div>

        <div className="flex flex-col gap-12 lg:gap-16 h-full">
          {insightArticles.map((article) => (
            <article
              key={article.id}
              className="w-full flex flex-col md:flex-row gap-11 md:gap-8 items-start h-[333px] "
            >
              <div className="shrink-0 w-full md:w-auto md:min-w-[140px]">
                <time
                  dateTime={article.date}
                  className="text-xl font-semibold text-[#151515] font-campton block whitespace-pre-line"
                >
                  {article.date.replace(/, (\d{4})$/, '\n$1')}
                </time>
              </div>

              <div className="shrink-0 w-full md:w-[452px] aspect-400/280 h-[333px] relative rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover rounded-3xl"
                  sizes="(max-width: 452px) 100vw, 452px"
                />
              </div>

              <div className=" flex flex-col justify-between min-w-0 min-h-full">
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-semibold text-gray-900 font-campton">
                    {article.title}
                  </h3>
                  <p className="text-xl text-[#7B7B7B] font-campton leading-tight">
                    {article.description}
                  </p>
                </div>
                <a
                  href={article.href ?? '#'}
                  className="inline-flex h-12 px-4 items-center justify-center rounded-xl bg-[#E63715] text-white font-medium font-campton text-2xl w-full hover:bg-[#c42e12] transition-colors"
                >
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
