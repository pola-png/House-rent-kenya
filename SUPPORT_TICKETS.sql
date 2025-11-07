-- Support tickets table and policies for Supabase
-- Run this script in your Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  attachments jsonb not null default '[]'::jsonb,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_tickets_created on public.support_tickets(created_at desc);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.support_tickets enable row level security;

-- Allow anyone (anon or authenticated) to create a ticket (must include email if no auth)
drop policy if exists support_insert_anyone on public.support_tickets;
create policy support_insert_anyone on public.support_tickets
for insert
to anon, authenticated
with check (
  -- if authenticated, allow; if anon, require an email
  (auth.role() = 'authenticated') or (email is not null and length(trim(email)) > 3)
);

-- Allow authenticated users to read their own tickets
drop policy if exists support_select_self on public.support_tickets;
create policy support_select_self on public.support_tickets
for select
to authenticated
using (user_id = auth.uid());

-- Allow admins to read all tickets
drop policy if exists support_select_admin on public.support_tickets;
create policy support_select_admin on public.support_tickets
for select
to authenticated
using (exists(
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

-- Allow admins to update any ticket; allow owners to update their subject/message only
drop policy if exists support_update_admin on public.support_tickets;
create policy support_update_admin on public.support_tickets
for update
to authenticated
using (exists(
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

drop policy if exists support_update_owner on public.support_tickets;
create policy support_update_owner on public.support_tickets
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
);

-- Owners cannot delete; Admins can delete (optional)
drop policy if exists support_delete_admin on public.support_tickets;
create policy support_delete_admin on public.support_tickets
for delete
to authenticated
using (exists(
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

comment on table public.support_tickets is 'Support/contact tickets from users and visitors';

