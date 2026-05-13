import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { isLandingAdmin } from '@/lib/landing-admin';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith('/admin');
  const needsApplicantAuth =
    pathname === '/apply/form' || pathname.startsWith('/apply/form/');

  if (needsApplicantAuth && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/apply/sign-up';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const publicAdminPrefixes = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/admin/otp',
    '/admin/accept-invite',
    '/admin/update-password',
    '/admin/auth/callback',
  ];
  const isPublicAdmin = publicAdminPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isAdminArea && !isPublicAdmin) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (!isLandingAdmin(user)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('error', 'not_allowed');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
