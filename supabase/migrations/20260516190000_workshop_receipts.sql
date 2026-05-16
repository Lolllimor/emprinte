-- Workshop fee receipts for non-member registrations.

alter table landing.workshop_registrations
  add column if not exists receipt_storage_path text;

comment on column landing.workshop_registrations.receipt_storage_path is
  'Storage path in workshop-registrations bucket; required when is_member is false.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workshop-registrations',
  'workshop-registrations',
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
