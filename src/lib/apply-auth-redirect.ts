/** OAuth / magic-link return path must stay on-site and out of admin. */
export function safeApplicantAuthRedirectPath(
  next: string | null | undefined,
): string {
  const fallback = '/apply/form';
  if (!next) return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;
  const pathname = trimmed.split('?')[0] ?? '';
  if (!pathname.startsWith('/apply')) return fallback;
  if (pathname.startsWith('/admin')) return fallback;
  return trimmed.length > 512 ? fallback : trimmed;
}
