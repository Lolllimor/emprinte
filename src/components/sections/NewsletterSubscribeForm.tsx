'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { newsletterSchema } from '@/lib/validation/newsletter';
import { getApiUrl } from '@/lib/api';

const inputClassName =
  'w-full rounded-xl border border-white/25 bg-white px-4 py-3.5 text-base font-poppins text-[#142218] placeholder:text-[#8a8a8a] outline-none transition-[box-shadow,border-color] focus:border-white focus:ring-2 focus:ring-[#6FE19B]/80 disabled:opacity-60';

const labelClassName =
  'text-xs font-medium uppercase tracking-[0.08em] text-white/65 font-poppins';

export type NewsletterSubscribeFormProps = {
  idPrefix?: string;
  onSuccess?: () => void;
};

export function NewsletterSubscribeForm({
  idPrefix = 'newsletter',
  onSuccess,
}: NewsletterSubscribeFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const isSubmitting = status === 'loading';
  const messageId = `${idPrefix}-message`;
  const nameId = `${idPrefix}-full-name`;
  const phoneId = `${idPrefix}-phone`;
  const emailId = `${idPrefix}-email`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);

    const parsed = newsletterSchema.safeParse({ fullName, email, phone });

    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const validationMessage =
        fe.fullName?.[0] ??
        fe.email?.[0] ??
        fe.phone?.[0] ??
        'Please check your details.';

      setStatus('error');
      setMessage(validationMessage);
      return;
    }

    try {
      const response = await fetch(getApiUrl('emails'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
        }),
      });

      if (response.status === 409) {
        toast.success("You're already on the list", {
          description: onSuccess
            ? 'Opening the download for you.'
            : "Thanks — you're all set. We'll keep you posted.",
        });
        setFullName('');
        setEmail('');
        setPhone('');
        onSuccess?.();
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage =
          (data && (data.message || data.error)) ||
          'Unable to subscribe right now. Please try again later.';

        throw new Error(errorMessage);
      }

      toast.success("You're on the list", {
        description: "Thanks for subscribing — we'll be in touch.",
      });
      setFullName('');
      setEmail('');
      setPhone('');
      onSuccess?.();
    } catch (error) {
      setStatus('error');
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to subscribe right now. Please try again later.'
      );
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <form
      className="relative flex flex-col gap-5 rounded-2xl border border-white/15 bg-[#182920]/90 p-6 shadow-[0_24px_48px_rgba(0,0,0,0.35)] md:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="font-poppins text-sm font-medium text-white/90">
        Your details
      </p>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={nameId} className={labelClassName}>
            Full name
          </label>
          <input
            id={nameId}
            type="text"
            name="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ada Lovelace"
            className={inputClassName}
            aria-invalid={status === 'error'}
            aria-describedby={messageId}
            disabled={isSubmitting}
            autoComplete="name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={phoneId} className={labelClassName}>
            Phone
          </label>
          <input
            id={phoneId}
            type="tel"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234 …"
            className={inputClassName}
            aria-invalid={status === 'error'}
            aria-describedby={messageId}
            disabled={isSubmitting}
            autoComplete="tel"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className={labelClassName}>
          Email
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={inputClassName}
          aria-invalid={status === 'error'}
          aria-describedby={messageId}
          disabled={isSubmitting}
          autoComplete="email"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-1 flex h-14 w-full items-center justify-center rounded-xl bg-[#005D51] font-poppins text-lg font-medium text-white shadow-md outline-none transition-colors hover:bg-[#004438] focus-visible:ring-2 focus-visible:ring-[#6FE19B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182920] disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSubmitting}
      >
        {isSubmitting ? <>Sending…</> : <>Subscribe</>}
      </button>

      <p
        id={messageId}
        className={`min-h-5 font-poppins text-sm leading-snug text-[#F5B342] transition-opacity duration-150 ${
          message && status === 'error' ? 'opacity-100' : 'opacity-0'
        }`}
        aria-live="polite"
      >
        {message ?? '\u00a0'}
      </p>
    </form>
  );
}
