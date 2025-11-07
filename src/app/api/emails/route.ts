import { NextResponse } from 'next/server';

import { newsletterSchema } from '@/lib/validation/newsletter';
import { strapiClient } from '@/lib/strapiClient';

const collectionName = process.env.STRAPI_EMAIL_COLLECTION ?? 'emails';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  try {
    const result = await strapiClient.collection(collectionName).create({
      email,
    });

    return NextResponse.json(
      {
        ok: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription failed:', error);

    const status =
      error instanceof Error && 'status' in error
        ? Number((error as { status?: number }).status) || 500
        : 500;

    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to subscribe';

    return NextResponse.json(
      {
        error: 'Failed to subscribe',
        message,
      },
      { status }
    );
  }
}
