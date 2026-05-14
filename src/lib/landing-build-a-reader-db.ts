import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';

export type BuildAReaderPayload = {
  booksCollected: number;
  totalBooks: number;
  pricePerBook: number;
  slideshowUrls: string[];
};

type Row = {
  books_collected: number;
  total_books: number;
  price_per_book: number;
  slideshow_urls?: unknown;
};

function parseSlideshowUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s))
    .slice(0, 5);
}

export async function fetchBuildAReaderRow(): Promise<BuildAReaderPayload | null> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from('landing_build_a_reader')
    .select('books_collected, total_books, price_per_book, slideshow_urls')
    .eq('id', 1)
    .maybeSingle<Row>();

  if (error) {
    console.error('[landing_build_a_reader] select failed', error);
    return null;
  }
  if (!data) return null;

  return {
    booksCollected: data.books_collected,
    totalBooks: data.total_books,
    pricePerBook: data.price_per_book,
    slideshowUrls: parseSlideshowUrls(data.slideshow_urls),
  };
}

export async function upsertBuildAReaderRow(
  payload: BuildAReaderPayload,
): Promise<boolean> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return false;

  const slides = parseSlideshowUrls(payload.slideshowUrls);

  const { error } = await sb.from('landing_build_a_reader').upsert(
    {
      id: 1,
      books_collected: payload.booksCollected,
      total_books: payload.totalBooks,
      price_per_book: payload.pricePerBook,
      slideshow_urls: slides,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) {
    console.error('[landing_build_a_reader] upsert failed', error);
    return false;
  }
  return true;
}
