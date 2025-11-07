import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { BookClub } from '@/components/sections/BookClub';
import { Initiatives } from '@/components/sections/Initiatives';
import { Bootcamps } from '@/components/sections/Bootcamps';
import { Newsletter } from '@/components/sections/Newsletter';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-full md:max-w-7xl lg:max-w-full">
        <Header />
        <Hero />
        <Stats />
        <BookClub />
        <Initiatives />
        <Bootcamps />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
