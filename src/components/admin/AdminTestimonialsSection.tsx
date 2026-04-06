'use client';

import { AdminSection } from './AdminSection';
import { FormStatusBanner } from './FormStatusBanner';
import { PrimarySubmitButton } from './PrimarySubmitButton';
import { adminFormPanelLoose, adminInputPlain, adminTextButton } from './admin-styles';
import { useAdminTestimonials } from '@/hooks/admin/useAdminTestimonials';

interface AdminTestimonialsSectionProps {
  embedded?: boolean;
}

export function AdminTestimonialsSection({ embedded }: AdminTestimonialsSectionProps) {
  const { items, updateItem, addItem, removeItem, status, submit } =
    useAdminTestimonials();

  const inner = (
      <form onSubmit={submit} className={adminFormPanelLoose}>
        {items.map((t, idx) => (
          <div key={t.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                value={t.text}
                onChange={(e) => updateItem(idx, 'text', e.target.value)}
                placeholder="Quote"
                rows={2}
                className={adminInputPlain}
              />
              <input
                type="text"
                value={t.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                placeholder="Name"
                className={adminInputPlain}
              />
              <input
                type="text"
                value={t.title}
                onChange={(e) => updateItem(idx, 'title', e.target.value)}
                placeholder="Title (e.g. PROJECT MANAGER)"
                className={adminInputPlain}
              />
              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rating (1–5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating ?? 5}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      'rating',
                      parseInt(e.target.value, 10) || 5
                    )
                  }
                  className={`${adminInputPlain} w-16`}
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className={`${adminTextButton} self-start`}
        >
          Add testimonial
        </button>
        <PrimarySubmitButton
          loading={status.type === 'loading'}
          idleLabel="Save testimonials"
          loadingLabel="Saving…"
          className=""
        />
        <FormStatusBanner status={status} />
      </form>
  );

  if (embedded) return inner;

  return (
    <AdminSection title="Edit testimonials">
      {inner}
    </AdminSection>
  );
}
