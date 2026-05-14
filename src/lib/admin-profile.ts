import type { User } from '@supabase/supabase-js';

import { AUTH_API } from '@/constants/auth-api';
import { getApiUrl, isBackendApiConfigured } from '@/lib/api';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export type AdminProfile = {
  name: string;
  email: string;
  phone: string;
};

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? '';
  if (!local) return 'Admin';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function profileFromSupabaseUser(user: User | null): AdminProfile {
  if (!user) {
    return { name: '', email: '', phone: '' };
  }
  const meta =
    user.user_metadata && typeof user.user_metadata === 'object'
      ? (user.user_metadata as Record<string, unknown>)
      : {};
  const email = user.email?.trim() ?? '';
  const given = pickString(meta, 'given_name', 'givenName');
  const family = pickString(meta, 'family_name', 'familyName');
  const combinedName = [given, family].filter(Boolean).join(' ');
  const name =
    pickString(meta, 'name', 'full_name', 'fullName', 'displayName') ||
    combinedName ||
    (email ? displayNameFromEmail(email) : '');
  const phone = pickString(meta, 'phone', 'phone_number', 'phoneNumber', 'mobile');

  return { name, email, phone };
}

function parseApiProfile(data: unknown): Partial<AdminProfile> {
  if (!data || typeof data !== 'object') return {};
  const o = data as Record<string, unknown>;
  const user =
    o.user && typeof o.user === 'object'
      ? (o.user as Record<string, unknown>)
      : o;
  return {
    name: pickString(user, 'name', 'fullName', 'full_name'),
    email: pickString(user, 'email', 'user_email'),
    phone: pickString(user, 'phone', 'phoneNumber', 'phone_number', 'mobile'),
  };
}

function mergeProfile(
  base: AdminProfile,
  patch: Partial<AdminProfile>,
): AdminProfile {
  return {
    name: patch.name?.trim() || base.name,
    email: patch.email?.trim() || base.email,
    phone: patch.phone?.trim() || base.phone,
  };
}

/** Profile from Supabase user; optional legacy GET auth/me when NEXT_PUBLIC_API_URL is set. */
export async function loadAdminProfile(): Promise<AdminProfile> {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const base = profileFromSupabaseUser(user);
    if (!isBackendApiConfigured() || !user) {
      return base;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) return base;
    try {
      const res = await fetch(getApiUrl(AUTH_API.me), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return base;
      const data = await res.json().catch(() => null);
      return mergeProfile(base, parseApiProfile(data));
    } catch {
      return base;
    }
  } catch {
    return { name: '', email: '', phone: '' };
  }
}

export function profileInitial(user: User | null): string {
  const p = profileFromSupabaseUser(user);
  const source = p.name.trim() || p.email.trim() || '?';
  const letter = source.trim().charAt(0);
  return letter ? letter.toUpperCase() : '?';
}
