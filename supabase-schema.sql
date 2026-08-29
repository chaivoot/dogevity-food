-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This schema covers only the landing page. The webapp (dashboard, dogs,
-- weights, health, recipe, dog-photos storage) has moved to a separate
-- project at app.dogsanook.com — its tables (user_data, storage bucket
-- dog-photos) are not managed from this repo.

-- ─── Contacts (landing page form submissions) ───────────────────────────────
create table if not exists contacts (
  id           uuid default gen_random_uuid() primary key,
  name         text,
  dog          text,
  weight       numeric,
  age          numeric,
  phone        text,
  line_id      text,
  current_food text,
  note         text,
  created_at   timestamptz default now()
);

alter table contacts enable row level security;

create policy "anyone can submit contact" on contacts
  for insert with check (true);
