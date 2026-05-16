import { z } from 'zod';

export const financialCategoryValues = [
  'borrower',
  'spender',
  'saver',
  'lender_investor',
] as const;

export type FinancialCategory = (typeof financialCategoryValues)[number];

export const workshopRegistrationSchema = z.object({
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
});

export type WorkshopRegistrationInput = z.infer<typeof workshopRegistrationSchema>;
