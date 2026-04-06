'use client';
import { useEffect, useId, useState } from 'react';

import { NewsletterSubscribeForm } from '@/components/sections/NewsletterSubscribeForm';
import { StatsList } from './StatsList';
import { getApiUrl } from '@/lib/api';
import { StatsProps } from '@/types';
import { Badge } from '../ui';

const FREE_DOWNLOAD_FORM_URL =
  'https://docs.google.com/spreadsheets/d/1j7vHUolxqpuPQl1UD8abgavr6E4gYxIeH0sXV6y85TE/edit?gid=0#gid=0';

export function Stats() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<StatsProps[]>([]);
  const downloadModalTitleId = useId();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('stats'));
        const data = await res.json();
        setStats(data);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!downloadModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDownloadModalOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [downloadModalOpen]);
  console.log(stats);
  return (
    <section id="about" className="w-full relative">
      <StatsList stats={stats} loading={statsLoading} />

      <div className="w-full h-[450px] bg-[url('/book.png')] bg-cover bg-center lg:h-[438px] xl:h-[617px] relative flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-[84px] p-6 md:p-0">
        <div className="flex flex-col gap-10 2xl:ml-auto xl:ml-[120px] lg:ml-[75px] md:ml-6 md:max-w-[1200px] 2xl:mx-auto w-full">
          <div className="flex flex-col gap-4">
            <Badge>Emprinte Growth Tracker 2026</Badge>

            <p className="text-4xl xl:text-6xl leading-snug font-bold text-[#015B51]  lg:max-w-[390px] xl:max-w-[469px] font-lora">
              Turn Clarity Into Measurable Progress
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className=" cursor-pointer lg:h-12 h-10 px-2.5 flex justify-center items-center gap-2.5 rounded-lg bg-[#015B51] lg:max-w-[400px] w-1/2"
          >
            <span className="lg:text-xl text-base leading-[150%] font-medium text-white font-campton">
              Download For Free
            </span>
          </button>
        </div>
      </div>

      {downloadModalOpen ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-[#142218]/65 backdrop-blur-[2px]"
            aria-label="Close download dialog"
            onClick={() => setDownloadModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={downloadModalTitleId}
            className="relative z-1 w-full max-w-[480px] max-h-[min(90vh,720px)] overflow-y-auto rounded-2xl border border-white/20 bg-[#0f1a12] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.45)] md:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 pr-2">
                <h2
                  id={downloadModalTitleId}
                  className="font-lora text-xl font-semibold leading-snug text-white md:text-2xl"
                >
                  Your free download
                </h2>
                <p className="font-campton text-sm leading-relaxed text-white/75 md:text-base">
                  Subscribe and get access to The Emprinte Growth Tracker 2026.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="shrink-0 rounded-lg px-2 py-1 font-campton text-sm font-medium text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#6FE19B]"
              >
                Close
              </button>
            </div>
            <NewsletterSubscribeForm
              idPrefix="download-free"
              onSuccess={() => {
                setDownloadModalOpen(false);
                window.open(
                  FREE_DOWNLOAD_FORM_URL,
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
