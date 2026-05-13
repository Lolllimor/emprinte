-- Landing site: newsletter signups (kept out of public schema).
-- Remote projects: add schema "landing" under Project Settings → API → Exposed schemas
-- if PostgREST returns errors about the schema not being exposed.

create schema if not exists landing;

create table if not exists landing.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_full_name_len check (
    char_length(full_name) between 1 and 200
  ),
  constraint newsletter_subscribers_email_len check (char_length(email) between 1 and 320),
  constraint newsletter_subscribers_phone_len check (char_length(phone) between 7 and 80)
);

create unique index if not exists newsletter_subscribers_email_lower_uidx
  on landing.newsletter_subscribers (lower(trim(email)));

alter table landing.newsletter_subscribers enable row level security;

drop policy if exists "landing_newsletter_insert_anon" on landing.newsletter_subscribers;
create policy "landing_newsletter_insert_anon"
  on landing.newsletter_subscribers
  for insert
  to anon
  with check (true);

revoke all on table landing.newsletter_subscribers from public;

grant usage on schema landing to anon, authenticated, service_role;
grant insert on table landing.newsletter_subscribers to anon;
grant select, insert, update, delete on table landing.newsletter_subscribers to service_role;
