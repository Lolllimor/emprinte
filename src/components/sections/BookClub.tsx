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
      className="w-full relative bg-[url(/map-green.png)] bg-cover bg-center flex flex-col items-center  h-full mx-auto"
    >
     
      <div className="flex items-center justify-start w-full gap-7.5 z-10 xl:pr-[120px] lg:pr-[75px] pr-6 max-w-[1200px] mx-auto">
        <div className='hidden lg:block'>

        <BuildAReaderImage />
        </div>
        <div className="flex-1 flex flex-col gap-8 py-8 pl-4 lg:py-0 lg:pl-0 ">
          <Badge>
            Explore our Initiatives
          </Badge>
       
          <div className="flex flex-col text-white gap-1 ">
            <span className="xl:text-2xl text-base font-campton">Ongoing Initiative..</span>
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
                <span className="lg:text-3xl xl:text-5xl font-bold text-white font-campton">
                  {booksCollected}
                </span>
                <span className="xl:text-lg text-sm text-white/90 font-campton font-medium xl:ml-2 ml-1">
                  of {totalBooks} Books
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <BookIcon size={24} />
                <span className="text-base xld:text-[28px] font-medium font-campton">
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
              <div className="flex justify-between mt-1.5 text-sm xl:text-base text-white font-medium font-campton">
                {[0, 100, 200, 300, 400, totalBooks].map((n) => (
                  <span key={n}>{n}</span>
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
