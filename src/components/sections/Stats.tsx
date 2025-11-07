"use client"

import { StatsList } from './StatsList';
import { BookClubHero } from './BookClubHero';
import {
  MobileBackgroundSVG,
  LargeBackgroundSVG,
  ExtraLargeBackgroundSVG,
} from './BackgroundSVGs';
import { stats, bookClubHero } from '@/constants/data';

export function Stats() {
  const handleJoinClick = () => {
    console.log('Join button clicked');
  };

  return (
    <section className="w-full relative">
      <StatsList stats={stats} />

      <div className="w-full h-[525px] lg:h-[626px] xl:h-[842px] bg-white relative md:flex md:items-center md:justify-end">
        <div className="hidden md:flex">
          <img
            src="/book-club.png"
            alt="Book club background"
            className="absolute left-0 top-0 w-full md:h-[525px] lg:h-[626px] xl:h-[826px] object-cover"
          />
        </div>

        <MobileBackgroundSVG />
        <LargeBackgroundSVG />
        <ExtraLargeBackgroundSVG />

        <BookClubHero
          badge={bookClubHero.badge}
          title={bookClubHero.title}
          description={bookClubHero.description}
          buttonText={bookClubHero.buttonText}
          onButtonClick={handleJoinClick}
        />
      </div>
    </section>
  );
}
