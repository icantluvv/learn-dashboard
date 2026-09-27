create table public.user_avatar (
	"id" uuid primary key,
	"user_id" text not null unique references public."user" ("id") on delete cascade,
	"content_type" text not null check ("content_type" in ('image/jpeg', 'image/png', 'image/webp')),
	"byte_length" integer not null check ("byte_length" between 1 and 5242880),
	"data" bytea not null,
	"created_at" timestamptz not null default now()
);

alter table public.user_avatar enable row level security;

create policy "deny all to anon and authenticated" on public.user_avatar
	for all
	to anon, authenticated
	using (false)
	with check (false);
