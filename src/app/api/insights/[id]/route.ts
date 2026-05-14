import { NextResponse } from 'next/server';

import {
  fetchAllLandingInsightsFromDb,
  updateLandingInsightInDb,
} from '@/lib/landing-insights-db';
import { findInsightById, replaceInsight } from '@/lib/insights-store';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';
import { insightSchema } from '@/lib/validation/admin';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const idTrimmed = id.trim();
  const rows = await fetchAllLandingInsightsFromDb();
  if (rows !== null) {
    const found = rows.find((r) => r.id === idTrimmed);
    if (!found) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  const item = findInsightById(idTrimmed);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const { id } = await context.params;
  const idTrimmed = id?.trim();
  if (!idTrimmed) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = insightSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const {
    title,
    description,
    date,
    image,
    href,
    body: articleBody,
    authorName,
    authorRole,
  } = parsed.data;

  const item = {
    id: idTrimmed,
    title,
    description,
    date,
    image,
    ...(articleBody ? { body: articleBody } : {}),
    ...(href ? { href } : {}),
    ...(authorName ? { authorName } : {}),
    ...(authorRole ? { authorRole } : {}),
  };

  const rows = await fetchAllLandingInsightsFromDb();
  if (rows !== null) {
    if (!rows.some((r) => r.id === idTrimmed)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const ok = await updateLandingInsightInDb(item);
    if (!ok) {
      return NextResponse.json(
        { error: 'Failed to update article in the database.' },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, data: item });
  }

  if (!findInsightById(idTrimmed)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  replaceInsight(item);

  return NextResponse.json({ ok: true, data: item });
}
