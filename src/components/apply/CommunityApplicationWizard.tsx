'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Logo } from '@/components/ui/Logo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { BookType } from '@/lib/validation/community-application';

const BUCKET = 'community-applications';

const inputClass =
  'w-full rounded-xl border border-[#142218]/10 bg-white px-4 py-3 text-base text-[#142218] shadow-inner shadow-black/[0.02] outline-none font-poppins transition placeholder:text-[#9aa89e] focus:border-[#005D51] focus:ring-[3px] focus:ring-[#6FE19B]/35 disabled:opacity-60';

const labelClass =
  'text-xs font-semibold uppercase tracking-[0.1em] text-[#4a5c50] font-poppins';

const cardShell =
  'rounded-2xl border border-black/[0.06] bg-white/95 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/70 backdrop-blur-sm md:p-8';

const WIZARD_STEPS = [
  { short: 'You', title: 'About you', subtitle: 'How we reach you and a snapshot of your background.' },
  { short: 'Plan', title: 'Membership', subtitle: 'Choose the plan you are aiming for after admission.' },
  { short: 'Read', title: 'Your reading journey', subtitle: 'Help us understand your habits and interests.' },
  { short: 'Goals', title: 'Commitment & goals', subtitle: 'Your focus for the year and a clear photo of you.' },
  { short: 'Pay', title: 'Application fee', subtitle: 'Bank details and upload your payment receipt.' },
] as const;

const BOOK_OPTIONS: { value: BookType; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'business', label: 'Business' },
  { value: 'science', label: 'Science' },
  { value: 'other', label: 'Other' },
];

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  gender: '' | 'male' | 'female' | 'prefer_not_to_say';
  dateOfBirth: string;
  location: string;
  professionalStatus: '' | 'student_nysc' | 'employed' | 'entrepreneur' | 'unemployed';
  planChoice: '' | 'quarterly' | 'monthly' | 'student';
  consistentReader: '' | 'yes' | 'no' | 'not_sure';
  booksLast12Months: '' | '0' | '1-3' | '3-5' | '5-10' | 'more_than_10';
  bookTypes: BookType[];
  bookTypesOther: string;
  weekendCommitment: '' | 'yes' | 'no';
  commitmentScale: number;
  readingGoals12m: string;
  referralSource:
    | ''
    | 'facebook'
    | 'twitter'
    | 'instagram'
    | 'linkedin'
    | 'community_member'
    | 'other';
  referralOther: string;
};

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  location: '',
  professionalStatus: '',
  planChoice: '',
  consistentReader: '',
  booksLast12Months: '',
  bookTypes: [],
  bookTypesOther: '',
  weekendCommitment: '',
  commitmentScale: 5,
  readingGoals12m: '',
  referralSource: '',
  referralOther: '',
};

function toggleBookType(prev: BookType[], value: BookType): BookType[] {
  if (prev.includes(value)) return prev.filter((v) => v !== value);
  return [...prev, value];
}

function extFromFile(file: File): string {
  const n = file.name;
  const i = n.lastIndexOf('.');
  if (i === -1) return 'bin';
  return n.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
}

function validateStep(step: number, f: FormState, portrait: File | null, receipt: File | null): string | null {
  switch (step) {
    case 0:
      if (!f.firstName.trim()) return 'Add your first name to continue.';
      if (!f.lastName.trim()) return 'Add your last name to continue.';
      if (!f.phone.trim()) return 'Add a phone number we can reach you on.';
      if (!f.gender) return 'Select an option for gender.';
      if (!f.dateOfBirth) return 'Add your date of birth.';
      if (!f.location.trim()) return 'Tell us where you are based.';
      if (!f.professionalStatus) return 'Select your professional status.';
      return null;
    case 1:
      if (!f.planChoice) return 'Choose the plan you are interested in.';
      return null;
    case 2:
      if (!f.consistentReader) return 'Answer how consistent a reader you are.';
      if (!f.booksLast12Months) return 'Select roughly how many books you read last year.';
      if (f.bookTypes.length === 0) return 'Pick at least one topic you want to read with us.';
      if (f.bookTypes.includes('other') && !f.bookTypesOther.trim()) {
        return 'Add a few words for “Other” topics.';
      }
      if (!f.weekendCommitment) return 'Let us know about weekend time for reading.';
      return null;
    case 3:
      if (!f.readingGoals12m.trim()) return 'Share your reading goals for the next year.';
      if (!f.referralSource) return 'Tell us how you heard about Emprinte.';
      if (f.referralSource === 'other' && !f.referralOther.trim()) {
        return 'Add how you heard about us.';
      }
      if (!portrait) return 'Upload a clear portrait (photo or PDF).';
      return null;
    case 4:
      if (!receipt) return 'Upload your ₦3,000 application fee receipt to submit.';
      return null;
    default:
      return null;
  }
}

