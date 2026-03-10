import { NextResponse } from 'next/server';

import { settingsSchema } from '@/lib/validation/admin';
import {
  navigationLinks,
  footerNavigation,
  socialMediaLinks,
  contactInfo,
  stats,
} from '@/constants/data';

// In-memory store (until backend is wired up).
// Defaults from constants.
let siteSettings = {
  navigationLinks: [...navigationLinks],
  footerNavigation: [...footerNavigation],
  socialMediaLinks: [...socialMediaLinks],
  contactInfo: { ...contactInfo, phone: [...contactInfo.phone] },
  stats: [...stats],
};

export async function GET() {
  return NextResponse.json(siteSettings);
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.navigationLinks) siteSettings.navigationLinks = data.navigationLinks;
  if (data.footerNavigation) siteSettings.footerNavigation = data.footerNavigation;
  if (data.socialMediaLinks) siteSettings.socialMediaLinks = data.socialMediaLinks;
  if (data.contactInfo) siteSettings.contactInfo = data.contactInfo;
  if (data.stats !== undefined) siteSettings.stats = data.stats;

  return NextResponse.json({ ok: true, data: siteSettings });
}
