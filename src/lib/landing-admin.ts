import type { User } from '@supabase/supabase-js';

/** Same rule as the mobile app (`adminUtils.isAdminUser`): role `admin` on the account. */
function isAppAdminUser(user: User | null): boolean {
  if (!user) return false;
  const app = user.app_metadata as Record<string, unknown> | undefined;
  if (app?.role === 'admin') return true;
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  if (meta?.role === 'admin') return true;
  const role = (user as { role?: string }).role;
  if (role === 'admin') return true;
  return false;
}

function isEmailAllowlisted(user: User | null): boolean {
  const email = user?.email?.trim().toLowerCase();
  if (!email) return false;
  const raw = process.env.LANDING_ADMIN_EMAILS?.trim();
  if (!raw) return false;
  const allowed = new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  return allowed.has(email);
}

/**
 * Who may use the landing web admin:
 * - Same admins as the app (`role: admin` on the user, matching the mobile app), or
 * - `app_metadata.landing_admin === true` (extra landing-only admins), or
 * - `LANDING_ADMIN_EMAILS` (comma-separated bootstrap list on the server).
 */
export function isLandingAdmin(user: User | null): boolean {
  if (!user) return false;
  if (isAppAdminUser(user)) return true;
  if (
    user.app_metadata &&
    typeof user.app_metadata === 'object' &&
    user.app_metadata.landing_admin === true
  ) {
    return true;
  }
  return isEmailAllowlisted(user);
}
