'use client';

import { useEffect, useState } from 'react';

import { AdminPageSection } from '@/components/admin/AdminPageSection';
import type { AdminProfile } from '@/lib/admin-profile';
import { loadAdminProfile, profileFromJwtToken } from '@/lib/admin-profile';
import { getEditTokenForClient } from '@/lib/api';

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
      <dt className="font-campton text-sm font-semibold uppercase tracking-[0.12em] text-[#015B51]">
        {label}
      </dt>
      <dd className="mt-2 font-campton text-[15px] text-[#142218] wrap-anywhere">
        {shown}
      </dd>
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getEditTokenForClient()) {
      window.location.replace('/admin/login');
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const p = await loadAdminProfile();
        if (!cancelled) setProfile(p);
      } catch {
        if (!cancelled) {
          setProfile(profileFromJwtToken(getEditTokenForClient()));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const p =
    profile ??
    profileFromJwtToken(typeof window !== 'undefined' ? getEditTokenForClient() : '');

  return (
    <AdminPageSection
      id="profile-heading"
      eyebrow="Account"
      title="Profile"
      description="Your name, email, and phone come from your login token and, when available, your API profile endpoint."
    >
      <div className="rounded-2xl border border-[#015B51]/12 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(20,34,24,0.04)] sm:px-8">
        {loading ? (
          <p className="font-campton text-sm font-medium text-[#7B7B7B]">Loading profile…</p>
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
