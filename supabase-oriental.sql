-- Oriental Public School website CMS
-- Run this entire file once in Supabase > SQL Editor.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

drop policy if exists site_admins_read_own on public.site_admins;
create policy site_admins_read_own
  on public.site_admins for select to authenticated
  using (user_id = auth.uid());

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  constraint site_content_is_object check (jsonb_typeof(content) = 'object')
);

alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop policy if exists oriental_content_public_read on public.site_content;
create policy oriental_content_public_read
  on public.site_content for select to anon, authenticated
  using (id = 'oriental-main');

drop policy if exists oriental_content_admin_insert on public.site_content;
create policy oriental_content_admin_insert
  on public.site_content for insert to authenticated
  with check (
    id = 'oriental-main'
    and updated_by = auth.uid()
    and public.is_site_admin()
  );

drop policy if exists oriental_content_admin_update on public.site_content;
create policy oriental_content_admin_update
  on public.site_content for update to authenticated
  using (id = 'oriental-main' and public.is_site_admin())
  with check (
    id = 'oriental-main'
    and updated_by = auth.uid()
    and public.is_site_admin()
  );

insert into public.site_content (id, content)
values ('oriental-main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 5242880, array['image/webp'])
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/webp'];

drop policy if exists oriental_assets_public_read on storage.objects;
create policy oriental_assets_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-assets');

drop policy if exists oriental_assets_admin_insert on storage.objects;
create policy oriental_assets_admin_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-assets' and public.is_site_admin());

drop policy if exists oriental_assets_admin_update on storage.objects;
create policy oriental_assets_admin_update
  on storage.objects for update to authenticated
  using (bucket_id = 'site-assets' and public.is_site_admin())
  with check (bucket_id = 'site-assets' and public.is_site_admin());

drop policy if exists oriental_assets_admin_delete on storage.objects;
create policy oriental_assets_admin_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-assets' and public.is_site_admin());

do $$
begin
  alter publication supabase_realtime add table public.site_content;
exception when duplicate_object then null;
end $$;

-- After creating an administrator in Authentication > Users, run separately:
-- insert into public.site_admins (user_id)
-- values ('PASTE-THE-AUTH-USER-UUID-HERE')
-- on conflict (user_id) do nothing;

