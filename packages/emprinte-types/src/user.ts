import type {
  AdminTier,
  CommunitySubscriptionTier,
  SubscriptionStatus,
  UserRole,
} from './enums';

export type { AdminTier } from './enums';

/** `public.users` row (core profile). */
export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  username: string | null;
  country: string | null;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_tier: CommunitySubscriptionTier | null;
  subscription_end_date: string | null;
  avatar_url: string | null;
  created_at: string;
}

/** `public.user_roles` row — authoritative app role mirror. */
export interface UserRoleRow {
  user_id: string;
  role: import('./enums').AppRole;
  created_at: string;
  updated_at: string;
}

/** Admin member list / RPC shape (app admin). */
export interface AdminMember {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  country?: string;
  role: UserRole;
  admin_tier?: AdminTier | null;
  is_active?: boolean;
  subscription_status: SubscriptionStatus;
  subscription_tier?: CommunitySubscriptionTier | null;
  subscription_end_date?: string;
  last_active?: string;
  created_at: string;
  books_count?: number;
  streak_count?: number;
  bootcamp_participant?: boolean;
  accountability_partner_name?: string | null;
}
