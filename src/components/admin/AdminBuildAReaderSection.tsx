'use client';

import { AdminSection } from './AdminSection';
import { FieldLabel } from './LabeledField';
import { FormStatusBanner } from './FormStatusBanner';
import { PrimarySubmitButton } from './PrimarySubmitButton';
import { adminFormPanel, adminInputPlain } from './admin-styles';
import { useAdminBuildAReader } from '@/hooks/admin/useAdminBuildAReader';

interface AdminBuildAReaderSectionProps {
  /** When true, only the inner form is rendered (e.g. inside a modal). */
  embedded?: boolean;
}

export function AdminBuildAReaderSection({ embedded }: AdminBuildAReaderSectionProps) {
  const { data, updateField, status, submit } = useAdminBuildAReader();

  const inner =
    !data ? (
      <p className="text-gray-600">Loading…</p>
    ) : (
      <form onSubmit={submit} className={adminFormPanel}>
          <FieldLabel label="Books collected">
            <input
              type="number"
              min={0}
              value={data.booksCollected}
              onChange={(e) =>
                updateField('booksCollected', parseInt(e.target.value, 10) || 0)
              }
              className={adminInputPlain}
            />
          </FieldLabel>
          <FieldLabel label="Total books (goal)">
            <input
              type="number"
              min={1}
              value={data.totalBooks}
              onChange={(e) =>
                updateField('totalBooks', parseInt(e.target.value, 10) || 1)
              }
              className={adminInputPlain}
            />
          </FieldLabel>
          <FieldLabel label="Price per book (NGN)">
            <input
              type="number"
              min={0}
              value={data.pricePerBook}
              onChange={(e) =>
                updateField('pricePerBook', parseInt(e.target.value, 10) || 0)
              }
              className={adminInputPlain}
            />
          </FieldLabel>
          <PrimarySubmitButton
            loading={status.type === 'loading'}
            idleLabel="Save Build a Reader"
            loadingLabel="Saving…"
          />
          <FormStatusBanner status={status} />
        </form>
    );

  if (embedded) return inner;

  return (
    <AdminSection title="Edit Build a Reader">
      {inner}
    </AdminSection>
  );
}
