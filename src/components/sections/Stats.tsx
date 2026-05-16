'use client';
import { useEffect, useState } from 'react';

import { StatsList } from './StatsList';
import { getSameOriginApiUrl } from '@/lib/api';
import { StatsProps } from '@/types';

export function Stats() {
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<StatsProps[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getSameOriginApiUrl('stats'));
        if (!res.ok) {
          setStats([]);
          return;
        }
        const data = await res.json().catch(() => []);
        setStats(Array.isArray(data) ? data : []);
      } catch {
        setStats([]);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section id="about" className="relative w-full">
      <StatsList stats={stats} loading={statsLoading} />
    </section>
  );
}
