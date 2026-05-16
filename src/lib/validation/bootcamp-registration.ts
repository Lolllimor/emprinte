import { z } from 'zod';

export const bootcampRegistrationSchema = z.object({
  bootcampId: z.string().uuid('Bootcamp is required'),
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
  phone: z
    .string()
    .trim()
    .max(40, 'Phone number is too long')
    .optional()
    .nullable(),
  message: z
    .string()
    .trim()
    .min(1, 'Tell us why you want to join')
    .max(4000, 'Response is too long'),
});

export type BootcampRegistrationInput = z.infer<typeof bootcampRegistrationSchema>;
