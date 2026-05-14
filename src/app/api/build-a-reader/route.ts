import { NextResponse } from 'next/server';

import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';
import { buildAReaderSchema } from '@/lib/validation/admin';

let buildAReader = {
  booksCollected: 119,
  totalBooks: 500,
  pricePerBook: 2500,
};

export async function GET() {
  return NextResponse.json(buildAReader);
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

  buildAReader = parsed.data;

  return NextResponse.json({ ok: true, data: buildAReader });
}

export async function PATCH(request: Request) {
  return writeBuildAReader(request);
}

export async function PUT(request: Request) {
  return writeBuildAReader(request);
}
