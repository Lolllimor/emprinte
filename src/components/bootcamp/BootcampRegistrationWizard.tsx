'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { getSameOriginApiUrl } from '@/lib/api';
import type { BootcampPublic } from '@/lib/landing-bootcamps-db';
import { bootcampRegistrationSchema } from '@/lib/validation/bootcamp-registration';
import { formatGuestPriceNaira } from '@/constants/bootcamp-registration';

const inputClass =
  'w-full rounded-xl border border-[#142218]/10 bg-white px-4 py-3 text-base text-[#142218] outline-none font-poppins transition placeholder:text-[#9aa89e] focus:border-[#005D51] focus:ring-[3px] focus:ring-[#6FE19B]/35 disabled:opacity-60';

const textareaClass = `${inputClass} min-h-[112px] resize-y`;

const labelClass =
  'text-xs font-semibold uppercase tracking-[0.1em] text-[#4a5c50] font-poppins';

type BootcampPageCopy = {
  kicker: string;
  title: string;
  lead: string;
  privacyNote: string;
};

type BootcampRegistrationWizardProps = {
  bootcamp: BootcampPublic;
  pageCopy: BootcampPageCopy;
};

export function BootcampRegistrationWizard({
  bootcamp,
  pageCopy,
}: BootcampRegistrationWizardProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const payload = {
      bootcampId: bootcamp.id,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
    };
    const parsed = bootcampRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        'Please check your answers.';
      toast.error(first);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(getSameOriginApiUrl('bootcamp-registration'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof json.message === 'string'
            ? json.message
            : 'Could not save your registration. Please try again.',
        );
        return;
      }
      router.replace(
        `/bootcamp/register/thank-you?bootcampId=${encodeURIComponent(bootcamp.id)}`,
      );
    } catch {
      toast.error('Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const priceLine =
    bootcamp.guestPriceNaira > 0
      ? `Guest fee: ₦${formatGuestPriceNaira(bootcamp.guestPriceNaira)} (details shared after review).`
      : null;

  return (
    <form onSubmit={(ev) => void onSubmit(ev)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-black/6 bg-white p-6 md:p-8">
        <p className="font-poppins text-sm leading-relaxed text-[#4a5c50]">{pageCopy.lead}</p>
        {priceLine ? (
          <p className="mt-3 font-poppins text-xs font-medium text-[#005D51]">{priceLine}</p>
        ) : null}
        <p className="mt-3 font-poppins text-xs leading-relaxed text-[#5c6b5f]">
          {pageCopy.privacyNote}
        </p>
        <p className="mt-2 font-poppins text-xs text-[#5c6b5f]">
          Already an Emprinte community member with an active subscription? Request to join from
          the Readers Hub app instead.
        </p>
      </div>

      <div className="rounded-2xl border border-black/6 bg-white p-6 md:p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="bootcamp-full-name">
            Full name
          </label>
          <input
            id="bootcamp-full-name"
            className={inputClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            disabled={busy}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="bootcamp-email">
            Email
          </label>
          <input
            id="bootcamp-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={busy}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="bootcamp-phone">
            Phone (optional)
          </label>
          <input
            id="bootcamp-phone"
            type="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            disabled={busy}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="bootcamp-message">
            Why do you want to join?
          </label>
          <textarea
            id="bootcamp-message"
            className={textareaClass}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={busy}
            required
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-[#142218]/08 bg-[#fafcfb]/95 px-4 py-4 backdrop-blur-md md:-mx-0 md:rounded-2xl md:border md:px-6">
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#005D51] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#004438] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {busy ? 'Submitting…' : 'Submit registration'}
        </button>
      </div>
    </form>
  );
}
