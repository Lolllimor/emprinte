import { NextResponse } from 'next/server';

import { newsletterSchema } from '@/lib/validation/newsletter';
import { requireEditApiAuth } from '@/lib/edit-api-auth';

// In-memory store for newsletter signups (until a real backend/DB is wired up).
type SubscriberRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
};

let subscribers: SubscriberRow[] = [];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function GET(request: Request) {
  const denied = requireEditApiAuth(request);
  if (denied) return denied;

  const rows = [...subscribers].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { fullName, email, phone } = parsed.data;
  const emailKey = normalizeEmail(email);

  if (
    subscribers.some((s) => normalizeEmail(s.email) === emailKey)
  ) {
    return NextResponse.json(
      { error: 'Already subscribed', message: 'This email is already on the list.' },
      { status: 409 },
    );
  }

  const row: SubscriberRow = {
    id: crypto.randomUUID(),
    fullName,
    email: email.trim(),
    phone,
    createdAt: new Date().toISOString(),
  };

  subscribers = [row, ...subscribers];

  return NextResponse.json(
    {
      ok: true,
      data: row,
    },
    { status: 201 },
  );
}
