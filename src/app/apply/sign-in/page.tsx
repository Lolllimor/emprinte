import { redirect } from 'next/navigation';

/** Legacy path: send users to the sign-up screen. */
export default async function ApplySignInRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const u = new URLSearchParams();
  const next = sp.next;
  const err = sp.error;
  if (typeof next === 'string') u.set('next', next);
  if (typeof err === 'string') u.set('error', err);
  const q = u.toString();
  redirect(`/apply/sign-up${q ? `?${q}` : ''}`);
}
