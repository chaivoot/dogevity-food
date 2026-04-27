-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists user_data (
  user_id uuid references auth.users primary key,
  dog     jsonb not null default '{}',
  weights jsonb not null default '[]',
  health  jsonb not null default '[]',
  updated_at timestamptz default now()
);

alter table user_data enable row level security;

create policy "users manage own data" on user_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
