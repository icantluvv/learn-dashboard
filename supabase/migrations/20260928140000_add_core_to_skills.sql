-- Направления каталога являются данными: UI получает их из `public.cores`, а `type` используется
-- как стабильный сегмент URL. Иконка хранится как безопасный ключ локального компонента, не как
-- исполняемая разметка.

create table if not exists public.cores (
	type text primary key,
	name text not null,
	description text not null,
	icon text not null,
	is_available boolean not null,
	display_order integer not null unique,
	constraint cores_type_check check (type in ('frontend', 'backend', 'devops', 'design')),
	constraint cores_icon_check check (icon in ('code', 'server', 'ship', 'palette')),
	constraint cores_name_not_blank check (length(btrim(name)) > 0),
	constraint cores_description_not_blank check (length(btrim(description)) > 0),
	constraint cores_display_order_non_negative check (display_order >= 0)
);

insert into public.cores (type, name, description, icon, is_available, display_order)
values
	(
		'frontend',
		'Frontend',
		'Вёрстка, JavaScript, фреймворки и браузерная платформа',
		'code',
		true,
		0
	),
	(
		'backend',
		'Backend',
		'Серверная логика, базы данных, API и интеграции',
		'server',
		false,
		1
	),
	(
		'devops',
		'DevOps',
		'Контейнеры, CI/CD, инфраструктура и наблюдаемость',
		'ship',
		false,
		2
	),
	(
		'design',
		'Design',
		'Интерфейсы, дизайн-системы и пользовательские сценарии',
		'palette',
		false,
		3
	)
on conflict (type) do update
set
	name = excluded.name,
	description = excluded.description,
	icon = excluded.icon,
	is_available = excluded.is_available,
	display_order = excluded.display_order;

alter table public.cores enable row level security;
grant select on table public.cores to service_role;

alter table public.skills
	add column if not exists core text;

update public.skills
set core = 'frontend'
where core is null;

alter table public.skills
	alter column core set not null,
	alter column core drop default;

do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conrelid = 'public.skills'::regclass
			and conname = 'skills_core_fkey'
	) then
		alter table public.skills
			add constraint skills_core_fkey
			foreign key (core)
			references public.cores (type)
			on update cascade
			on delete restrict;
	end if;
end
$$;

create index if not exists skills_core_idx on public.skills (core);
