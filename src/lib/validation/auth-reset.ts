import { z } from 'zod';

export const forgotPasswordEmailSchema = z.object({
  email: z.string().trim().email('Enter a valid email.'),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email(),
  code: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Enter the 4-digit code from your email.'),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  });
