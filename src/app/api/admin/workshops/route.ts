import { NextResponse } from 'next/server';

import { listWorkshopsForAdmin } from '@/lib/landing-workshops-db';
import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';

export async function GET() {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const workshops = await listWorkshopsForAdmin();
  return NextResponse.json(
    { workshops },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
