import { NextResponse } from 'next/server';

import { newsletterSchema } from '@/lib/validation/newsletter';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

// In-memory store only when Supabase is not configured (local dev by default).
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

function allowMemoryNewsletterStore(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.ALLOW_NEWSLETTER_MEMORY_FALLBACK === 'true'
  );
}

/** URL + service role: list and insert from the server (RLS bypass is OK here; keys stay on the server). */
function isNewsletterSupabaseReady(): boolean {
  return Boolean(createSupabaseServiceRoleClient());
}

function rowFromDb(row: {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}): SubscriberRow {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

function newsletterMisconfiguredResponse() {
  return NextResponse.json(
    {
      error: 'Newsletter is not configured',
      message:
        'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, apply the landing newsletter migration, and expose the landing schema in the Supabase API settings.',
    },
    { status: 503 },
  );
}

export async function GET() {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  if (isNewsletterSupabaseReady()) {
    const admin = createSupabaseServiceRoleClient()!;
    const { data, error } = await admin
      .schema('landing')
      .from('newsletter_subscribers')
      .select('id, full_name, email, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 },
      );
    }

    const rows = (data ?? []).map(rowFromDb);
    return NextResponse.json(rows);
  }

  if (allowMemoryNewsletterStore()) {
    const rows = [...subscribers].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return NextResponse.json(rows);
  }

  return newsletterMisconfiguredResponse();
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

  if (isNewsletterSupabaseReady()) {
    const admin = createSupabaseServiceRoleClient()!;
    const { data, error } = await admin
      .schema('landing')
      .from('newsletter_subscribers')
      .insert({
        full_name: fullName,
        email: email.trim(),
        phone,
      })
      .select('id, full_name, email, phone, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error: 'Already subscribed',
            message: 'This email is already on the list.',
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Database error', message: 'No row returned.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: rowFromDb(data),
      },
      { status: 201 },
    );
  }

  if (allowMemoryNewsletterStore()) {
    const emailKey = normalizeEmail(email);
    if (subscribers.some((s) => normalizeEmail(s.email) === emailKey)) {
      return NextResponse.json(
        {
          error: 'Already subscribed',
          message: 'This email is already on the list.',
        },
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

  return newsletterMisconfiguredResponse();
}
