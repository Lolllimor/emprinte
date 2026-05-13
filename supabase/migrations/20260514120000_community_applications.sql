-- Community membership application (web /apply flow). Requires Supabase Auth.
-- Remote: ensure schema "landing" is exposed (Project Settings → API) like newsletter migration.

create table if not exists landing.community_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  gender text not null,
  date_of_birth date not null,
  location text not null,
  professional_status text not null,
  plan_choice text not null,
  consistent_reader text not null,
  books_last_12_months text not null,
  book_types jsonb not null,
  book_types_other text,
  weekend_commitment text not null,
  commitment_scale smallint not null,
  reading_goals_12m text not null,
  portrait_storage_path text not null,
  referral_source text not null,
  referral_other text,
  receipt_storage_path text not null,
  submitted_at timestamptz not null default now(),
  constraint community_applications_email_len check (char_length(email) between 1 and 320),
  constraint community_applications_first_name_len check (char_length(first_name) between 1 and 120),
  constraint community_applications_last_name_len check (char_length(last_name) between 1 and 120),
  constraint community_applications_phone_len check (char_length(phone) between 5 and 80),
  constraint community_applications_location_len check (char_length(location) between 1 and 300),
  constraint community_applications_reading_goals_len check (char_length(reading_goals_12m) between 1 and 4000),
  constraint community_applications_gender_chk check (
    gender in ('male', 'female', 'prefer_not_to_say')
  ),
  constraint community_applications_professional_status_chk check (
    professional_status in ('student_nysc', 'employed', 'entrepreneur', 'unemployed')
  ),
  constraint community_applications_plan_chk check (
    plan_choice in ('quarterly', 'monthly', 'student')
  ),
  constraint community_applications_consistent_reader_chk check (
    consistent_reader in ('yes', 'no', 'not_sure')
  ),
  constraint community_applications_books_chk check (
    books_last_12_months in ('0', '1-3', '3-5', '5-10', 'more_than_10')
  ),
  constraint community_applications_weekend_chk check (
    weekend_commitment in ('yes', 'no')
  ),
  constraint community_applications_commitment_scale_chk check (
    commitment_scale between 1 and 10
  ),
  constraint community_applications_referral_chk check (
    referral_source in ('facebook', 'twitter', 'instagram', 'linkedin', 'community_member', 'other')
  )
);

create unique index if not exists community_applications_user_id_uidx
  on landing.community_applications (user_id);

alter table landing.community_applications enable row level security;

drop policy if exists "community_applications_insert_own" on landing.community_applications;
create policy "community_applications_insert_own"
  on landing.community_applications
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "community_applications_select_own" on landing.community_applications;
create policy "community_applications_select_own"
  on landing.community_applications
  for select
  to authenticated
  using (user_id = auth.uid());

revoke all on table landing.community_applications from public;

grant select, insert on table landing.community_applications to authenticated;
grant select, insert, update, delete on table landing.community_applications to service_role;

-- Private uploads: first path segment must equal auth.uid()
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-applications',
  'community-applications',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "community_apps_storage_insert_own" on storage.objects;
create policy "community_apps_storage_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'community-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "community_apps_storage_select_own" on storage.objects;
create policy "community_apps_storage_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'community-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "community_apps_storage_update_own" on storage.objects;
create policy "community_apps_storage_update_own"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'community-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'community-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "community_apps_storage_delete_own" on storage.objects;
create policy "community_apps_storage_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'community-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
