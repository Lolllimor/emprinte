import type { FinancialCategory } from '@/lib/validation/workshop-registration';

export const WORKSHOP_WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP_GROUP_URL ??
  'https://chat.whatsapp.com/KT3Krko9PfaB5yx6hfTGUq';

export const FINANCIAL_CATEGORY_OPTIONS: {
  value: FinancialCategory;
  label: string;
}[] = [
  { value: 'borrower', label: 'Borrower' },
  { value: 'spender', label: 'Spender' },
  { value: 'saver', label: 'Saver' },
  { value: 'lender_investor', label: 'Lender/Investor' },
];

export const WORKSHOP_INTRO_COPY = {
  title: 'Practical Steps to Financial Independence',
  paragraphs: [
    'This workshop is designed for young professionals and entrepreneurs who want to move from earning money to building a clear system for keeping and growing it.',
    'You will leave with practical steps you can apply immediately — not theory alone.',
    'Please answer every question honestly so we can tailor the session to the room.',
  ],
  privacyHeading: 'Data Privacy Protection:',
  privacyBody:
    'Your responses are used only to plan and improve this workshop. We do not sell your data. Contact the form owner if you have questions about how your information is handled.',
};
