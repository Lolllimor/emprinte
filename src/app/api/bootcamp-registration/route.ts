import { NextResponse } from 'next/server';

import { bootcampRegistrationOpen, fetchBootcampById } from '@/lib/landing-bootcamps-db';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { bootcampRegistrationSchema } from '@/lib/validation/bootcamp-registration';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bootcampRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const bootcamp = await fetchBootcampById(data.bootcampId);
  if (!bootcamp) {
    return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
  }
  if (!bootcampRegistrationOpen(bootcamp.status)) {
    return NextResponse.json({ error: 'Registration closed' }, { status: 403 });
  }

  const admin = createSupabaseServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      {
        error: 'Bootcamp registration is not configured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY and expose the landing schema.',
      },
      { status: 503 },
    );
  }

  const { error } = await admin.schema('landing').from('bootcamp_registrations').insert({
    bootcamp_id: data.bootcampId,
    full_name: data.fullName,
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message,
  });

  if (error) {
    return NextResponse.json(
      { error: 'Database error', message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
