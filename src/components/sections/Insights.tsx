import Image from 'next/image';
import { insightArticles } from '@/constants/data';
import { Badge } from '../ui';

export function Insights() {
  return (
    <section
      id="insights"
      className="w-full bg-[#F0FFFD] px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-[75px] lg:py-24 xl:px-[120px]"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12">
        <div className="flex flex-col gap-3 sm:gap-4">
          <Badge>Emprinte Insider</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-[#005D51] font-lora leading-tight max-w-[600px]">
            Explore Insights from Emprinte Readers
          </h2>
        </div>

        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 ">
          {insightArticles.map((article) => (
            <article
              key={article.id}
              className="w-full flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-6 lg:gap-8 items-start md:min-h-[280px] lg:min-h-[333px]"
            >
              <div className="shrink-0 w-full md:w-auto md:min-w-[85px] lg:min-w-[140px] order-2 md:order-1">
                <time
                  dateTime={article.date}
                  className="text-base sm:text-lg md:text-sm lg:text-xl font-semibold text-[#151515] font-poppins block whitespace-pre-line"
                >
                  {article.date.replace(/, (\d{4})$/, '\n$1')}
                </time>
              </div>

              <div className="shrink-0 w-full md:w-[200px] lg:w-[300px] xl:w-[452px] aspect-400/280 relative rounded-lg overflow-hidden order-1 md:order-2">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover rounded-2xl sm:rounded-3xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 200px, 452px"
                />
              </div>

              <div className="flex flex-col justify-between gap-3 md:gap-4 min-w-0 flex-1 order-3">
                <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                  <h3 className="text-xl sm:text-2xl md:text-lg lg:text-3xl font-semibold text-gray-900 font-poppins leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-base sm:text-lg md:text-sm lg:text-xl text-[#7B7B7B] font-poppins leading-tight font-medium">
                    {article.description}
                  </p>
                </div>
                <a
                  href={article.href ?? '#'}
                  className="inline-flex h-11 sm:h-12 md:h-9 md:px-3 md:text-sm lg:h-12 lg:px-4 lg:text-2xl items-center justify-center rounded-xl bg-[#E63715] text-white font-medium text-lg sm:text-xl w-full sm:w-auto sm:min-w-[200px] md:min-w-0 hover:bg-[#c42e12] transition-colors"
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
