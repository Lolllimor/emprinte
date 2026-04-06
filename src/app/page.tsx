import { Testimonials } from '@/components/sections/Testimonials';
import { Initiatives } from '@/components/sections/Initiatives';
import { Newsletter } from '@/components/sections/Newsletter';
import { Bootcamps } from '@/components/sections/Bootcamps';
import { BookClub } from '@/components/sections/BookClub';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Stats } from '@/components/sections/Stats';
import { Hero } from '@/components/sections/Hero';
import { getSiteSettings } from '@/lib/site-settings-server';

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen  bg-white flex flex-col items-center relative">
      <div className="w-full max-w-full md:max-w-7xl lg:max-w-full">
        <Header contactEmail={settings.contactInfo.email} />
        <Hero />
        <Stats />
        <BookClub />
        <Initiatives />
        <Bootcamps />
        {/* <Insights /> */}
        <Testimonials />
        <Newsletter />
        <Footer contactInfo={settings.contactInfo} />
      </div>
    </main>
  );
}
