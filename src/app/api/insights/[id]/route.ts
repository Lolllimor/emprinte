import { NextResponse } from 'next/server';

import { findInsightById } from '@/lib/insights-store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const item = findInsightById(id.trim());
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}
