import { NextResponse } from 'next/server';

import { requireEditApiAuth } from '@/lib/edit-api-auth';
import { updateStatAtIndex } from '@/lib/site-settings-store';
import { statUpdateSchema } from '@/lib/validation/admin';

function parseStatIndex(id: string): number | null {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = requireEditApiAuth(request);
  if (denied) return denied;

  const { id } = await context.params;
  const index = parseStatIndex(id?.trim() ?? '');
  if (index === null) {
    return NextResponse.json(
      { error: 'Invalid id', message: 'Expected a non-negative integer index.' },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = statUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const result = updateStatAtIndex(index, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: result.stat });
}
