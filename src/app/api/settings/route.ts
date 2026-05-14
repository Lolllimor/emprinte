import { NextResponse } from 'next/server';

import { requireLandingAdminApiAuth } from '@/lib/supabase-api-auth';
import { patchStatsById, siteSettings } from '@/lib/site-settings-store';
import { settingsWriteSchema } from '@/lib/validation/admin';

export async function GET() {
  return NextResponse.json(siteSettings);
}

async function writeSettings(request: Request) {
  const denied = await requireLandingAdminApiAuth();
  if (!denied.ok) return denied.response;

  const body = await request.json().catch(() => null);

  const parsed = settingsWriteSchema.safeParse(body);

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

  let nextStats: typeof siteSettings.stats | undefined;
  if (data.stats !== undefined && data.stats.length > 0) {
    const patched = patchStatsById(siteSettings.stats, data.stats);
    if (!patched.ok) {
      return NextResponse.json(
        {
          error: patched.error,
          ...(patched.message ? { message: patched.message } : {}),
        },
        { status: patched.status },
      );
    }
    nextStats = patched.stats;
  }

  if (data.navigationLinks) siteSettings.navigationLinks = data.navigationLinks;
  if (data.footerNavigation)
    siteSettings.footerNavigation = data.footerNavigation;
  if (data.socialMediaLinks)
    siteSettings.socialMediaLinks = data.socialMediaLinks;
  if (data.contactInfo) siteSettings.contactInfo = data.contactInfo;
  if (nextStats !== undefined) siteSettings.stats = nextStats;

  return NextResponse.json({ ok: true, data: siteSettings });
}

export async function PATCH(request: Request) {
  return writeSettings(request);
}

export async function PUT(request: Request) {
  return writeSettings(request);
}
