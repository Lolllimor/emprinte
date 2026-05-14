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
      className="w-full bg-white px-6 py-16 lg:py-24 xl:px-[120px] lg:px-[75px]"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Badge>Testimonials</Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-[#005D51] font-lora leading-[1.1] max-w-[600px]">
            Here is what our Readers have to say
          </h2>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 xl:mx-0 xl:px-0"
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
                  className="shrink-0 w-[340px] md:w-[380px] flex flex-col gap-4 p-6 rounded-2xl bg-[#142218]"
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
