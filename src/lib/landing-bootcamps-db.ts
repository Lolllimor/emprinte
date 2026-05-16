import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';

export type PublicBootcampRow = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: string;
  guest_price: number;
  created_at: string;
};

export type BootcampPublic = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: string;
  guestPriceNaira: number;
};

function rowToPublic(row: PublicBootcampRow): BootcampPublic {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    startDate: row.start_date,
    endDate: row.end_date,
    durationDays: row.duration_days,
    status: row.status,
    guestPriceNaira: Number(row.guest_price) || 0,
  };
}

export async function fetchBootcampById(id: string): Promise<BootcampPublic | null> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from('bootcamps')
    .select(
      'id, title, description, start_date, end_date, duration_days, status, guest_price, created_at',
    )
    .eq('id', id.trim())
    .maybeSingle<PublicBootcampRow>();

  if (error || !data) {
    if (error) console.error('[bootcamps] fetch by id failed', error);
    return null;
  }
  return rowToPublic(data);
}

export async function listBootcampsForAdmin(): Promise<PublicBootcampRow[]> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from('bootcamps')
    .select(
      'id, title, description, start_date, end_date, duration_days, status, guest_price, created_at',
    )
    .order('start_date', { ascending: false });

  if (error) {
    console.error('[bootcamps] admin list failed', error);
    return [];
  }
  return data ?? [];
}

export function bootcampRegistrationOpen(status: string): boolean {
  return status === 'upcoming' || status === 'active';
}
