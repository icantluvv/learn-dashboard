-- Adds `lastName` (optional) and `role` (required, defaulted for existing rows) to match the
-- new `user.additionalFields` in `src/lib/auth/server.ts`; makes `age` optional.
alter table "user" add column "lastName" text;
alter table "user" add column "role" text not null default 'beginner' check ("role" in ('developer', 'analyst', 'student', 'beginner'));
alter table "user" alter column "age" drop not null;
