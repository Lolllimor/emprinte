import Image from 'next/image';
import Link from 'next/link';
import { HiLockClosed } from 'react-icons/hi';

import { Badge } from '../ui';

const WORKSHOP_REGISTER_URL =
  process.env.NEXT_PUBLIC_WORKSHOP_REGISTER_URL ?? '/apply';

const learnItems = [
  {
    icon: '/workshop/favorite-chart.svg',
    title: 'Saving and Building Sustainable Financial Habits',
  },
  {
    icon: '/workshop/wallet-money.svg',
    title: 'Investing 101 for First-Time Investors',
  },
] as const;

export function ExclusiveWorkshop() {
  return (
    <section
      id="exclusive-workshop"
      className="w-full bg-[#F0FFFD] px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-[75px] lg:py-20 xl:px-[120px]"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="flex min-w-0 flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Badge>Exclusive Workshop</Badge>
            <h2 className="font-lora text-[32px] font-bold leading-[1.12] text-[#151515] sm:text-[40px] lg:text-[48px] xl:text-[56px]">
              Build a Smarter System for{' '}
              <span className="text-[#005D51]">Your Money</span>
            </h2>
            <p className="max-w-[560px] font-poppins text-sm font-medium leading-relaxed text-[#7B7B7B] sm:text-base lg:text-lg">
              Most young professionals understand the concept of making money, but
              very few have a documented system for keeping it and multiplying it.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-lora text-lg font-bold text-[#151515] sm:text-xl">
              What You Will Learn
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {learnItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-[#005D51]/10 bg-[#E8FAF7] px-4 py-5 sm:px-5 sm:py-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#005D51]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.icon} alt="" width={24} height={24} />
                  </div>
                  <span className="h-0.5 w-8 rounded-full bg-[#005D51]" aria-hidden />
                  <p className="font-poppins text-sm font-medium leading-snug text-[#151515] sm:text-base">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href={WORKSHOP_REGISTER_URL}
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-[#E63715] px-8 font-poppins text-base font-semibold text-white transition-colors hover:bg-[#c42e12] sm:h-14 sm:text-lg"
            >
              Register Now
            </Link>
            <p className="flex items-center gap-2 font-poppins text-sm font-medium text-[#7B7B7B]">
              <HiLockClosed className="h-4 w-4 shrink-0 text-[#005D51]" aria-hidden />
              Limited Slots Available
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl sm:rounded-3xl">
            <Image
              src="/exclusive-workshop.webp"
              alt="Young professionals in a financial literacy workshop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 560px"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
