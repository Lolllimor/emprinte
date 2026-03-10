import { z } from 'zod';

export const insightSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  date: z.string().trim().min(1, 'Date is required'),
  image: z.string().url('Image must be a valid URL'),
  href: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v : undefined)),
});

export const navigationLinkSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

export const contactInfoSchema = z.object({
  email: z.string().trim().min(1).email('Invalid email'),
  phone: z.array(
    z.object({
      label: z.string().trim().min(1),
      number: z.string().trim().min(1),
    })
  ),
});

export const socialLinkSchema = z.object({
  platform: z.enum(['instagram', 'linkedin', 'twitter']),
  href: z.string().url('Invalid URL'),
});

export const statSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

export const settingsSchema = z.object({
  navigationLinks: z.array(navigationLinkSchema),
  footerNavigation: z.array(navigationLinkSchema),
  socialMediaLinks: z.array(socialLinkSchema),
  contactInfo: contactInfoSchema,
  stats: z.array(statSchema).optional(),
});

export const buildAReaderSchema = z.object({
  booksCollected: z.number().int().min(0),
  totalBooks: z.number().int().min(1),
  pricePerBook: z.number().int().min(0),
});

export const testimonialSchema = z.object({
  id: z.string().trim().min(1),
  text: z.string().trim().min(1),
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).optional(),
});

export const testimonialsSchema = z.array(testimonialSchema);
