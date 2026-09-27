-- Tracks how many skills the user has marked as completed. Written only by the app's own
-- server-side logic (Better Auth `input: false` additional field), never client-settable.
alter table "user" add column "completedSkillsCount" integer not null default 0;
