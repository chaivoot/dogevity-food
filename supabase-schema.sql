-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists user_data (
  user_id    uuid references auth.users primary key,
  dogs       jsonb not null default '[]',
  updated_at timestamptz default now()
);

-- Add dogs column if upgrading from older schema
alter table user_data add column if not exists dogs jsonb not null default '[]';

alter table user_data enable row level security;

-- Users manage their own data
create policy "users manage own data" on user_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin can read all users' data
create policy "admin can read all" on user_data
  for select
  using (auth.jwt() ->> 'email' = 'chaivoot@gmail.com');

-- Admin can update any user's data
create policy "admin can update all" on user_data
  for update
  using (auth.jwt() ->> 'email' = 'chaivoot@gmail.com');

-- ─── Contacts (landing page form submissions) ───────────────────────────────
create table if not exists contacts (
  id         uuid default gen_random_uuid() primary key,
  name       text,
  dog        text,
  weight     numeric,
  age        numeric,
  phone      text,
  line_id    text,
  note       text,
  created_at timestamptz default now()
);

alter table contacts enable row level security;

create policy "anyone can submit contact" on contacts
  for insert with check (true);

alter table contacts add column if not exists recipe     jsonb    default '[]';
alter table contacts add column if not exists bcs         numeric;
alter table contacts add column if not exists current_food text;
alter table contacts add column if not exists allergies   text;

create policy "admin can read contacts" on contacts
  for select using (auth.jwt() ->> 'email' = 'chaivoot@gmail.com');

create policy "admin can update contacts" on contacts
  for update using (auth.jwt() ->> 'email' = 'chaivoot@gmail.com');

-- ─── Storage (dog photos) ───────────────────────────────────────────────────
-- 1. Create bucket via Supabase Dashboard → Storage → New bucket
--    Name: dog-photos   Public: YES
-- 2. Then run these RLS policies:

create policy "users upload own dog photos" on storage.objects
  for insert with check (
    bucket_id = 'dog-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "dog photos are public" on storage.objects
  for select using (bucket_id = 'dog-photos');

create policy "users update own dog photos" on storage.objects
  for update using (
    bucket_id = 'dog-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users delete own dog photos" on storage.objects
  for delete using (
    bucket_id = 'dog-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
