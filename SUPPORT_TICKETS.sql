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

-- Add camelCase timestamp columns to match app conventions
alter table public.support_tickets
  add column if not exists "createdAt" timestamptz not null default now();
alter table public.support_tickets
  add column if not exists "updatedAt" timestamptz not null default now();
create index if not exists idx_support_tickets_createdAt on public.support_tickets("createdAt" desc);

-- Lightweight summary field for list views
alter table public.support_tickets
  add column if not exists "lastMessage" text not null default '';

-- Ensure message has a safe default to avoid NOT NULL violations from older clients
alter table public.support_tickets
  alter column message set default '';

-- CamelCase userId mirror for compatibility with app code
alter table public.support_tickets
  add column if not exists "userId" uuid references public.profiles(id) on delete set null;
create index if not exists idx_support_tickets_userId on public.support_tickets("userId");

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new."updatedAt" := now();
  return new;
end; $$;

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

-- Keep user_id and "userId" in sync on insert/update
create or replace function public.support_tickets_sync_userid()
returns trigger language plpgsql as $$
begin
  if new."userId" is null and new.user_id is not null then
    new."userId" := new.user_id;
  elsif new.user_id is null and new."userId" is not null then
    new.user_id := new."userId";
  end if;
  return new;
end; $$;

drop trigger if exists trg_support_tickets_sync_userid_ins on public.support_tickets;
create trigger trg_support_tickets_sync_userid_ins
before insert on public.support_tickets
for each row execute function public.support_tickets_sync_userid();

drop trigger if exists trg_support_tickets_sync_userid_upd on public.support_tickets;
create trigger trg_support_tickets_sync_userid_upd
before update on public.support_tickets
for each row execute function public.support_tickets_sync_userid();

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

-- ---------------------------------------------------------------------------
-- Messages table for per-ticket conversation threads
-- ---------------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  "ticketId" uuid, -- camelCase mirror
  user_id uuid references public.profiles(id) on delete set null,
  "userId" uuid,   -- camelCase mirror
  message text not null default '',
  body text not null default '', -- mirror for compatibility
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists idx_messages_ticket on public.messages(ticket_id);
create index if not exists idx_messages_ticketId on public.messages("ticketId");
create index if not exists idx_messages_user on public.messages(user_id);
create index if not exists idx_messages_userId on public.messages("userId");
create index if not exists idx_messages_created on public.messages(created_at desc);
create index if not exists idx_messages_createdAt on public.messages("createdAt" desc);

-- Keep snake/camel ids in sync
create or replace function public.messages_sync_ids()
returns trigger language plpgsql as $$
begin
  if new."ticketId" is null and new.ticket_id is not null then
    new."ticketId" := new.ticket_id;
  elsif new.ticket_id is null and new."ticketId" is not null then
    new.ticket_id := new."ticketId";
  end if;
  if new."userId" is null and new.user_id is not null then
    new."userId" := new.user_id;
  elsif new.user_id is null and new."userId" is not null then
    new.user_id := new."userId";
  end if;
  return new;
end; $$;

drop trigger if exists trg_messages_sync_ids_ins on public.messages;
create trigger trg_messages_sync_ids_ins
before insert on public.messages
for each row execute function public.messages_sync_ids();

drop trigger if exists trg_messages_sync_ids_upd on public.messages;
create trigger trg_messages_sync_ids_upd
before update on public.messages
for each row execute function public.messages_sync_ids();

-- Keep message/body mirrors in sync and update timestamps
create or replace function public.messages_sync_fields()
returns trigger language plpgsql as $$
begin
  if (new.message is null or length(new.message) = 0) and (new.body is not null) then
    new.message := new.body;
  elsif (new.body is null or length(new.body) = 0) and (new.message is not null) then
    new.body := new.message;
  end if;
  new.updated_at := now();
  new."updatedAt" := now();
  return new;
end; $$;

drop trigger if exists trg_messages_sync_fields_ins on public.messages;
create trigger trg_messages_sync_fields_ins
before insert on public.messages
for each row execute function public.messages_sync_fields();

drop trigger if exists trg_messages_sync_fields_upd on public.messages;
create trigger trg_messages_sync_fields_upd
before update on public.messages
for each row execute function public.messages_sync_fields();

-- Row Level Security policies for messages
alter table public.messages enable row level security;

-- Select: ticket owner, assigned agent, or admin
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
for select to authenticated
using (
  exists (
    select 1 from public.support_tickets st
    where st.id = messages.ticket_id
      and (
        st.user_id = auth.uid()
        or st.assigned_to = auth.uid()
        or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      )
  )
);

-- Insert: ticket owner, assigned agent, or admin
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
for insert to authenticated
with check (
  exists (
    select 1 from public.support_tickets st
    where st.id = ticket_id
      and (
        st.user_id = auth.uid()
        or st.assigned_to = auth.uid()
        or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      )
  )
);

-- Update/Delete: author of message or admin
drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages
for update to authenticated
using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists messages_delete on public.messages;
create policy messages_delete on public.messages
for delete to authenticated
using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
