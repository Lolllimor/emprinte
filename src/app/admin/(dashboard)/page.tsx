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
        description="Set the book count, goal, and donation amount visitors see on the Build a Reader block. Save so the public page stays accurate."
      >
        <AdminBuildAReaderSection embedded />
      </AdminModal>

      <AdminModal
        open={activeModal === 'testimonials'}
        onClose={closeModal}
        title="Testimonials"
        description="Quotes that rotate on the homepage. Edit or add entries, then save—visitors see exactly what you publish here."
      >
        <AdminTestimonialsSection embedded />
      </AdminModal>

      <AdminModal
        open={activeModal === 'settings'}
        onClose={closeModal}
        title="Site details"
        description="Navigation, footer, contact details, social links, and headline stats. Save when you are done so menus and numbers match the live site."
        wide
      >
        <AdminSiteSettingsSection embedded />
      </AdminModal>
    </>
  );
}