function choiceCardClass(active: boolean) {
  return [
    'flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 font-poppins text-sm leading-snug transition',
    active
      ? 'border-[#005D51] bg-[#F0FFFD] text-[#142218] shadow-sm'
      : 'border-[#142218]/10 bg-white text-[#142218] hover:border-[#005D51]/25 hover:bg-[#FAFFFC]',
  ].join(' ');
}

export function CommunityApplicationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [portrait, setPortrait] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const totalSteps = WIZARD_STEPS.length;

  const loadStatus = useCallback(async () => {
    const res = await fetch('/api/community-application', { method: 'GET' });
    if (!res.ok) return;
    const data = (await res.json()) as { submitted?: boolean };
    if (data.submitted) {
      setAlreadySubmitted(true);
      router.replace('/apply/thank-you');
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        setSessionEmail(session?.user.email ?? null);
        if (session) await loadStatus();
      } catch {
        if (!cancelled) setSessionEmail(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadStatus]);

  const progressPct = useMemo(
    () => Math.round(((step + 1) / totalSteps) * 100),
    [step, totalSteps],
  );

  function nextStep() {
    const err = validateStep(step, form, portrait, receipt);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateStep(4, form, portrait, receipt);
    if (err) {
      toast.error(err);
      return;
    }
    if (!portrait || !receipt) {
      toast.error('Add both uploads before submitting.');
      return;
    }

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id || !user.email) {
        toast.error('Your session ended. Sign up again to continue.');
        router.replace('/apply/sign-up?next=/apply/form');
        return;
      }

      const MAX_BYTES = 10 * 1024 * 1024;
      if (portrait.size > MAX_BYTES || receipt.size > MAX_BYTES) {
        toast.error('Each file must be 10 MB or smaller.');
        return;
      }

      const pExt = extFromFile(portrait);
      const rExt = extFromFile(receipt);
      const portraitPath = `${user.id}/portrait-${Date.now()}.${pExt}`;
      const receiptPath = `${user.id}/receipt-${Date.now()}.${rExt}`;

      const { error: upP } = await supabase.storage
        .from(BUCKET)
        .upload(portraitPath, portrait, { upsert: false });
      if (upP) {
        toast.error(upP.message || 'Could not upload your portrait.');
        return;
      }

      const { error: upR } = await supabase.storage
        .from(BUCKET)
        .upload(receiptPath, receipt, { upsert: false });
      if (upR) {
        toast.error(upR.message || 'Could not upload your receipt.');
        return;
      }

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        location: form.location.trim(),
        professionalStatus: form.professionalStatus,
        planChoice: form.planChoice,
        consistentReader: form.consistentReader,
        booksLast12Months: form.booksLast12Months,
        bookTypes: form.bookTypes,
        bookTypesOther: form.bookTypesOther.trim() || null,
        weekendCommitment: form.weekendCommitment,
        commitmentScale: form.commitmentScale,
        readingGoals12m: form.readingGoals12m.trim(),
        portraitStoragePath: portraitPath,
        receiptStoragePath: receiptPath,
        referralSource: form.referralSource,
        referralOther: form.referralOther.trim() || null,
      };

      const res = await fetch('/api/community-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const bodyJson = await res.json().catch(() => ({}));
      if (res.status === 409) {
        toast.message(bodyJson.error || 'You already submitted.');
        router.replace('/apply/thank-you');
        return;
      }
      if (!res.ok) {
        toast.error(
          typeof bodyJson.error === 'string'
            ? bodyJson.error
            : 'Submission failed. Try again.',
        );
        return;
      }

      router.replace('/apply/thank-you');
    } finally {
      setBusy(false);
    }
  }

  if (alreadySubmitted) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="font-poppins text-sm text-[#4a5c50]">Taking you to your confirmation…</p>
      </main>
    );
  }

  const meta = WIZARD_STEPS[step]!;

  return (
    <div className="pb-28 md:pb-32">
      <main className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
        <header className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/apply"
            className="mb-5 inline-flex rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-black/[0.04] transition hover:bg-white"
          >
            <Logo />
          </Link>
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#005D51]/85">
            Application · Step {step + 2} of 6
          </p>
          <h1 className="mt-2 font-lora text-2xl font-semibold leading-tight text-[#142218] md:text-3xl">
            {meta.title}
          </h1>
          <p className="mx-auto mt-2 max-w-md font-poppins text-sm leading-relaxed text-[#4a5c50]">
            {meta.subtitle}
          </p>
          {sessionEmail ? (
            <p className="mt-3 font-poppins text-xs text-[#7B7B7B]">
              Signed in as{' '}
              <span className="font-medium text-[#142218]">{sessionEmail}</span>
            </p>
          ) : null}
        </header>

        <nav
          className="mb-8 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Steps"
        >
          {WIZARD_STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <div
                key={s.short}
                className={`flex min-w-[4.75rem] flex-col items-center rounded-xl px-2 py-2 text-center transition ${
                  current
                    ? 'bg-[#005D51] text-white shadow-md'
                    : done
                      ? 'bg-white/90 text-[#005D51] ring-1 ring-[#005D51]/20'
                      : 'bg-white/50 text-[#9aa89e] ring-1 ring-black/[0.04]'
                }`}
              >
                <span className="font-poppins text-[10px] font-bold uppercase tracking-wide">
                  {done ? '✓' : s.short}
                </span>
                <span className="mt-0.5 font-poppins text-[10px] leading-tight opacity-90">
                  {i + 2}/6
                </span>
              </div>
            );
          })}
        </nav>

        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[#005D51] transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <form
          id="apply-wizard-form"
          onSubmit={step === 4 ? onSubmit : (e) => e.preventDefault()}
          className="flex flex-col gap-8"
        >
          {step === 0 ? (
            <section className={cardShell}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="firstName">
                      First name
                    </label>
                    <input
                      id="firstName"
                      className={`${inputClass} mt-1.5`}
                      value={form.firstName}
                      onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      className={`${inputClass} mt-1.5`}
                      value={form.lastName}
                      onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">
                    Phone (WhatsApp-friendly)
                  </label>
                  <input
                    id="phone"
                    className={`${inputClass} mt-1.5`}
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    autoComplete="tel"
                  />
                </div>
                <fieldset>
                  <legend className={labelClass}>Gender</legend>
                  <div className="mt-3 flex flex-col gap-2">
                    {(
                      [
                        ['male', 'Male'],
                        ['female', 'Female'],
                        ['prefer_not_to_say', 'Prefer not to say'],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value} className={choiceCardClass(form.gender === value)}>
                        <input
                          type="radio"
                          name="gender"
                          className="mt-1 size-4 shrink-0 accent-[#005D51]"
                          checked={form.gender === value}
                          onChange={() => setForm((s) => ({ ...s, gender: value }))}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label className={labelClass} htmlFor="dob">
                    Date of birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className={`${inputClass} mt-1.5 max-w-full sm:max-w-[240px]`}
                    value={form.dateOfBirth}
                    onChange={(e) => setForm((s) => ({ ...s, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="location">
                    Where you live
                  </label>
                  <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">City, state, country</p>
                  <input
                    id="location"
                    className={`${inputClass} mt-1.5`}
                    value={form.location}
                    onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                  />
                </div>
                <fieldset>
                  <legend className={labelClass}>Professional status</legend>
                  <div className="mt-3 flex flex-col gap-2">
                    {(
                      [
                        ['student_nysc', 'Student / NYSC'],
                        ['employed', 'Employed'],
                        ['entrepreneur', 'Entrepreneur (self-employed)'],
                        ['unemployed', 'Unemployed'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={choiceCardClass(form.professionalStatus === value)}
                      >
                        <input
                          type="radio"
                          name="pro"
                          className="mt-1 size-4 shrink-0 accent-[#005D51]"
                          checked={form.professionalStatus === value}
                          onChange={() =>
                            setForm((s) => ({ ...s, professionalStatus: value }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className={cardShell}>
              <p className="font-poppins text-sm leading-relaxed text-[#4a5c50]">
                Pricing below is what we publish for members after you are admitted. On
                this step you are only indicating interest—not paying membership yet.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {(
                  [
                    {
                      id: 'quarterly' as const,
                      name: 'Quarterly',
                      price: '₦20,000 / quarter',
                      note: '₦25,000 / quarter for new members joining the community',
                      bullets: [
                        'Bootcamps, growth coach, discounts',
                        'Book votes, priority mentorship, vault',
                        'Three-month focused sprints',
                      ],
                    },
                    {
                      id: 'monthly' as const,
                      name: 'Monthly',
                      price: '₦7,000 / month',
                      note: null,
                      bullets: [
                        'Reading rooms, weekly reviews, recordings',
                        'eBooks, structures, bootcamps in that month',
                      ],
                    },
                    {
                      id: 'student' as const,
                      name: 'Student & transition',
                      price: '₦5,000 / mo · ₦12,000 / quarter',
                      note: 'Valid ID required',
                      bullets: [
                        'For undergraduates, corps members, or temporarily unemployed',
                        'Subsidised core access',
                      ],
                    },
                  ] as const
                ).map((plan) => (
                  <label
                    key={plan.id}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition md:p-5 ${
                      form.planChoice === plan.id
                        ? 'border-[#005D51] bg-[#F0FFFD] shadow-md ring-1 ring-[#005D51]/10'
                        : 'border-[#142218]/10 bg-white hover:border-[#005D51]/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="plan"
                        className="mt-1 size-4 accent-[#005D51]"
                        checked={form.planChoice === plan.id}
                        onChange={() => setForm((s) => ({ ...s, planChoice: plan.id }))}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-lora text-lg font-semibold text-[#142218]">
                            {plan.name}
                          </span>
                          <span className="font-poppins text-sm font-semibold text-[#005D51]">
                            {plan.price}
                          </span>
                        </div>
                        {plan.note ? (
                          <p className="mt-1 font-poppins text-xs text-[#4a5c50]">{plan.note}</p>
                        ) : null}
                        <ul className="mt-3 list-disc space-y-1 pl-4 font-poppins text-xs leading-relaxed text-[#4a5c50] marker:text-[#005D51]">
                          {plan.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className={cardShell}>
              <div className="flex flex-col gap-8">
                <fieldset>
                  <legend className={labelClass}>Consistent reader?</legend>
                  <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">
                    There is no wrong answer—honesty helps us support you.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {(
                      [
                        ['yes', 'Yes'],
                        ['no', 'No'],
                        ['not_sure', 'Not sure yet'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={choiceCardClass(form.consistentReader === value)}
                      >
                        <input
                          type="radio"
                          name="cons"
                          className="mt-1 size-4 accent-[#005D51]"
                          checked={form.consistentReader === value}
                          onChange={() =>
                            setForm((s) => ({ ...s, consistentReader: value }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className={labelClass}>Books in the last 12 months</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(
                      [
                        ['0', '0'],
                        ['1-3', '1–3'],
                        ['3-5', '3–5'],
                        ['5-10', '5–10'],
                        ['more_than_10', '10+'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border-2 px-2 text-center font-poppins text-sm font-medium transition ${
                          form.booksLast12Months === value
                            ? 'border-[#005D51] bg-[#F0FFFD] text-[#142218]'
                            : 'border-[#142218]/10 bg-white text-[#4a5c50] hover:border-[#005D51]/25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="books"
                          className="sr-only"
                          checked={form.booksLast12Months === value}
                          onChange={() =>
                            setForm((s) => ({ ...s, booksLast12Months: value }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className={labelClass}>Topics you want to read (multi-select)</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BOOK_OPTIONS.map(({ value, label }) => {
                      const on = form.bookTypes.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setForm((s) => ({
                              ...s,
                              bookTypes: toggleBookType(s.bookTypes, value),
                            }))
                          }
                          className={`rounded-full border-2 px-3.5 py-2 font-poppins text-xs font-semibold transition ${
                            on
                              ? 'border-[#005D51] bg-[#005D51] text-white'
                              : 'border-[#142218]/12 bg-white text-[#4a5c50] hover:border-[#005D51]/30'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {form.bookTypes.includes('other') ? (
                    <div className="mt-4">
                      <label className={labelClass} htmlFor="bookOther">
                        Describe “Other”
                      </label>
                      <input
                        id="bookOther"
                        className={`${inputClass} mt-1.5`}
                        value={form.bookTypesOther}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, bookTypesOther: e.target.value }))
                        }
                        placeholder="e.g. History, parenting…"
                      />
                    </div>
                  ) : null}
                </fieldset>
                <fieldset>
                  <legend className={labelClass}>
                    ~90 minutes on weekends for reading &amp; review?
                  </legend>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                    {(
                      [
                        ['yes', 'Yes, I can'],
                        ['no', 'Not at the moment'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex-1 ${choiceCardClass(form.weekendCommitment === value)}`}
                      >
                        <input
                          type="radio"
                          name="wknd"
                          className="mt-1 size-4 accent-[#005D51]"
                          checked={form.weekendCommitment === value}
                          onChange={() =>
                            setForm((s) => ({ ...s, weekendCommitment: value }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className={cardShell}>
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <label className={labelClass} htmlFor="commit-range">
                      How committed can you be?
                    </label>
                    <span className="font-lora text-2xl font-semibold text-[#005D51]">
                      {form.commitmentScale}
                      <span className="font-poppins text-sm font-normal text-[#4a5c50]">/10</span>
                    </span>
                  </div>
                  <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">
                    1 = still exploring · 10 = ready to protect this habit on your calendar.
                  </p>
                  <input
                    id="commit-range"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={form.commitmentScale}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        commitmentScale: Number(e.target.value),
                      }))
                    }
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-black/[0.08] accent-[#005D51] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#005D51] [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <div className="mt-2 flex justify-between font-poppins text-[10px] font-medium uppercase tracking-wide text-[#9aa89e]">
                    <span>Exploring</span>
                    <span>All in</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="goals">
                    Reading goals · next 12 months
                  </label>
                  <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">
                    Rough book count or themes—whatever feels honest.
                  </p>
                  <textarea
                    id="goals"
                    rows={4}
                    className={`${inputClass} mt-2 min-h-[120px] resize-y`}
                    value={form.readingGoals12m}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, readingGoals12m: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <p className={labelClass}>Portrait of you</p>
                  <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">
                    Clear face, good light. Image or PDF, up to 10 MB.
                  </p>
                  <label
                    htmlFor="portrait"
                    className="mt-3 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#142218]/15 bg-[#FAFAFA] px-4 py-6 text-center transition hover:border-[#005D51]/35 hover:bg-[#F0FFFD]/40"
                  >
                    <span className="font-poppins text-sm font-semibold text-[#005D51]">
                      {portrait ? 'Replace file' : 'Tap to choose a file'}
                    </span>
                    {portrait ? (
                      <span className="mt-2 truncate font-poppins text-xs text-[#4a5c50]">
                        {portrait.name}
                      </span>
                    ) : (
                      <span className="mt-2 font-poppins text-xs text-[#7B7B7B]">
                        JPG, PNG, WebP, or PDF
                      </span>
                    )}
                    <input
                      id="portrait"
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      className="sr-only"
                      onChange={(e) => setPortrait(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                <fieldset>
                  <legend className={labelClass}>How did you find Emprinte?</legend>
                  <div className="mt-3 flex flex-col gap-2">
                    {(
                      [
                        ['facebook', 'Facebook'],
                        ['twitter', 'X (Twitter)'],
                        ['instagram', 'Instagram'],
                        ['linkedin', 'LinkedIn'],
                        ['community_member', 'Someone in the community'],
                        ['other', 'Other'],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value} className={choiceCardClass(form.referralSource === value)}>
                        <input
                          type="radio"
                          name="ref"
                          className="mt-1 size-4 accent-[#005D51]"
                          checked={form.referralSource === value}
                          onChange={() =>
                            setForm((s) => ({ ...s, referralSource: value }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  {form.referralSource === 'other' ? (
                    <input
                      className={`${inputClass} mt-3`}
                      value={form.referralOther}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, referralOther: e.target.value }))
                      }
                      placeholder="Tell us in a few words"
                    />
                  ) : null}
                </fieldset>
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className={cardShell}>
              <div className="rounded-xl bg-[#FFF7ED] px-4 py-3 font-poppins text-sm leading-relaxed text-[#7c2d12] ring-1 ring-[#E85D04]/20">
                Pay <strong>₦3,000</strong> only, then upload the receipt below. Use your
                full name in the transfer narration so we can match payment to you.
              </div>
              <ul className="mt-6 space-y-2 rounded-2xl border border-[#005D51]/12 bg-[#F0FFFD]/80 p-5 font-poppins text-sm text-[#142218]">
                <li>
                  <span className="text-[#4a5c50]">Bank · </span>
                  <strong>Zenith Bank</strong>
                </li>
                <li>
                  <span className="text-[#4a5c50]">Account name · </span>
                  <strong>Emprinte Readers Hub</strong>
                </li>
                <li>
                  <span className="text-[#4a5c50]">Account number · </span>
                  <strong className="font-mono tracking-wide">1228370098</strong>
                </li>
                <li className="pt-1 text-xs leading-relaxed text-[#4a5c50]">
                  Narration example:{' '}
                  <em>Application fee — [Your full name]</em>
                </li>
              </ul>
              <div className="mt-6">
                <p className={labelClass}>Payment receipt</p>
                <p className="mt-1 font-poppins text-xs text-[#7B7B7B]">
                  Screenshot or PDF from your bank app. Max 10 MB.
                </p>
                <label
                  htmlFor="receipt"
                  className="mt-3 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#142218]/15 bg-[#FAFAFA] px-4 py-6 text-center transition hover:border-[#E85D04]/40 hover:bg-[#FFF7ED]/30"
                >
                  <span className="font-poppins text-sm font-semibold text-[#E85D04]">
                    {receipt ? 'Replace receipt' : 'Upload receipt'}
                  </span>
                  {receipt ? (
                    <span className="mt-2 truncate font-poppins text-xs text-[#4a5c50]">
                      {receipt.name}
                    </span>
                  ) : (
                    <span className="mt-2 font-poppins text-xs text-[#7B7B7B]">
                      PDF, image, or Word
                    </span>
                  )}
                  <input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </section>
          ) : null}

          <p className="pb-4 text-center font-poppins text-[11px] leading-relaxed text-[#9aa89e]">
            Never type passwords on this page. Need help?{' '}
            <a
              href="mailto:hello@emprintereaders.com"
              className="font-semibold text-[#005D51] underline decoration-[#005D51]/25 underline-offset-2"
            >
              hello@emprintereaders.com
            </a>
          </p>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/[0.06] bg-[#FFFCFD]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0 || busy}
            className="min-h-[48px] min-w-[96px] rounded-xl border-2 border-[#142218]/10 bg-white px-4 font-poppins text-sm font-semibold text-[#142218] transition hover:border-[#005D51]/25 disabled:opacity-35"
          >
            Back
          </button>
          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={busy}
              className="min-h-[48px] flex-1 rounded-xl bg-[#005D51] px-6 font-poppins text-sm font-semibold text-white shadow-md transition hover:bg-[#004438] disabled:opacity-55 sm:max-w-[220px] sm:flex-none"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              form="apply-wizard-form"
              disabled={busy}
              className="min-h-[48px] flex-1 rounded-xl bg-[#E85D04] px-6 font-poppins text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-55 sm:max-w-[260px] sm:flex-none"
            >
              {busy ? 'Sending…' : 'Submit application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
