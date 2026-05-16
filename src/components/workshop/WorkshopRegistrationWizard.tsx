'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import {
  FINANCIAL_CATEGORY_OPTIONS,
  WORKSHOP_INTRO_COPY,
  WORKSHOP_WHATSAPP_GROUP_URL,
} from '@/constants/workshop-registration';
import { getSameOriginApiUrl } from '@/lib/api';
import type { WorkshopRegistrationInput } from '@/lib/validation/workshop-registration';
import { workshopRegistrationSchema } from '@/lib/validation/workshop-registration';

const inputClass =
  'w-full border-0 border-b border-[#dadce0] bg-transparent px-0 py-2 font-poppins text-base text-[#202124] outline-none placeholder:text-[#70757a] focus:border-[#005D51]';

const labelClass = 'font-poppins text-base font-medium text-[#202124]';

const cardClass = 'overflow-hidden rounded-lg bg-white shadow-sm';

const requiredMark = <span className="text-[#E63715]"> *</span>;

const HUB_CHECKLIST = ['Read', 'Apply', 'Grow', 'Belong', 'Become'] as const;

const emptyForm: WorkshopRegistrationInput = {
  fullName: '',
  email: '',
  primaryGoal: '',
  isMember: 'no',
  financialCategory: 'saver',
  financeChallenges: '',
  workshopQuestions: '',
};

type Step = 1 | 2;

