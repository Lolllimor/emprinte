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
};

const noStore = { 'Cache-Control': 'no-store, max-age=0' } as const;

export async function GET() {
  const fromDb = await fetchBuildAReaderRow();
  if (fromDb) {
    buildAReaderMemory = fromDb;
    return NextResponse.json(fromDb, { headers: noStore });
  }
  return NextResponse.json(buildAReaderMemory, { headers: noStore });
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

  const data = parsed.data;
  await upsertBuildAReaderRow(data);
  buildAReaderMemory = data;

  return NextResponse.json({ ok: true, data }, { headers: noStore });
}

export async function PATCH(request: Request) {
  return writeBuildAReader(request);
}

export async function PUT(request: Request) {
  return writeBuildAReader(request);
}
