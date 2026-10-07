-- Leads are written by the server with the service role.
-- Visitors never get a key that can read this table.

create table public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('booking', 'ads', 'field', 'rental', 'guest', 'account', 'partnership')),
  name text not null check (char_length(name) between 2 and 80),
  phone text check (phone is null or char_length(phone) <= 32),
  telegram text check (telegram is null or char_length(telegram) <= 64),
  location text check (location is null or location in ('razgovor', 'stol', 'noch')),
  slot_date date,
  slot_time text check (slot_time is null or slot_time in ('11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00')),
  topic text check (topic is null or char_length(topic) <= 120),
  message text check (message is null or char_length(message) <= 2000),
  page text check (page is null or char_length(page) <= 80)
);

create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;

create table public.slot_blocks (
  id bigint generated always as identity primary key,
  location text not null check (location in ('razgovor', 'stol', 'noch')),
  slot_date date not null,
  slot_time text not null check (slot_time in ('11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00')),
  unique (location, slot_date, slot_time)
);

create index slot_blocks_lookup_idx on public.slot_blocks (location, slot_date);

alter table public.slot_blocks enable row level security;
revoke all on table public.slot_blocks from anon, authenticated;
