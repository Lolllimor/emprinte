import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { workshopRegistrationSchema } from '@/lib/validation/workshop-registration';

type WorkshopRow = {
  id: string;
  fullName: string;
  email: string;
  primaryGoal: string;
  isMember: boolean;
  financialCategory: string;
  financeChallenges: string;
  workshopQuestions: string;
  submittedAt: string;
};

let memoryRegistrations: WorkshopRow[] = [];

function isSupabaseReady(): boolean {
  return Boolean(createSupabaseServiceRoleClient());
}

function allowMemoryStore(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.ALLOW_WORKSHOP_MEMORY_FALLBACK === 'true'
  );
}

function misconfiguredResponse() {
  return NextResponse.json(
    {
      error: 'Workshop registration is not configured',
      message:
        'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, apply the workshop registrations migration, and expose the landing schema.',
    },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = workshopRegistrationSchema.safeParse(body);

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
  const row = {
    full_name: data.fullName,
    email: data.email.trim().toLowerCase(),
    primary_goal: data.primaryGoal,
    is_member: data.isMember === 'yes',
    financial_category: data.financialCategory,
    finance_challenges: data.financeChallenges,
    workshop_questions: data.workshopQuestions,
  };

  if (isSupabaseReady()) {
    const admin = createSupabaseServiceRoleClient()!;
    const { error } = await admin
      .schema('landing')
      .from('workshop_registrations')
      .insert(row);

    if (error) {
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (allowMemoryStore()) {
    memoryRegistrations.push({
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      primaryGoal: data.primaryGoal,
      isMember: data.isMember === 'yes',
      financialCategory: data.financialCategory,
      financeChallenges: data.financeChallenges,
      workshopQuestions: data.workshopQuestions,
      submittedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  return misconfiguredResponse();
}
