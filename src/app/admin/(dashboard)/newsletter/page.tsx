import { AdminPageSection } from '@/components/admin/AdminPageSection';
import { AdminSubscribersPanel } from '@/components/admin/AdminSubscribersPanel';

export default function AdminNewsletterPage() {
  return (
    <AdminPageSection
      id="newsletter-heading"
      eyebrow="Audience"
      title="Newsletter subscribers"
      description="People who signed up through the form on your site. Export the list as a CSV file when you need it for email tools or backups."
    >
      <AdminSubscribersPanel />
    </AdminPageSection>
  );
}
