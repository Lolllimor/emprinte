import { APPLY_FLOW_STEPS } from '@/lib/apply-flow-steps';

/**
 * Post-CTA context: expandable step overview, admissions framing, privacy.
 * Keeps the sign-up action above the fold on most phones.
 */
export function ApplySignUpSecondary() {
  return (
    <div className="flex flex-col gap-5">
      <details className="group rounded-2xl border border-black/6 bg-white open:shadow-none">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-poppins text-sm font-semibold text-[#142218] outline-none marker:hidden [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[#005D51]/30 focus-visible:ring-offset-2 sm:px-5 sm:py-4">
          <span className="min-w-0 text-left">
            How the application works
            <span className="mt-0.5 block text-xs font-normal font-poppins text-[#7B7B7B]">
              6 steps · about 5 minutes
            </span>
          </span>
          <span
            className="shrink-0 text-lg leading-none text-[#005D51] transition-transform duration-200 group-open:-rotate-180"
            aria-hidden
          >
            ⌄
          </span>
        </summary>
        <div className="border-t border-black/6 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <ol className="m-0 list-none space-y-0 p-0">
            {APPLY_FLOW_STEPS.map((s, i) => {
              const isLast = i === APPLY_FLOW_STEPS.length - 1;
              return (
                <li key={s.label} className="flex gap-3">
                  <div className="flex w-6 shrink-0 flex-col items-center">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/8 bg-[#fafcfb] font-poppins text-[11px] font-semibold leading-none text-[#7B7B7B]"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    {!isLast ? (
                      <span
                        className="mx-auto mt-1 min-h-[10px] w-px flex-1 bg-[#dfe8e4]"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <p className="min-w-0 flex-1 pb-3 font-poppins text-sm leading-snug text-[#142218] sm:pb-3.5">
                    <span className="font-semibold">{s.label}</span>
                    <span className="font-normal text-[#9aa89e]"> — </span>
                    <span className="font-normal text-[#5c6b5f]">{s.detail}</span>
                  </p>
                </li>
              );
            })}
          </ol>
          <p className="mt-1 border-t border-black/6 pt-3.5 font-poppins text-[13px] leading-relaxed text-gray-500">
            We review every application personally. If you&apos;re shortlisted, we&apos;ll
            invite a short conversation before membership is confirmed. Payment details
            appear only on the final step.
          </p>
        </div>
      </details>

      <p className="px-1 text-center font-poppins text-[11px] leading-relaxed text-[#9aa89e] sm:text-xs">
        <span className="font-medium text-[#7B7B7B]">Privacy.</span> We use your email and
        answers only for admissions and Emprinte-related updates. We never sell your data.
      </p>
    </div>
  );
}
