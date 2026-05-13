/**
 * Homepage and CTAs should open the web membership application.
 *
 * - Default: `/apply` (same origin — correct for local dev and most hosts).
 * - Production: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.emprintereaders.com`)
 *   so the link is absolute and matches your canonical domain.
 * - Override: set `NEXT_PUBLIC_APPLY_URL` to the full apply URL if needed.
 */
export function membershipApplyHref(): string {
  const explicit = process.env.NEXT_PUBLIC_APPLY_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, '');
  if (site) {
    return `${site}/apply`;
  }
  return '/apply';
}
