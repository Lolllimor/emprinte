import type { BootcampPublic } from '@/lib/landing-bootcamps-db';

export const BOOTCAMP_THANK_YOU_COPY = {
  title: 'Request received',
  body: 'Thank you for registering. Our team will follow up by email with next steps for this bootcamp.',
  cta: 'Back to homepage',
} as const;

export function pageCopyFromBootcamp(bootcamp: BootcampPublic) {
  return {
    kicker: 'Bootcamp',
    title: bootcamp.title,
    lead:
      bootcamp.description ||
      'A structured cohort with daily accountability. Complete the form to register on the web.',
    privacyNote: 'Your answers are used only to process this bootcamp registration.',
  };
}

export function formatGuestPriceNaira(amount: number): string {
  if (amount <= 0) return '0';
  return amount.toLocaleString('en-NG');
}
