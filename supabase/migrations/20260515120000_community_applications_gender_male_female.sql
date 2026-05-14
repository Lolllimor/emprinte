-- Restrict gender to male/female (remove prefer_not_to_say from allowed values).
do $$
begin
  if exists (
    select 1
    from landing.community_applications
    where gender = 'prefer_not_to_say'
  ) then
    raise exception
      'community_applications: update or delete rows with gender = prefer_not_to_say before applying this migration';
  end if;
end $$;

alter table landing.community_applications
  drop constraint if exists community_applications_gender_chk;

alter table landing.community_applications
  add constraint community_applications_gender_chk check (gender in ('male', 'female'));
