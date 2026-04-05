import { NextResponse } from 'next/server';

import { siteSettings } from '@/lib/site-settings-store';

export async function GET() {
  return NextResponse.json(siteSettings.stats ?? []);
}
