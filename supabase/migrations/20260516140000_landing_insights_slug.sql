-- Human-readable URLs: /blog/your-post-slug (still accepts legacy /blog/<id> in the app).
alter table public.landing_insights
  add column if not exists slug text;

update public.landing_insights
set slug = id
where slug is null or trim(slug) = '';

alter table public.landing_insights
  alter column slug set not null;

create unique index if not exists landing_insights_slug_lower_uidx
  on public.landing_insights (lower(trim(slug)));
