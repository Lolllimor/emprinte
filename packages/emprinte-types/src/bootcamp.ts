import type {
  BootcampExplorePaletteKey,
  BootcampPaymentStatus,
  BootcampRequestStatus,
  BootcampStatus,
  ParticipantType,
} from './enums';

/** `public.bootcamps` — shared between app Explore and landing references. */
export interface BootcampRow {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  linked_book: string | null;
  start_date: string;
  end_date: string;
  duration_days: number;
  guest_price: number;
  check_in_enabled: boolean;
  check_in_time: string;
  check_out_time: string;
  status: BootcampStatus;
  group_open: boolean;
  max_participants: number | null;
  explore_palette_key: BootcampExplorePaletteKey | null;
  created_at: string;
}

/** `public.bootcamp_participants` — in-app enrollment (authenticated). */
export interface BootcampParticipantRow {
  id: string;
  bootcamp_id: string;
  user_id: string;
  participant_type: ParticipantType;
  payment_ref: string | null;
  payment_status: BootcampPaymentStatus; // app alias: PaymentStatus
  request_status: BootcampRequestStatus;
  joined_at: string;
}

/** App-enriched bootcamp (UI). */
export interface Bootcamp extends BootcampRow {
  participant_count?: number;
  is_enrolled?: boolean;
  anchor_name?: string;
  anchor_initials?: string;
}
