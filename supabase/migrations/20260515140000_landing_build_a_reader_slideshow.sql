-- Up to 5 hero image URLs for the homepage "Build a Reader" block (Cloudinary or https).
alter table public.landing_build_a_reader
  add column if not exists slideshow_urls jsonb not null default '[]'::jsonb;
