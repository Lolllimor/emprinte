import { IoStar } from 'react-icons/io5';
import { testimonials } from '@/constants/data';
import { Badge } from '../ui';

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full bg-white px-6 py-16 lg:py-24 xl:px-[120px] lg:px-[75px]"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Badge>Testimonials</Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-[#015B51] font-lora leading-[1.1] max-w-[600px]">
            Here is what our Readers have to say
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 xl:mx-0 xl:px-0">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="shrink-0 w-[340px] md:w-[380px] flex flex-col gap-4 p-6 rounded-2xl bg-[#142218]"
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
                  <IoStar
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-white/90 font-campton text-sm leading-relaxed flex-1">
                {testimonial.text}
              </p>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-white font-semibold font-campton text-base uppercase">
                  {testimonial.name}
                </span>
                <span className="text-white/70 font-campton text-sm">
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
