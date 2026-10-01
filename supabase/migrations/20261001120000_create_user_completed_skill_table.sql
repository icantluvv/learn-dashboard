-- Отметка «навык изучен» хранится как факт на пару «пользователь + навык»: по одному числу
-- `user."completedSkillsCount"` нельзя узнать, отмечен ли конкретный навык. Composite primary key
-- делает повторную отметку невозможной на уровне схемы, поэтому операция изменения отметки
-- идемпотентна без дополнительных проверок в приложении.
create table if not exists public.user_completed_skill (
	"user_id" text not null references public."user" ("id") on delete cascade,
	"skill_id" text not null references public.skills ("id") on delete cascade,
	"completed_at" timestamptz not null default now(),
	primary key ("user_id", "skill_id")
);

-- Счётчик изученных навыков пересчитывается из этой таблицы, поэтому выборка по пользователю
-- выполняется на каждой операции отметки.
create index if not exists user_completed_skill_user_id_idx
	on public.user_completed_skill ("user_id");

alter table public.user_completed_skill enable row level security;

-- Таблица читается и пишется только серверным кодом приложения через service-role подключение,
-- как `skills` и `user_avatar`.
drop policy if exists "deny all to anon and authenticated" on public.user_completed_skill;

create policy "deny all to anon and authenticated" on public.user_completed_skill
	for all
	to anon, authenticated
	using (false)
	with check (false);
