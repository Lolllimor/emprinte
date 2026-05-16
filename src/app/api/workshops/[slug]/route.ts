import { NextResponse } from 'next/server';

import { fetchWorkshopBySlug } from '@/lib/landing-workshops-db';

const noStore = { 'Cache-Control': 'no-store, max-age=0' } as const;

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const workshop = await fetchWorkshopBySlug(slug);

  if (!workshop) {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
  }

  if (!workshop.registrationOpen) {
    return NextResponse.json(
      { error: 'Registration closed', workshop },
      { status: 403, headers: noStore },
    );
  }

  return NextResponse.json({ workshop }, { headers: noStore });
}
