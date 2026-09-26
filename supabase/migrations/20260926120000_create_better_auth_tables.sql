-- Better Auth core schema (user, session, account, verification).
--
-- Field list mirrors `getAuthTables()` of the installed better-auth version for this project's
-- config (email + password, `user.additionalFields` = gender/age). Column names stay camelCase and
-- quoted because Better Auth queries them verbatim.

create table "user" (
	"id" text primary key,
	"name" text not null,
	"email" text not null unique,
	"emailVerified" boolean not null default false,
	"image" text,
	"gender" text not null check ("gender" in ('male', 'female', 'other')),
	"age" integer not null,
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);

create table "session" (
	"id" text primary key,
	"expiresAt" timestamptz not null,
	"token" text not null unique,
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null,
	"ipAddress" text,
	"userAgent" text,
	"userId" text not null references "user" ("id") on delete cascade
);

create index "session_userId_idx" on "session" ("userId");

create table "account" (
	"id" text primary key,
	"accountId" text not null,
	"providerId" text not null,
	"userId" text not null references "user" ("id") on delete cascade,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamptz,
	"refreshTokenExpiresAt" timestamptz,
	"scope" text,
	"password" text,
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null
);

create index "account_userId_idx" on "account" ("userId");

create table "verification" (
	"id" text primary key,
	"identifier" text not null,
	"value" text not null,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);

create index "verification_identifier_idx" on "verification" ("identifier");

-- These tables are only ever touched by Better Auth over the direct Postgres connection
-- (`SUPABASE_DB_URL`), never through PostgREST. Without RLS the anon key could read `user` rows,
-- so deny everything to anon/authenticated - same stance as `public.skills`.
alter table "user" enable row level security;
alter table "session" enable row level security;
alter table "account" enable row level security;
alter table "verification" enable row level security;

create policy "deny all to anon and authenticated" on "user"
	for all
	to anon, authenticated
	using (false)
	with check (false);

create policy "deny all to anon and authenticated" on "session"
	for all
	to anon, authenticated
	using (false)
	with check (false);

create policy "deny all to anon and authenticated" on "account"
	for all
	to anon, authenticated
	using (false)
	with check (false);

create policy "deny all to anon and authenticated" on "verification"
	for all
	to anon, authenticated
	using (false)
	with check (false);

-- Supabase grants anon/authenticated full privileges on new tables in `public` by default, so RLS
-- above is the only thing standing between the anon key and the user table. Drop the grants too:
-- two independent layers, and PostgREST then refuses these tables outright.
revoke all on table "user", "session", "account", "verification" from anon, authenticated;
