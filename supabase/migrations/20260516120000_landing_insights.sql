-- Blog / insights articles: persisted for production (in-memory store resets on each deploy).
create table if not exists public.landing_insights (
  id text primary key,
  date text not null,
  title text not null,
  description text not null,
  image text not null,
  body text,
  href text,
  author_name text,
  author_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists landing_insights_created_at_idx
  on public.landing_insights (created_at desc);

alter table public.landing_insights enable row level security;

revoke all on table public.landing_insights from public;
grant select, insert, update, delete on table public.landing_insights to service_role;