function WorkshopFormHeader() {
  return (
    <div className="overflow-hidden rounded-t-lg bg-[#005D51] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-poppins text-2xl font-bold tracking-wide sm:text-3xl">
            EMPRINTE
          </p>
          <p className="font-poppins text-lg font-semibold sm:text-xl">Readers Hub</p>
          <p className="font-poppins text-sm text-white/85">
            Making readers out of Africa
          </p>
        </div>
        <ul className="flex flex-col gap-2 font-poppins text-sm sm:text-base">
          {HUB_CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-white/80 bg-white/10 text-xs"
                aria-hidden
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WorkshopRegistrationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<WorkshopRegistrationInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function updateField<K extends keyof WorkshopRegistrationInput>(
    key: K,
    value: WorkshopRegistrationInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep1(): boolean {
    const partial = workshopRegistrationSchema.pick({
      fullName: true,
      email: true,
      primaryGoal: true,
      isMember: true,
    });
    const result = partial.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        if (messages?.[0]) errors[key] = messages[0];
      }
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    const result = workshopRegistrationSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        if (messages?.[0]) errors[key] = messages[0];
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(getSameOriginApiUrl('workshop-registration'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof json.message === 'string'
            ? json.message
            : 'Could not submit your registration. Please try again.',
        );
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function clearForm() {
    setForm(emptyForm);
    setFieldErrors({});
    setStep(1);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-[640px] space-y-3">
        <div className={cardClass}>
          <WorkshopFormHeader />
          <div className="border-t-4 border-[#E63715] px-5 py-8 sm:px-8">
            <h1 className="font-poppins text-[28px] font-normal leading-tight text-[#202124] sm:text-[32px]">
              {WORKSHOP_INTRO_COPY.title}
            </h1>
            <p className="mt-6 font-poppins text-base leading-relaxed text-[#202124]">
              Your response has been recorded. Kindly join the waiting group chat on
              WhatsApp:
            </p>
            <p className="mt-4">
              <a
                href={WORKSHOP_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins text-base text-[#1a73e8] underline"
              >
                {WORKSHOP_WHATSAPP_GROUP_URL}
              </a>
            </p>
            <button
              type="button"
              onClick={clearForm}
              className="mt-8 font-poppins text-sm text-[#1a73e8] underline"
            >
              Submit another response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[640px] space-y-3">
      {step === 1 ? (
        <>
          <div className={cardClass}>
            <WorkshopFormHeader />
            <div className="border-t-4 border-[#E63715] px-5 py-6 sm:px-8">
              <h1 className="font-poppins text-[28px] font-normal leading-tight text-[#202124] sm:text-[32px]">
                {WORKSHOP_INTRO_COPY.title}
              </h1>
              <div className="mt-4 space-y-4 font-poppins text-sm leading-relaxed text-[#202124] sm:text-base">
                {WORKSHOP_INTRO_COPY.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p>
                  <strong>{WORKSHOP_INTRO_COPY.privacyHeading}</strong>{' '}
                  {WORKSHOP_INTRO_COPY.privacyBody}
                </p>
              </div>
              <p className="mt-6 font-poppins text-xs text-[#70757a]">
                <span className="text-[#E63715]">*</span> Indicates required question
              </p>
            </div>
          </div>

          <FieldCard
            label="Full Name"
            required
            error={fieldErrors.fullName}
          >
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="Your answer"
              className={inputClass}
              autoComplete="name"
            />
          </FieldCard>

          <FieldCard label="Email" required error={fieldErrors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Your answer"
              className={inputClass}
              autoComplete="email"
            />
          </FieldCard>

          <FieldCard
            label="What is your primary goal for attending this event?"
            required
            error={fieldErrors.primaryGoal}
          >
            <input
              type="text"
              value={form.primaryGoal}
              onChange={(e) => updateField('primaryGoal', e.target.value)}
              placeholder="Your answer"
              className={inputClass}
            />
          </FieldCard>

          <FieldCard
            label="Are you a member of Emprinte Readers Hub?"
            required
            error={fieldErrors.isMember}
          >
            <div className="mt-3 flex flex-col gap-3">
              {(['yes', 'no'] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 font-poppins text-base text-[#202124]"
                >
                  <input
                    type="radio"
                    name="isMember"
                    value={value}
                    checked={form.isMember === value}
                    onChange={() => updateField('isMember', value)}
                    className="h-4 w-4 accent-[#005D51]"
                  />
                  {value === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </FieldCard>
        </>
      ) : (
        <>
          <div className={cardClass}>
            <div className="bg-[#E63715] px-5 py-3 sm:px-8">
              <p className="font-poppins text-lg font-medium text-white">Last Lap</p>
            </div>
            <div className="px-5 py-6 sm:px-8">
              <p className={labelClass}>
                What financial category would you place yourself in?
                {requiredMark}
              </p>
              {fieldErrors.financialCategory ? (
                <p className="mt-1 font-poppins text-sm text-[#E63715]">
                  {fieldErrors.financialCategory}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-3">
                {FINANCIAL_CATEGORY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 font-poppins text-base text-[#202124]"
                  >
                    <input
                      type="radio"
                      name="financialCategory"
                      value={option.value}
                      checked={form.financialCategory === option.value}
                      onChange={() => updateField('financialCategory', option.value)}
                      className="h-4 w-4 accent-[#005D51]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <FieldCard
            label="What are the challenges you face in organising your finances?"
            required
            error={fieldErrors.financeChallenges}
          >
            <input
              type="text"
              value={form.financeChallenges}
              onChange={(e) => updateField('financeChallenges', e.target.value)}
              placeholder="Your answer"
              className={inputClass}
            />
          </FieldCard>

          <FieldCard
            label="Are there any specific questions you'd like to have addressed at the workshop?"
            required
            error={fieldErrors.workshopQuestions}
          >
            <input
              type="text"
              value={form.workshopQuestions}
              onChange={(e) => updateField('workshopQuestions', e.target.value)}
              placeholder="Your answer"
              className={inputClass}
            />
          </FieldCard>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 px-1 pb-8 pt-2">
        <div className="flex flex-wrap gap-3">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex h-10 items-center justify-center rounded border border-[#dadce0] bg-white px-6 font-poppins text-sm font-medium text-[#E63715] transition hover:bg-[#f8f9fa]"
            >
              Back
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 min-w-[88px] items-center justify-center rounded bg-[#E63715] px-6 font-poppins text-sm font-medium text-white transition hover:bg-[#c42e12] disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : step === 1 ? 'Next' : 'Submit'}
          </button>
        </div>
        <button
          type="button"
          onClick={clearForm}
          className="font-poppins text-sm text-[#E63715] hover:underline"
        >
          Clear form
        </button>
      </div>

      <p className="pb-4 text-center font-poppins text-xs text-[#70757a]">
        <Link href="/" className="text-[#1a73e8] hover:underline">
          Back to Emprinte home
        </Link>
      </p>
    </form>
  );
}

function FieldCard({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${cardClass} px-5 py-6 sm:px-8`}>
      <p className={labelClass}>
        {label}
        {required ? requiredMark : null}
      </p>
      {error ? (
        <p className="mt-1 font-poppins text-sm text-[#E63715]">{error}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}
