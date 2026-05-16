-- Web bootcamp sign-ups (non-community or guests). App members use bootcamp_participants.

create table if not exists landing.bootcamp_registrations (
  id uuid primary key default gen_random_uuid(),
  bootcamp_id uuid not null references public.bootcamps (id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  submitted_at timestamptz not null default now(),
  constraint bootcamp_registrations_full_name_len check (
    char_length(full_name) between 1 and 200
  ),
  constraint bootcamp_registrations_email_len check (
    char_length(email) between 1 and 320
  ),
  constraint bootcamp_registrations_message_len check (
    char_length(message) between 1 and 4000
  )
);

create index if not exists bootcamp_registrations_submitted_at_idx
  on landing.bootcamp_registrations (submitted_at desc);

create index if not exists bootcamp_registrations_bootcamp_id_idx
  on landing.bootcamp_registrations (bootcamp_id);

alter table landing.bootcamp_registrations enable row level security;

revoke all on table landing.bootcamp_registrations from public;

grant usage on schema landing to anon, authenticated, service_role;
grant select, insert, update, delete on table landing.bootcamp_registrations to service_role;
