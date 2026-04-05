'use client';

import { useEffect, type ReactNode } from 'react';

interface AdminModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  wide,
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#142218]/50 p-4 pt-10 pb-16 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className={`w-full rounded-2xl border border-[#142218]/10 bg-white shadow-[0_24px_64px_-12px_rgba(20,34,24,0.25),0_0_0_1px_rgba(1,91,81,0.06)] ${
          wide ? 'max-w-4xl' : 'max-w-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-[#142218]/08 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2
              id="admin-modal-title"
              className="font-lora text-lg font-semibold tracking-tight text-[#142218] sm:text-xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1.5 font-campton text-sm font-medium leading-relaxed text-[#5a6570]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-transparent px-3 py-1.5 font-campton text-sm font-semibold text-[#7B7B7B] transition hover:border-[#142218]/10 hover:bg-[#142218]/04 hover:text-[#142218]"
          >
            Close
          </button>
        </div>
        <div className="max-h-[min(75vh,800px)] overflow-y-auto bg-white px-5 py-6 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
