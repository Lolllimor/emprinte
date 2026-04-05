import { AUTH_API } from '@/constants/auth-api';
import { getApiUrl, getEditTokenForClient, isBackendApiConfigured } from '@/lib/api';

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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    const json = atob(base64);
    const data = JSON.parse(json) as unknown;
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? '';
  if (!local) return 'Admin';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Readable profile from JWT claims (no verify—token is already yours). */
export function profileFromJwtToken(token: string): AdminProfile {
  if (!token.trim()) {
    return { name: '', email: '', phone: '' };
  }
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { name: '', email: '', phone: '' };
  }
  const email = pickString(payload, 'email', 'user_email', 'userEmail');
  const emailGuess =
    email ||
    (typeof payload.sub === 'string' && payload.sub.includes('@')
      ? payload.sub
      : '');
  const given = pickString(payload, 'given_name', 'givenName');
  const family = pickString(payload, 'family_name', 'familyName');
  const combinedName = [given, family].filter(Boolean).join(' ');
  const name =
    pickString(payload, 'name', 'fullName', 'full_name', 'displayName', 'preferred_username') ||
    combinedName ||
    (emailGuess ? displayNameFromEmail(emailGuess) : '');

  const phone = pickString(
    payload,
    'phone',
    'phoneNumber',
    'phone_number',
    'mobile',
    'tel',
  );

  return {
    name,
    email: emailGuess,
    phone,
  };
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

/** JWT claims first; optional GET auth/me merges in when the API exists. */
export async function loadAdminProfile(): Promise<AdminProfile> {
  const token = getEditTokenForClient();
  const base = profileFromJwtToken(token);
  if (!token.trim() || !isBackendApiConfigured()) {
    return base;
  }
  try {
    const res = await fetch(getApiUrl(AUTH_API.me), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return base;
    const data = await res.json().catch(() => null);
    return mergeProfile(base, parseApiProfile(data));
  } catch {
    return base;
  }
}

export function profileInitial(token: string): string {
  const p = profileFromJwtToken(token);
  const source = p.name.trim() || p.email.trim() || '?';
  const letter = source.trim().charAt(0);
  return letter ? letter.toUpperCase() : '?';
}
