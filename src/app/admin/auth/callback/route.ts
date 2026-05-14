import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/** OAuth return path: same site, under /admin only. */
function safeAdminOAuthNext(next: string | null): string {
  const fallback = '/admin';
  if (!next) return fallback;
  const t = next.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return fallback;
  if (!t.startsWith('/admin')) return fallback;
  if (t.includes('..')) return fallback;
  return t.length > 512 ? fallback : t;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = safeAdminOAuthNext(requestUrl.searchParams.get('next'));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!code || !url || !key) {
    return NextResponse.redirect(
      new URL('/admin/login?error=auth', requestUrl.origin),
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  return NextResponse.redirect(
    new URL('/admin/login?error=auth', requestUrl.origin),
  );
}
