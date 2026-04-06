import { NextResponse } from 'next/server';

import { requireEditApiAuth } from '@/lib/edit-api-auth';
import {
  deleteInsight,
  findInsightById,
  getAllInsights,
  prependInsight,
  replaceInsight,
} from '@/lib/insights-store';
import { insightSchema, insightUpdateSchema } from '@/lib/validation/admin';

export async function GET() {
  return NextResponse.json(getAllInsights());
}

export async function POST(request: Request) {
  const denied = requireEditApiAuth(request);
  if (denied) return denied;

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
  } = parsed.data;

  const id = String(Date.now());
  const item = {
    id,
    date,
    title,
    description,
    image,
    ...(articleBody ? { body: articleBody } : {}),
    ...(href ? { href } : {}),
  };

  prependInsight(item);

  return NextResponse.json({ ok: true, data: item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = requireEditApiAuth(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);

  const parsed = insightUpdateSchema.safeParse(body);

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
    id,
    title,
    description,
    date,
    image,
    href,
    body: articleBody,
  } = parsed.data;

  if (!findInsightById(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const item = {
    id,
    title,
    description,
    date,
    image,
    ...(articleBody ? { body: articleBody } : {}),
    ...(href ? { href } : {}),
  };

  replaceInsight(item);

  return NextResponse.json({ ok: true, data: item });
}

export async function DELETE(request: Request) {
  const denied = requireEditApiAuth(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get('id');
  if (!id?.trim()) {
    return NextResponse.json({ error: 'id query required' }, { status: 400 });
  }

  if (!deleteInsight(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
