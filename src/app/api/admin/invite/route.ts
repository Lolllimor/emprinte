import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

const bodySchema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY to send invites.',
      },
      { status: 503 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    new URL(request.url).origin;
  const redirectTo = `${site}/admin/auth/callback?next=${encodeURIComponent('/admin')}`;

  const { error } = await service.auth.admin.inviteUserByEmail(
    parsed.data.email.toLowerCase(),
    {
      redirectTo,
    },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Invite failed' },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
