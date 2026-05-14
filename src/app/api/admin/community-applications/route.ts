import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

/**
 * List membership applications for landing admins (service role; not exposed to applicants).
 */
export async function GET() {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY to load applications.',
      },
      { status: 503 },
    );
  }

  const { data, error } = await service
    .schema('landing')
    .from('community_applications')
    .select(
      [
        'id',
        'submitted_at',
        'email',
        'first_name',
        'last_name',
        'phone',
        'location',
        'plan_choice',
        'gender',
        'professional_status',
      ].join(', '),
    )
    .order('submitted_at', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json(
      { error: 'Could not load applications.', message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ applications: data ?? [] });
}
