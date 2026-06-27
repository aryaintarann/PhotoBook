-- =============================================
-- Kenangan Kita - Initial Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Table: couple_members (only 2 rows ever)
create table if not exists couple_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null
);

-- Table: memories
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text not null,
  moment_date date not null,
  location text,
  mood text check (mood in ('"'"'romantic'"'"', '"'"'lucu'"'"', '"'"'milestone'"'"', '"'"'liburan'"'"', '"'"'makan'"'"', '"'"'lainnya'"'"')),
  is_favorite boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_memories_moment_date on memories (moment_date desc);

-- Enable RLS on memories
alter table memories enable row level security;

-- RLS Policies for memories
create policy "couple can read memories"
  on memories for select
  to authenticated
  using (auth.uid() in (select user_id from couple_members));

create policy "couple can insert memories"
  on memories for insert
  to authenticated
  with check (auth.uid() in (select user_id from couple_members));

create policy "couple can update memories"
  on memories for update
  to authenticated
  using (auth.uid() in (select user_id from couple_members))
  with check (auth.uid() in (select user_id from couple_members));

create policy "couple can delete memories"
  on memories for delete
  to authenticated
  using (auth.uid() in (select user_id from couple_members));

-- =============================================
-- STORAGE SETUP (run AFTER creating bucket)
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create bucket named "memories-photos" with Public = OFF
-- 3. Then run the policies below
-- =============================================

create policy "couple can read photos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = '"'"'memories-photos'"'"'
    and auth.uid() in (select user_id from couple_members)
  );

create policy "couple can upload photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = '"'"'memories-photos'"'"'
    and auth.uid() in (select user_id from couple_members)
  );

create policy "couple can delete photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = '"'"'memories-photos'"'"'
    and auth.uid() in (select user_id from couple_members)
  );

-- =============================================
-- AFTER SETUP: Insert couple members
-- Replace the UUIDs with actual user UUIDs from
-- Authentication > Users in Supabase Dashboard
-- =============================================
-- insert into couple_members (user_id, display_name) values
--   ('"'"'uuid-user-1-here'"'"', '"'"'Nama Kamu'"'"'),
--   ('"'"'uuid-user-2-here'"'"', '"'"'Nama Pasangan'"'"');
