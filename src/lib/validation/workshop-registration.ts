import { z } from 'zod';

export const financialCategoryValues = [
  'borrower',
  'spender',
  'saver',
  'lender_investor',
] as const;

export type FinancialCategory = (typeof financialCategoryValues)[number];

const receiptPathPattern = /^anonymous\/[0-9a-f-]{36}\/receipt-[0-9]+\.[a-z0-9]+$/i;

export const workshopRegistrationSchema = z
  .object({
    workshopId: z.string().uuid('Workshop is required'),
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .max(200, 'Name is too long'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    primaryGoal: z
      .string()
      .trim()
      .min(1, 'Please share your primary goal')
      .max(2000, 'Response is too long'),
    isMember: z.enum(['yes', 'no']),
    financialCategory: z.enum(financialCategoryValues),
    financeChallenges: z
      .string()
      .trim()
      .min(1, 'Please describe your challenges')
      .max(4000, 'Response is too long'),
    workshopQuestions: z
      .string()
      .trim()
      .min(1, 'Please share your questions for the workshop')
      .max(4000, 'Response is too long'),
    receiptStoragePath: z
      .string()
      .trim()
      .max(500)
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.isMember === 'no') {
      const path = data.receiptStoragePath?.trim();
      if (!path) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Payment receipt is required for non-members.',
          path: ['receiptStoragePath'],
        });
        return;
      }
      if (!receiptPathPattern.test(path)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid receipt reference.',
          path: ['receiptStoragePath'],
        });
      }
    }
  });

export type WorkshopRegistrationInput = z.infer<typeof workshopRegistrationSchema>;

export function isValidWorkshopReceiptPath(path: string): boolean {
  return receiptPathPattern.test(path.trim());
}
