-- Single-row homepage "Build a Reader" progress (admin-editable, read via API).
create table if not exists public.landing_build_a_reader (
  id smallint primary key default 1,
  books_collected integer not null default 119,
  total_books integer not null default 500,
  price_per_book integer not null default 2500,
  updated_at timestamptz not null default now(),
  constraint landing_build_a_reader_singleton check (id = 1)
);

insert into public.landing_build_a_reader (id, books_collected, total_books, price_per_book)
values (1, 119, 500, 2500)
on conflict (id) do nothing;

alter table public.landing_build_a_reader enable row level security;
