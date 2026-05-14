import type { ReactNode } from 'react';

/**
 * Page hero aligned with marketing: primary green eyebrow, Lora headline scale, #7B7B7B body.
 */
export function AdminPageSection({
  eyebrow,
  title,
  description,
  id,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  id: string;
  children?: ReactNode;
  /** Shown beside the title block (e.g. “View live” link). */
  actions?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={children ? 'space-y-10' : ''}>
      <header className="border-b border-[#005D51]/15 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl min-w-0">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.12em] text-[#005D51]">
              {eyebrow}
            </p>
            <h1
              id={id}
              className="mt-3 font-lora text-[1.75rem] font-semibold leading-tight tracking-tight text-[#142218] md:text-[2.25rem] md:leading-[1.15]"
            >
              {title}
            </h1>
            {description ? (
              <div className="mt-4 font-poppins text-base font-medium leading-relaxed text-[#7B7B7B] md:text-[17px] md:leading-[150%]">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3 lg:pt-1">
              {actions}
            </div>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}
