import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { AdminSubscribersPanel } from '@/components/admin/AdminSubscribersPanel';

export default function AdminNewsletterPage() {
  return (
    <AdminPageSection
      id="newsletter-heading"
      eyebrow="Audience"
      title="Newsletter subscribers"
      description="Everyone who joined through your site&apos;s newsletter form. Review details here, or download a CSV for your email tool or backups."
    >
      <AdminSubscribersPanel />
    </AdminPageSection>
  );
}
