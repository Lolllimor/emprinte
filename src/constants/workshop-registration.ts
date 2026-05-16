import type { FinancialCategory } from '@/lib/validation/workshop-registration';

export const WORKSHOP_WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP_GROUP_URL ??
  'https://chat.whatsapp.com/KT3Krko9PfaB5yx6hfTGUq';

export const FINANCIAL_CATEGORY_OPTIONS: {
  value: FinancialCategory;
  label: string;
  hint: string;
}[] = [
  {
    value: 'borrower',
    label: 'Borrower',
    hint: 'Most income goes to repaying debt or loans.',
  },
  {
    value: 'spender',
    label: 'Spender',
    hint: 'Money flows out quickly — little left to plan with.',
  },
  {
    value: 'saver',
    label: 'Saver',
    hint: 'You set money aside, but growth may still feel unclear.',
  },
  {
    value: 'lender_investor',
    label: 'Lender / Investor',
    hint: 'You already deploy money — you want sharper systems.',
  },
];

export const WORKSHOP_WIZARD_STEPS = [
  {
    short: 'You',
    title: 'About you',
    subtitle:
      'How we reach you and what you hope to gain from the session.',
  },
  {
    short: 'Money',
    title: 'Your money picture',
    subtitle:
      'Honest answers help us shape examples and Q&A for the room.',
  },
] as const;

export const WORKSHOP_PAGE_COPY = {
  kicker: 'Exclusive workshop',
  title: 'Practical Steps to Financial Independence',
  lead: 'A focused session for young professionals and entrepreneurs ready to build a clearer system for keeping and growing money.',
  privacyNote:
    'Your answers are used only to plan this workshop. We do not sell your data.',
};

export const WORKSHOP_THANK_YOU_COPY = {
  title: 'You’re registered',
  body: 'Your spot is saved. Join the waiting group on WhatsApp so we can share venue details, reminders, and pre-work before the session.',
  cta: 'Join WhatsApp group',
};
