import { NextResponse } from 'next/server';

import { testimonialsSchema } from '@/lib/validation/admin';
import { testimonials } from '@/constants/data';

let testimonialList = [...testimonials];

export async function GET() {
  return NextResponse.json(testimonialList);
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = testimonialsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  testimonialList = parsed.data;

  return NextResponse.json({ ok: true, data: testimonialList });
}
