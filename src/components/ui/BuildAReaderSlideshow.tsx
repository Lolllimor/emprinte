'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

const FALLBACK_SRC = '/build-a-reader-image.png';
const INTERVAL_MS = 6000;

type BuildAReaderSlideshowProps = {
  /** Remote https URLs only; empty uses built-in static hero. */
  urls?: string[];
  /**
   * When true (Build a Reader row), the frame grows with the flex row so the image
   * area lines up from the pill row through the CTA row on large screens.
   */
  fillColumn?: boolean;
};

export function BuildAReaderSlideshow({ urls, fillColumn = false }: BuildAReaderSlideshowProps) {
  const remoteList = useMemo(
    () =>
      (urls ?? [])
        .filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u.trim()))
        .map((u) => u.trim()),
    [urls],
  );

  const slides = remoteList.length > 0 ? remoteList.slice(0, 5) : [FALLBACK_SRC];
  const slidesKey = remoteList.join('\0');

  const [index, setIndex] = useState(0);
  const [autoPlayEpoch, setAutoPlayEpoch] = useState(0);

  const resetAutoPlay = useCallback(() => {
    setAutoPlayEpoch((n) => n + 1);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [slidesKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [slides.length, slidesKey, autoPlayEpoch]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
      resetAutoPlay();
    },
    [slides.length, resetAutoPlay],
  );

  const src = slides[index] ?? FALLBACK_SRC;
  const isRemote = /^https?:\/\//i.test(src);

  return (
    <div
      className={
        fillColumn
          ? 'relative mx-auto flex h-full min-h-[260px] w-full min-w-0 max-w-[550px] flex-col overflow-hidden rounded-xl bg-[#dfecea] shadow-[0_12px_36px_-20px_rgba(20,34,24,0.28)] ring-1 ring-[#005D51]/10 lg:mx-0 lg:min-h-0 lg:max-w-none lg:self-stretch'
          : 'relative mx-auto w-full min-w-0 max-w-[550px] overflow-hidden rounded-xl bg-[#dfecea] shadow-[0_12px_36px_-20px_rgba(20,34,24,0.28)] ring-1 ring-[#005D51]/10'
      }
    >
      <div
        className={
          fillColumn
            ? 'relative min-h-0 w-full flex-1 lg:min-h-[200px]'
            : 'relative h-[min(680px,78vh)] w-full min-h-[220px] sm:min-h-[280px]'
        }
      >
        <Image
          key={src}
          src={src}
          alt="Build a Reader"
          fill
          sizes="(max-width: 1024px) 100vw, 550px"
          className="object-cover"
          priority={index === 0}
          unoptimized={isRemote}
        />

        {slides.length > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-24 bg-linear-to-t from-black/45 to-transparent" />
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-[#142218] shadow-md transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-[#142218] shadow-md transition hover:bg-white"
            >
              ›
            </button>
            <div
              className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5"
              role="tablist"
              aria-label="Slides"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setIndex(i);
                    resetAutoPlay();
                  }}
                  className={
                    i === index
                      ? 'h-2 w-6 rounded-full bg-white transition'
                      : 'h-2 w-2 rounded-full bg-white/55 transition hover:bg-white/85'
                  }
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
