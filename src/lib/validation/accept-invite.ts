import { z } from 'zod';

export const acceptInviteFormSchema = z
  .object({
    token: z.string().trim().min(1, 'Invite link is invalid or missing.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  });
