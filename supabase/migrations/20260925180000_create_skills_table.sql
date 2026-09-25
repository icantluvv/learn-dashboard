create table public.skills (
	id text primary key,
	title text not null,
	topic text not null,
	difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
	questions text[] not null default '{}',
	questions_count integer generated always as (cardinality(questions)) stored,
	created_at timestamptz not null default now()
);

alter table public.skills enable row level security;

-- No anon/authenticated access: this table is only ever read through the
-- app's server-side service-role client, never directly by end users.
create policy "deny all to anon and authenticated" on public.skills
	for all
	to anon, authenticated
	using (false)
	with check (false);
