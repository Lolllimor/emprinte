/**
 * Auth lives on the separate API (NEXT_PUBLIC_API_URL). This app only calls it.
 *
 * POST /api/auth/login
 *   Body: { email, password }
 *   200: JWT in { token } | { jwt } | { accessToken } | { access_token }
 *
 * POST /api/auth/invites (Bearer JWT)
 *   Body: { email: string } (adjust if your API expects more fields)
 *   Sends admin invite email from backend.
 *
 * GET /api/auth/invite-preview?token=
 *   Validates invite token (public).
 *
 * POST /api/auth/accept-invite
 *   Body: { token: string, password: string }
 *   Completes invite; no Bearer required.
 *
 * GET /api/auth/me (optional)
 *   Bearer JWT. If implemented, returns profile fields the JWT might omit—e.g.
 *   { name, email, phone } or { user: { ... } }. When missing or non-200, the
 *   UI falls back to claims parsed from the JWT.
 *
 * See also: forgot-password, resend-otp, verify-otp, reset-password below.
 * Backend must allow this frontend origin (CORS).
 */

export const AUTH_API = {
  login: 'auth/login',
  me: 'auth/me',
  invites: 'auth/invites',
  invitePreview: 'auth/invite-preview',
  acceptInvite: 'auth/accept-invite',
  forgotPassword: 'auth/forgot-password',
  resendOtp: 'auth/resend-otp',
  verifyOtp: 'auth/verify-otp',
  resetPassword: 'auth/reset-password',
} as const;

/** sessionStorage — email during OTP + resend flow */
export const SESSION_PW_RESET_EMAIL_KEY = 'emprinte_admin_pw_reset_email';

/** sessionStorage — from verify-otp until reset-password completes */
export const SESSION_PW_RESET_TOKEN_KEY = 'emprinte_admin_pw_reset_token';

export function jwtFromLoginResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  for (const key of ['token', 'jwt', 'accessToken', 'access_token'] as const) {
    const v = o[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}
