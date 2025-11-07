'use client';

import { FormEvent, useState } from 'react';

import { newsletterSchema } from '@/lib/validation/newsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string | null>(null);

  const isSubmitting = status === 'loading';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);

    const parsed = newsletterSchema.safeParse({ email });

    if (!parsed.success) {
      const validationMessage =
        parsed.error.flatten().fieldErrors.email?.[0] ??
        'Please enter a valid email address';

      setStatus('error');
      setMessage(validationMessage);
      return;
    }

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage =
          (data && (data.message || data.error)) ||
          'Unable to subscribe right now. Please try again later.';

        throw new Error(errorMessage);
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to subscribe right now. Please try again later.'
      );
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <section className="w-full bg-[#142218] px-6 py-9  md:py-[98px] xl:px-[120px] lg:px-[64px] md:px-[32px] ">
      <div className="max-w-[1440px] mx-auto flex flex-col items-end gap-8">
        {' '}
        <div className="w-full flex flex-col justify-center items-start gap-3">
          <div className="flex w-fit h-[31px] px-2.5 justify-center items-center gap-2.5 rounded-3xl bg-[#E63715]">
            <span className="text-xs md:text-base leading-[150%] font-normal text-white font-campton">
              Join our Newletter
            </span>
          </div>

          <div className="flex flex-col items-start gap-2 md:gap-4 w-full">
            <h2 className="text-2xl md:text-[40px] leading-[32px] md:leading-[48px] font-semibold text-white font-lora">
              Explore Thousands of Stories with Us
            </h2>
            <p className="text-base md:text-2xl leading-[20px] md:leading-[24px] font-medium text-white font-campton">
              Subscribe to our mailing list to be the first to know about our
              events and more
            </p>
          </div>
        </div>
        <form
          className="w-full flex flex-col items-start gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex h-14 px-4 py-[15px] items-center gap-2.5 w-full rounded-lg bg-white max-w-[564px]">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="flex-1 text-base leading-[32px] font-normal text-[#A7A7A7] font-campton bg-transparent outline-none"
              aria-label="Email address"
              aria-invalid={status === 'error'}
              aria-describedby="newsletter-message"
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            className="flex h-14 px-2.5 justify-center items-center gap-2.5 w-full rounded-lg bg-white max-w-[564px] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <span className="text-xl leading-[150%] font-medium text-[#015B51] font-campton">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </span>
          </button>
          <p
            id="newsletter-message"
            className={`text-sm font-campton transition-colors duration-150 ${
              status === 'success' ? 'text-[#6FE19B]' : 'text-[#F5B342]'
            } ${message ? 'opacity-100' : 'opacity-0'}`}
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}
