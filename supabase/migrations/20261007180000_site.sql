create table public.site_content (
  id int primary key default 1 check (id = 1),
  body jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;

insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;
