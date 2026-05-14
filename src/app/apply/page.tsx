import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SIGN_UP = '/apply/sign-up?next=/apply/form';
const FORM = '/apply/form';

/**
 * `/apply` is a short entry: signed-in applicants go to the form; everyone else starts on
 * sign-up, where expectations and steps are shown above the account form.
 */
export default async function ApplyPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (user) {
    redirect(FORM);
  }
  redirect(SIGN_UP);
}
