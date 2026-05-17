import type { BookFormat } from './enums';

/** `public.books` row (snake_case — database contract). */
export interface BookRow {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  pdf_url: string | null;
  format: BookFormat | null;
  page_count: number | null;
  progress_page: number | null;
  progress_percentage: number | null;
  progress_locator: string | null;
  file_hash: string | null;
  last_read_at: string | null;
  summary: string | null;
  published_year: number | null;
  is_community_book: boolean | null;
  created_at: string;
}

/**
 * Mobile app library shape (camelCase). Map from {@link BookRow} at the data layer.
 * See `docs/CONTRACT.md` § Books.
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverColor?: string;
  pdfUrl: string;
  format?: BookFormat;
  pageCount: number;
  progressPage?: number;
  progressLocator?: string;
  fileHash?: string;
  uploadPending?: boolean;
  uploadFailed?: boolean;
  uploadErrorMessage?: string;
  progress: number;
  lastReadAt?: string;
  summary?: string;
  publishedYear?: number;
}
