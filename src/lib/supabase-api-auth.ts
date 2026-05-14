import { NextResponse } from 'next/server';

import { isLandingAdmin } from '@/lib/landing-admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function requireLandingAdminApiAuth(): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: 'Server misconfigured',
          message:
            'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        },
        { status: 503 },
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isLandingAdmin(user)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: 'Unauthorized',
          message:
            'Sign in with an app admin account (role admin), a user with landing_admin in App metadata, or an email listed in LANDING_ADMIN_EMAILS.',
        },
        { status: 401 },
      ),
    };
  }

  return { ok: true };
}
