'use client';
import { useEffect, useState } from 'react';
import { IoStar } from 'react-icons/io5';

import { TestimonialCardSkeleton } from './TestimonialCardSkeleton';
import { getSameOriginApiUrl } from '@/lib/api';
import { Testimonial } from '@/types';
import { Badge } from '../ui';

const SKELETON_COUNT = 3;

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(getSameOriginApiUrl('testimonials'));
        if (!res.ok) {
          setTestimonials([]);
          return;
        }
        const data = await res.json().catch(() => []);
        setTestimonials(Array.isArray(data) ? data : []);
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);
  return (
    <section
      id="testimonials"
      className="w-full overflow-x-visible bg-white py-14 lg:py-20"
    >
      {/* Viewport-wide band so the headline can run to the right edge of the screen (not max-w clipped). */}
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-[75px] xl:px-[120px]">
          <Badge>Testimonials</Badge>
        </div>
        <div className="pl-6 pr-0 pt-2 lg:pl-[75px] lg:pr-0 lg:pt-3 xl:pl-[120px] xl:pr-0">
          <h2 className="max-w-none font-lora text-4xl font-bold leading-[1.08] tracking-tight text-[#005D51] md:text-5xl lg:text-6xl xl:text-[clamp(2.75rem,3.2vw+1.25rem,3.75rem)]">
            Here is what our Readers have to say
          </h2>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[1200px] px-6 sm:mt-8 lg:mt-8 lg:px-[75px] xl:mt-10 xl:px-[120px]">
        <div
          className="hide-scrollbar -mx-6 flex gap-6 overflow-x-auto overflow-y-hidden px-6 pb-4 xl:mx-0 xl:px-0"
          aria-busy={loading}
          aria-label={loading ? 'Loading testimonials' : undefined}
        >
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <TestimonialCardSkeleton key={i} />
              ))
            : testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl bg-[#142218] p-6 md:w-[380px]"
                >
                  <div className="flex gap-1">
                    {Array.from({
                      length: testimonial.rating ?? 5,
                    }).map((_, i) => (
                      <IoStar
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-white/90 font-poppins text-sm leading-relaxed flex-1">
                    {testimonial.text}
                  </p>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-white font-semibold font-poppins text-base uppercase">
                      {testimonial.name}
                    </span>
                    <span className="text-white/70 font-poppins text-sm">
                      {testimonial.title}
                    </span>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
