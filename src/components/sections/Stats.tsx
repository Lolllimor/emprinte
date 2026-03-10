'use client';

import BookClubBg from '../ui/book-club-bg';
import { stats } from '@/constants/data';
import { StatsList } from './StatsList';
import { Badge } from '../ui';

export function Stats() {
  const handleJoinClick = () => {
    window.open('https://bit.ly/emprinteapplication', '_blank');
  };

  return (
    <section id="about" className="w-full relative">
      <StatsList stats={stats} />

      <div className="w-full h-[450px] lg:h-[550px] xl:h-[617px] bg-white relative md:flex md:items-center md:justify-start">
        <div className="w-full h-full absolute left-0 top-0">
          <BookClubBg />
        </div>
        <div className="flex flex-col gap-10 z-10 ml-[120px]">
          <div className="flex flex-col gap-4">
            <Badge>Emprinte Growth Tracker 2026</Badge>

            <p className="text-base md:text-4xl xl:text-6xl leading-snug font-bold text-[#015B51] max-w-[469px] font-lora">
              Turn Clarity Into Measurable Progress
            </p>
          </div>
          <button className="w-full cursor-pointer h-12 px-2.5 flex justify-center items-center gap-2.5 rounded-lg bg-[#015B51]">
            <span className="text-xl leading-[150%] font-medium text-white font-campton">
              Download For Free
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
