import { Testimonials } from '@/components/sections/Testimonials';
import { Initiatives } from '@/components/sections/Initiatives';
import { Newsletter } from '@/components/sections/Newsletter';
import { Bootcamps } from '@/components/sections/Bootcamps';
import { BookClub } from '@/components/sections/BookClub';
import { Insights } from '@/components/sections/Insights';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Stats } from '@/components/sections/Stats';
import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <main className="min-h-screen  bg-white flex flex-col items-center relative">
      <div className="w-full max-w-full md:max-w-7xl lg:max-w-full">
        <Header />
        <Hero />
        <Stats />
        <BookClub />
        <Initiatives />
        <Bootcamps />
        {/* <Insights /> */}
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
