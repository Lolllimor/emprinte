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

      <div className="w-full h-[450px] bg-[url('/book.png')] bg-cover bg-center lg:h-[438px] xl:h-[617px] relative flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-[84px] p-6 md:p-0">
        <div className="flex flex-col gap-10 2xl:ml-auto xl:ml-[120px] lg:ml-[75px] md:ml-6 md:max-w-[1200px] 2xl:mx-auto w-full">
          <div className="flex flex-col gap-4">
            <Badge>Emprinte Growth Tracker 2026</Badge>

            <p className="text-4xl xl:text-6xl leading-snug font-bold text-[#015B51]  lg:max-w-[390px] xl:max-w-[469px] font-lora">
              Turn Clarity Into Measurable Progress
            </p>
          </div>
          <button onClick={() => window.open('https://docs.google.com/spreadsheets/d/1j7vHUolxqpuPQl1UD8abgavr6E4gYxIeH0sXV6y85TE/edit?usp=drivesdk', '_blank')} className=" cursor-pointer lg:h-12 h-10 px-2.5 flex justify-center items-center gap-2.5 rounded-lg bg-[#015B51] lg:max-w-[400px] w-1/2">
            <span className="lg:text-xl text-base leading-[150%] font-medium text-white font-campton">
              Download For Free
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
