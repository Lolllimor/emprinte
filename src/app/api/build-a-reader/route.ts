import { NextResponse } from 'next/server';

import {
  fetchBuildAReaderRow,
  upsertBuildAReaderRow,
} from '@/lib/landing-build-a-reader-db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';
import { buildAReaderSchema } from '@/lib/validation/admin';

/** In-process fallback when Supabase is not configured or DB read fails. */
let buildAReaderMemory = {
  booksCollected: 119,
  totalBooks: 500,
  pricePerBook: 2500,
  slideshowUrls: [] as string[],
};

const noStore = { 'Cache-Control': 'no-store, max-age=0' } as const;

function normalizeResponse(
  body: typeof buildAReaderMemory,
): typeof buildAReaderMemory {
  return {
    ...body,
    slideshowUrls: Array.isArray(body.slideshowUrls)
      ? body.slideshowUrls
          .filter((s) => typeof s === 'string' && /^https?:\/\//i.test(s.trim()))
          .map((s) => s.trim())
          .slice(0, 5)
      : [],
  };
}

export async function GET() {
  const fromDb = await fetchBuildAReaderRow();
  if (fromDb) {
    buildAReaderMemory = normalizeResponse(fromDb);
    return NextResponse.json(buildAReaderMemory, { headers: noStore });
  }
  return NextResponse.json(normalizeResponse(buildAReaderMemory), {
    headers: noStore,
  });
}

async function writeBuildAReader(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const body = await request.json().catch(() => null);

  const parsed = buildAReaderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = normalizeResponse(parsed.data);
  const ok = await upsertBuildAReaderRow(data);
  if (!ok) {
    return NextResponse.json(
      { error: 'Failed to save Build a Reader to the database.' },
      { status: 500 },
    );
  }
  buildAReaderMemory = data;

  return NextResponse.json({ ok: true, data }, { headers: noStore });
}

export async function PATCH(request: Request) {
  return writeBuildAReader(request);
}

export async function PUT(request: Request) {
  return writeBuildAReader(request);
}
