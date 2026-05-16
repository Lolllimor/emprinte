-- Workshop registration (landing /workshop/register). No auth required.

create table if not exists landing.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  primary_goal text not null,
  is_member boolean not null,
  financial_category text not null,
  finance_challenges text not null,
  workshop_questions text not null,
  submitted_at timestamptz not null default now(),
  constraint workshop_registrations_full_name_len check (
    char_length(full_name) between 1 and 200
  ),
  constraint workshop_registrations_email_len check (
    char_length(email) between 1 and 320
  ),
  constraint workshop_registrations_primary_goal_len check (
    char_length(primary_goal) between 1 and 2000
  ),
  constraint workshop_registrations_finance_challenges_len check (
    char_length(finance_challenges) between 1 and 4000
  ),
  constraint workshop_registrations_workshop_questions_len check (
    char_length(workshop_questions) between 1 and 4000
  ),
  constraint workshop_registrations_financial_category_chk check (
    financial_category in ('borrower', 'spender', 'saver', 'lender_investor')
  )
);

create index if not exists workshop_registrations_submitted_at_idx
  on landing.workshop_registrations (submitted_at desc);

alter table landing.workshop_registrations enable row level security;

revoke all on table landing.workshop_registrations from public;

grant usage on schema landing to anon, authenticated, service_role;
grant select, insert, update, delete on table landing.workshop_registrations to service_role;
