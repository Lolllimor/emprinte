'use client';

import Image from 'next/image';
import { useId, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';

import { AdminSection } from './AdminSection';
import { FieldLabel } from './LabeledField';
import { FormStatusBanner } from './FormStatusBanner';
import { PrimarySubmitButton } from './PrimarySubmitButton';
import { adminFormPanel, adminInputPlain } from './admin-styles';
import { useAdminBuildAReader } from '@/hooks/admin/useAdminBuildAReader';
import {
  uploadImageToCloudinary,
  validateJpegPngUnder3Mb,
} from '@/lib/client-cloudinary-upload';

interface AdminBuildAReaderSectionProps {
  /** When true, only the inner form is rendered (e.g. inside a modal). */
  embedded?: boolean;
}

export function AdminBuildAReaderSection({ embedded }: AdminBuildAReaderSectionProps) {
  const { data, updateField, appendSlideUrl, removeSlideAt, status, submit } =
    useAdminBuildAReader();
  const [pasteUrl, setPasteUrl] = useState('');
  const addFileId = useId();
  const addUrlInputId = useId();

  const onAddSlideFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !data) return;
    if (data.slideshowUrls.length >= 5) {
      toast.message('You can add at most 5 images.');
      return;
    }
    const err = validateJpegPngUnder3Mb(file);
    if (err) {
      toast.error(err);
      return;
    }
    const r = await uploadImageToCloudinary(file);
    if (!r.ok) {
      toast.error(r.message);
      return;
    }
    appendSlideUrl(r.url);
    toast.success('Slide added.');
  };

  const handleAddPasteUrl = () => {
    if (!data || data.slideshowUrls.length >= 5) {
      toast.message('You can add at most 5 images.');
      return;
    }
    const u = pasteUrl.trim();
    if (!/^https?:\/\//i.test(u)) {
      toast.error('Enter a full image URL (https://…).');
      return;
    }
    appendSlideUrl(u);
    setPasteUrl('');
    toast.success('Slide added.');
  };

  const inner =
    !data ? (
      <p className="text-gray-600">Loading…</p>
    ) : (
      <form onSubmit={submit} className={`${adminFormPanel} space-y-8`}>
        <div className="space-y-4">
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
        </div>

        <div className="rounded-xl border border-[#005D51]/12 bg-[#fafcfb] p-4 sm:p-5">
          <p className="font-poppins text-sm font-semibold text-[#142218]">
            Hero slideshow (up to 5)
          </p>
          <p className="mt-1 font-poppins text-xs leading-relaxed text-[#5c6b5f]">
            JPG or PNG up to 3 MB via Cloudinary, or paste an https image URL. Empty
            list uses the default site image on the homepage. Save below to publish.
          </p>

          {data.slideshowUrls.length > 0 ? (
            <ul className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
              {data.slideshowUrls.map((url, idx) => (
                <li
                  key={`${url}-${idx}`}
                  className="flex gap-3 rounded-lg border border-[#142218]/10 bg-white p-2"
                >
                  <Image
                    src={url}
                    alt=""
                    width={64}
                    height={80}
                    unoptimized
                    className="h-20 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <p className="truncate font-mono text-[10px] text-[#5c6b5f]" title={url}>
                      {url}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeSlideAt(idx)}
                      className="self-start text-xs font-semibold text-[#E63715] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-poppins text-xs text-[#5c6b5f]">No slides yet.</p>
          )}

          {data.slideshowUrls.length < 5 ? (
            <div className="mt-4 flex flex-col gap-4 border-t border-[#005D51]/10 pt-4">
              <div>
                <label
                  htmlFor={addFileId}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-[#005D51]/25 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-[#005D51] transition hover:border-[#005D51]/45 hover:bg-[#005D51]/06"
                >
                  Upload image
                </label>
                <input
                  id={addFileId}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="sr-only"
                  onChange={(e) => void onAddSlideFile(e)}
                />
                <span className="ml-3 font-poppins text-xs text-[#5c6b5f]">
                  JPG or PNG, max 3 MB
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <FieldLabel label="Or paste image URL">
                    <input
                      id={addUrlInputId}
                      type="url"
                      value={pasteUrl}
                      onChange={(e) => setPasteUrl(e.target.value)}
                      placeholder="https://…"
                      className={adminInputPlain}
                    />
                  </FieldLabel>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddPasteUrl()}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#005D51]/20 bg-white px-4 font-poppins text-sm font-semibold text-[#005D51] transition hover:border-[#005D51]/40"
                >
                  Add URL
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 font-poppins text-xs text-[#5c6b5f]">Maximum of 5 slides reached.</p>
          )}
        </div>

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
