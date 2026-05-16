-- Unify landing workshop registrations with app workshops (`public.challenges`).

-- ─── Workshop event fields (app + web share this row) ───────────────────────
alter table public.challenges
  add column if not exists slug text,
  add column if not exists registration_open boolean not null default false,
  add column if not exists fee_amount_naira integer,
  add column if not exists whatsapp_group_url text,
  add column if not exists landing_lead text;

create unique index if not exists challenges_slug_lower_uidx
  on public.challenges (lower(trim(slug)))
  where slug is not null and trim(slug) <> '';

-- Canonical landing workshop (same event on app Explore when linked by slug).
insert into public.challenges (
  id,
  title,
  description,
  duration_days,
  start_date,
  end_date,
  status,
  is_auto_approve,
  slug,
  registration_open,
  fee_amount_naira,
  whatsapp_group_url,
  landing_lead
)
values (
  '20260516-0000-4000-8000-000000000001'::uuid,
  'Practical Steps to Financial Independence',
  'A focused session for young professionals and entrepreneurs ready to build a clearer system for keeping and growing money.',
  1,
  null,
  null,
  'active',
  false,
  'practical-steps-financial-independence',
  true,
  5000,
  'https://chat.whatsapp.com/KT3Krko9PfaB5yx6hfTGUq',
  'A focused session for young professionals and entrepreneurs ready to build a clearer system for keeping and growing money.'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  slug = excluded.slug,
  registration_open = excluded.registration_open,
  fee_amount_naira = excluded.fee_amount_naira,
  whatsapp_group_url = excluded.whatsapp_group_url,
  landing_lead = excluded.landing_lead,
  status = excluded.status;

-- ─── Link web registrations to workshop row ───────────────────────────────────
alter table landing.workshop_registrations
  add column if not exists workshop_id uuid references public.challenges (id) on delete restrict;

update landing.workshop_registrations
set workshop_id = '20260516-0000-4000-8000-000000000001'::uuid
where workshop_id is null;

alter table landing.workshop_registrations
  alter column workshop_id set not null;

create index if not exists workshop_registrations_workshop_id_idx
  on landing.workshop_registrations (workshop_id);
