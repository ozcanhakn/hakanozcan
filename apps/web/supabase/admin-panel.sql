-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It is safe to run more than once. The site keeps working before you run it,
-- the admin panel simply shows which features still need it.

-- 1) Draft / published state for blog posts.
alter table public.blogs
  add column if not exists published boolean not null default true;

-- 2) Site settings: section visibility, hidden Medium posts and editable texts.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);
-- No insert/update policy on purpose: only the admin panel (service role key) can write.

-- 3) OPTIONAL but recommended: make drafts private at the database level.
-- The site already hides unpublished posts, but while an old "read everything" policy
-- exists on public.blogs, anyone who calls the Supabase API directly could still read drafts.
-- Step A: look at your current select policies:
--   select policyname, cmd, qual from pg_policies where schemaname = 'public' and tablename = 'blogs';
-- Step B: drop the one that has qual = 'true' (replace the name below), then create this policy:
--   drop policy "<your old read policy name>" on public.blogs;
--   create policy "Public can read published posts"
--     on public.blogs for select
--     using (published = true);
