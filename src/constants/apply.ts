const APPLY_SIGN_UP_REL = '/apply/sign-up?next=/apply/form';

/**
 * Legacy intake links (Google Forms, Bitly, etc.) must not override the in-app
 * apply flow when mistakenly left in `NEXT_PUBLIC_APPLY_URL`.
 */
function shouldIgnoreExplicitApplyUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host === 'forms.gle') return true;
    if (host === 'docs.google.com' && u.pathname.includes('/forms/')) return true;
    if (host === 'bit.ly' || host === 'www.bit.ly' || host.endsWith('.bit.ly')) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Homepage and CTAs should open account creation for the membership application.
 *
 * - Default: `/apply/sign-up?next=/apply/form` (same origin). `/apply` redirects here or to the form if already signed in.
 * - Production: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.emprintereaders.com`)
 *   so the link is absolute and matches your canonical domain.
 * - Override: set `NEXT_PUBLIC_APPLY_URL` to the full apply URL on your site. Short links
 *   (bit.ly) and Google Form URLs are ignored so the button always uses your domain + `/apply/...`.
 */
export function membershipApplyHref(): string {
  const explicit = process.env.NEXT_PUBLIC_APPLY_URL?.trim();
  if (explicit && !shouldIgnoreExplicitApplyUrl(explicit)) {
    return explicit.replace(/\/$/, '');
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, '');
  if (site) {
    return `${site}${APPLY_SIGN_UP_REL}`;
  }
  return APPLY_SIGN_UP_REL;
}
