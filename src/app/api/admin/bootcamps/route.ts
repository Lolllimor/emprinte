import { NextResponse } from 'next/server';

import { listBootcampsForAdmin } from '@/lib/landing-bootcamps-db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

export async function GET() {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const bootcamps = await listBootcampsForAdmin();
  return NextResponse.json(
    { bootcamps },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
