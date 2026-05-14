import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';

export type BuildAReaderPayload = {
  booksCollected: number;
  totalBooks: number;
  pricePerBook: number;
};

type Row = {
  books_collected: number;
  total_books: number;
  price_per_book: number;
};

export async function fetchBuildAReaderRow(): Promise<BuildAReaderPayload | null> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from('landing_build_a_reader')
    .select('books_collected, total_books, price_per_book')
    .eq('id', 1)
    .maybeSingle<Row>();

  if (error || !data) return null;

  return {
    booksCollected: data.books_collected,
    totalBooks: data.total_books,
    pricePerBook: data.price_per_book,
  };
}

export async function upsertBuildAReaderRow(
  payload: BuildAReaderPayload,
): Promise<boolean> {
  const sb = createSupabaseServiceRoleClient();
  if (!sb) return false;

  const { error } = await sb.from('landing_build_a_reader').upsert(
    {
      id: 1,
      books_collected: payload.booksCollected,
      total_books: payload.totalBooks,
      price_per_book: payload.pricePerBook,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  return !error;
}
