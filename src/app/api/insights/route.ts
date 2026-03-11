import { NextResponse } from 'next/server';

import { insightSchema } from '@/lib/validation/admin';
// In-memory store for admin-created insights (until backend is wired up).
// In production, replace with database/API calls.
let adminInsights: Array<{
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}> = [];

export async function GET() {
  const all = [...adminInsights];
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = insightSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { title, description, date, image, href } = parsed.data;

  const id = String(Date.now());
  const item = {
    id,
    date,
    title,
    description,
    image,
    ...(href ? { href } : {}),
  };

  adminInsights = [item, ...adminInsights];

  return NextResponse.json({ ok: true, data: item }, { status: 201 });
}
