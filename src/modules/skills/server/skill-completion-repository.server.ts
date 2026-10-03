import type { Core } from '@repo/api'

import { getAuthDbPool } from '#/lib/auth/database.server'

import 'server-only'

/**
 * Код ошибки Postgres `foreign_key_violation`. Вставка отметки для несуществующего навыка нарушает
 * внешний ключ на `skills`, и это единственный признак «навыка нет», который не требует отдельного
 * `select`: предварительная проверка оставляла бы окно между чтением и вставкой.
 */
const FOREIGN_KEY_VIOLATION = '23503'

interface SetSkillCompletionResult {
	completedSkillsCount: number
}

function isForeignKeyViolation(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: unknown }).code === FOREIGN_KEY_VIOLATION
	)
}

export async function isSkillCompleted(userId: string, skillId: string): Promise<boolean> {
	const result = await getAuthDbPool().query<{ completed: boolean }>(
		`select exists (
			select 1
			from user_completed_skill
			where "user_id" = $1 and "skill_id" = $2
		) as completed`,
		[userId, skillId],
	)

	return result.rows[0]?.completed ?? false
}

/**
 * Приводит отметку к переданному значению и пересчитывает счётчик изученных навыков одним запросом:
 * промежуточного состояния «отметка изменилась, счётчик прежний» не существует. Счётчик именно
 * пересчитывается через `count(*)`, а не сдвигается на единицу, поэтому повторный вызов
 * идемпотентен, а однажды разъехавшееся значение лечится первой же операцией.
 *
 * Возвращает `null`, если навыка не существует.
 */
export async function setSkillCompletion(
	userId: string,
	skillId: string,
	completed: boolean,
): Promise<SetSkillCompletionResult | null> {
	const changeStatement = completed
		? `insert into user_completed_skill ("user_id", "skill_id")
			 values ($1, $2)
			 on conflict do nothing
			 returning 1`
		: `delete from user_completed_skill
			 where "user_id" = $1 and "skill_id" = $2
			 returning 1`
	// `on conflict do nothing` и удаление отсутствующей отметки не возвращают строк, поэтому
	// поправка равна нулю — операция остаётся идемпотентной.
	const changedRowsCorrection = completed ? '+' : '-'

	try {
		const result = await getAuthDbPool().query<{ completedSkillsCount: number }>(
			`with changed as (${changeStatement})
			 update "user"
			 set "completedSkillsCount" = (
				select count(*) from user_completed_skill where "user_id" = $1
			 ) ${changedRowsCorrection} (select count(*) from changed)
			 where "id" = $1
			 returning "completedSkillsCount"`,
			[userId, skillId],
		)
		// Пустой результат означает, что строки пользователя больше нет (сессия переживает
		// удаление пользователя), — обрабатывается так же, как отсутствующий навык.
		const row = result.rows[0]

		if (row == null) {
			return null
		}

		return { completedSkillsCount: row.completedSkillsCount }
	} catch (error) {
		if (isForeignKeyViolation(error)) {
			return null
		}

		throw error
	}
}

export interface CompletedSkillSummaryItem {
	id: string
	title: string
}

export interface CompletedSkillsCoreGroup {
	core: Core['type']
	coreName: string
	skills: CompletedSkillSummaryItem[]
}

interface CompletedSkillRow {
	core: Core['type']
	core_name: string
	skill_id: string
	skill_title: string
}

/**
 * Группирует только по направлениям, в которых есть хотя бы один изученный навык: пустые группы не
 * нужны секции профиля (см. `profile-completed-skills-summary` spec).
 */
export async function getCompletedSkillsByCore(
	userId: string,
): Promise<CompletedSkillsCoreGroup[]> {
	const result = await getAuthDbPool().query<CompletedSkillRow>(
		`select
			 skills.core as core,
			 cores.name as core_name,
			 skills.id as skill_id,
			 skills.title as skill_title
		 from user_completed_skill
		 join skills on skills.id = user_completed_skill.skill_id
		 join cores on cores.type = skills.core
		 where user_completed_skill.user_id = $1
		 order by cores.display_order asc, skills.title asc`,
		[userId],
	)
	const groups = new Map<Core['type'], CompletedSkillsCoreGroup>()

	for (const row of result.rows) {
		let group = groups.get(row.core)

		if (group == null) {
			group = { core: row.core, coreName: row.core_name, skills: [] }
			groups.set(row.core, group)
		}

		group.skills.push({ id: row.skill_id, title: row.skill_title })
	}

	return [...groups.values()]
}
