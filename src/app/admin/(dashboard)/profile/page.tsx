'use client';

import { useEffect, useState } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import type { AdminProfile } from '@/lib/admin-profile';
import { loadAdminProfile, profileFromSupabaseUser } from '@/lib/admin-profile';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const shown = value.trim() || '—';
  return (
    <div>
      <dt className="font-poppins text-sm font-semibold uppercase tracking-[0.12em] text-[#005D51]">
        {label}
      </dt>
      <dd className="mt-2 font-poppins text-[15px] text-[#142218] wrap-anywhere">
        {shown}
      </dd>
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const p = await loadAdminProfile();
        if (!cancelled) setProfile(p);
      } catch {
        if (!cancelled) {
          try {
            const supabase = createSupabaseBrowserClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!cancelled) setProfile(profileFromSupabaseUser(user));
          } catch {
            if (!cancelled) setProfile({ name: '', email: '', phone: '' });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const p = profile ?? { name: '', email: '', phone: '' };

  return (
    <AdminPageSection
      id="profile-heading"
      eyebrow="Account"
      title="Profile"
      description="What we show for you in admin comes from your login. Update name or email in your account settings if anything changes."
    >
      <div className="rounded-2xl border border-[#005D51]/12 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(20,34,24,0.04)] sm:px-8">
        {loading ? (
          <p className="font-poppins text-sm font-medium text-[#7B7B7B]">Loading profile…</p>
        ) : (
          <dl className="grid max-w-lg gap-8">
            <Field label="Name" value={p.name} />
            <Field label="Email" value={p.email} />
            <Field label="Phone number" value={p.phone} />
          </dl>
        )}
      </div>
    </AdminPageSection>
  );
}
