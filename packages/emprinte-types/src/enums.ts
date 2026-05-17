/** App + DB role for `public.users.role` and `public.user_roles.role` (non-admin writes: `user` only). */
export type UserRole = 'member' | 'admin' | 'removed';

export type AppRole = 'user' | 'admin' | 'moderator';

export type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'inactive';

export type CommunitySubscriptionTier = 'monthly' | 'quarterly';

export type BookFormat = 'pdf' | 'epub';

export type PostType =
  | 'general'
  | 'learning'
  | 'bootcamp'
  | 'announcement'
  | 'review_quote';

export type ReactionEmoji = '🔥' | '📚' | '💡';

export const REACTION_EMOJIS: readonly ReactionEmoji[] = ['🔥', '📚', '💡'];

export type BootcampStatus = 'upcoming' | 'active' | 'closed';

export type BootcampExplorePaletteKey = 'yellow' | 'grey' | 'blue' | 'red';

export type ParticipantType = 'member' | 'guest' | 'admin_added';

export type BootcampPaymentStatus = 'pending' | 'paid' | 'free';

/** @deprecated Use BootcampPaymentStatus — kept for mobile app import alias. */
export type PaymentStatus = BootcampPaymentStatus;

export type BootcampRequestStatus = 'pending' | 'approved' | 'rejected';

/** Landing workshop form (`landing.workshop_registrations.financial_category`). */
export type WorkshopFinancialCategory =
  | 'borrower'
  | 'spender'
  | 'saver'
  | 'lender_investor';

export type RegistrationSource = 'web' | 'app';

/** Mobile + admin hub volunteer tiers (app-only until web admin shares roster UI). */
export type AdminTier = 'director' | 'executive' | 'volunteer';
