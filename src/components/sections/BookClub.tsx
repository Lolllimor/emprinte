'use client';
import { useEffect, useState } from 'react';

import { BuildAReaderSlideshow } from '../ui/BuildAReaderSlideshow';
import { BookProgressProps } from '@/types';
import { BookIcon } from './BookIcon';
import { getSameOriginApiUrl } from '@/lib/api';
import { Badge } from '../ui';

export function BookClub() {
  const [bookProgress, setBookProgress] = useState<BookProgressProps>();
  const collected = bookProgress?.booksCollected ?? 0;
  const total = bookProgress?.totalBooks ?? 0;
  const progressPercent =
    total > 0 ? Math.min((collected / total) * 100, 100) : 0;

  useEffect(() => {
    const fetchBookProgress = async () => {
      const res = await fetch(getSameOriginApiUrl('build-a-reader'), {
        cache: 'no-store',
      });
      const data = await res.json();
      const slides = Array.isArray(data?.slideshowUrls)
        ? data.slideshowUrls.filter(
            (s: unknown): s is string =>
              typeof s === 'string' && /^https?:\/\//i.test(s.trim()),
          )
        : [];
      setBookProgress({
        booksCollected: typeof data?.booksCollected === 'number' ? data.booksCollected : 0,
        totalBooks: typeof data?.totalBooks === 'number' ? data.totalBooks : 0,
        pricePerBook: typeof data?.pricePerBook === 'number' ? data.pricePerBook : 0,
        slideshowUrls: slides.map((s: string) => s.trim()).slice(0, 5),
      });
    };
    fetchBookProgress();
  }, []); 
  return (
    <section
      id="initiatives"
      className="w-full relative bg-[url(/map-green.png)] bg-cover bg-center flex flex-col items-center  h-full mx-auto"
    >
     
      <div className="flex flex-col items-stretch gap-7.5 z-10 xl:pr-[120px] lg:pr-[75px] pr-6 max-w-[1200px] mx-auto lg:flex-row lg:items-center">
        <div className="w-full shrink-0 px-4 lg:w-auto lg:max-w-[550px] lg:px-0">
          <BuildAReaderSlideshow urls={bookProgress?.slideshowUrls} />
        </div>
        <div className="flex-1 flex flex-col gap-8 py-8 pl-4 lg:py-0 lg:pl-0 ">
          <Badge>
            Explore our Initiatives
          </Badge>
       
          <div className="flex flex-col text-white gap-1 ">
            <span className="xl:text-2xl text-base font-poppins">Ongoing Initiative..</span>
            <div className="flex items-end">
              <p className="xl:text-[82px] text-6xl xl:max-w-[351px] max-w-[255px] leading-[0.9] font-bold font-lora">
                BUILD A READER
              </p>
              <span className="font-lora xl:text-5xl text-2xl font-bold">2.0</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-full mt-4 lg:mt-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="lg:text-3xl xl:text-5xl font-bold text-white font-poppins">
                  {bookProgress?.booksCollected ?? "--"}
                </span>
                <span className="xl:text-lg text-sm text-white/90 font-poppins font-medium xl:ml-2 ml-1">
                  of {bookProgress?.totalBooks ?? "--"} Books
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <BookIcon size={24} />
                <span className="text-base xl:text-[28px] font-medium font-poppins">
                  N{bookProgress?.pricePerBook?.toLocaleString() ?? "--"}/BOOK
                </span>
              </div>
            </div>
            <div className="relative w-full">
              <div className="h-6 md:h-8 w-full rounded-full bg-white border-4 border-white overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ed4e32] transition-all"
                  style={{ width: `${progressPercent ?? 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-sm xl:text-base text-white font-medium font-poppins">
                {[0, 100, 200, 300, 400, bookProgress?.totalBooks].map((n,idx) => (
                  <span key={idx}>{n}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-full bg-[#E63715] xl:h-16 h-10  text-white rounded-xl xl:text-2xl font-medium">
              Donate Now
            </button>
            <button className="w-full bg-transparent border xl:h-16 h-10 text-white rounded-xl xl:text-2xl font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
