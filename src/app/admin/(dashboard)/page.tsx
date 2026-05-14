'use client';

import { useCallback, useState } from 'react';

import { AdminBuildAReaderSection } from '@/components/admin/AdminBuildAReaderSection';
import { AdminSiteSettingsSection } from '@/components/admin/AdminSiteSettingsSection';
import { AdminTestimonialsSection } from '@/components/admin/AdminTestimonialsSection';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminManageTile } from '@/types';

export default function AdminDashboardPage() {
  const [activeModal, setActiveModal] = useState<AdminManageTile | null>(null);
  const [dashboardKey, setDashboardKey] = useState(0);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setDashboardKey((k) => k + 1);
  }, []);

  return (
    <>
      <AdminDashboard refreshKey={dashboardKey} onManage={setActiveModal} />

      <AdminModal
        open={activeModal === 'buildAReader'}
        onClose={closeModal}
        title="Build a Reader"
        description="These numbers control the book drive visitors see: how many books you have so far, your overall goal, and the donation amount per book. Save when you are done so the public page stays accurate."
      >
        <AdminBuildAReaderSection embedded />
      </AdminModal>

      <AdminModal
        open={activeModal === 'testimonials'}
        onClose={closeModal}
        title="Testimonials"
        description="These are the reader quotes that rotate on your site. Edit the text or add more, then save. Whatever you save here is exactly what visitors will see."
      >
        <AdminTestimonialsSection embedded />
      </AdminModal>

      <AdminModal
        open={activeModal === 'settings'}
        onClose={closeModal}
        title="Site details"
        description="Update your menu links, footer links, contact email and phone numbers, social profiles, and the headline numbers (like member counts). Save when you are finished so the whole site stays in sync."
        wide
      >
        <AdminSiteSettingsSection embedded />
      </AdminModal>
    </>
  );
}
