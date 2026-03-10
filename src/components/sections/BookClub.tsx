'use client';

import { BuildAReaderImage } from '../ui/BuildAReaderImage';
import { InitiativeBg } from '../ui/InitiativeBg';
import { BookIcon } from './BookIcon';
import { Badge } from '../ui';

const dummyBookProgress = {
  booksCollected: 119,
  totalBooks: 500,
  pricePerBook: 2500,
};

export function BookClub() {
  const { booksCollected, totalBooks, pricePerBook } = dummyBookProgress;
  const progressPercent = Math.min((booksCollected / totalBooks) * 100, 100);
  return (
    <section
      id="initiatives"
      className="w-full relative bg-white flex flex-col items-center  max-w-[1440px] mx-auto"
    >
      <div className="absolute inset-0 top-0 left-0">
        <InitiativeBg />
      </div>
      <div className="flex items-center justify-start w-full gap-7.5 z-10 pr-[120px]">
        <BuildAReaderImage />
        <div className="flex-1 flex flex-col gap-8">
          <Badge>
            Explore our Initiatives
          </Badge>
       
          <div className="flex flex-col text-white gap-1 ">
            <span className="text-2xl font-campton">Ongoing Initiative..</span>
            <div className="flex items-end">
              <p className="text-[82px] max-w-[351px] leading-[0.9] font-bold font-lora">
                BUILD A READER
              </p>
              <span className="font-lora text-5xl font-bold">2.0</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-full ">
            <div className="flex justify-between items-start">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white font-campton">
                  {booksCollected}
                </span>
                <span className="text-base md:text-lg text-white/90 font-campton font-medium ml-2">
                  of {totalBooks} Books
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <BookIcon />
                <span className="text-base md:text-[28px] font-medium font-campton">
                  N{pricePerBook.toLocaleString()}/BOOK
                </span>
              </div>
            </div>
            <div className="relative w-full">
              <div className="h-6 md:h-8 w-full rounded-full bg-white border-4 border-white overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ed4e32] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-sm md:text-base text-white font-medium font-campton">
                {[0, 100, 200, 300, 400, totalBooks].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-full bg-[#E63715] h-16 text-white rounded-xl text-2xl font-medium">
              Donate Now
            </button>
            <button className="w-full bg-transparent border h-16 text-white rounded-xl text-2xl font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
