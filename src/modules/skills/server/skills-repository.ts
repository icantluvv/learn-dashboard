import type { GetSkillById200, GetSkills200, GetSkillsQueryParams } from '@repo/api'
import type { SkillRow } from '@repo/api/database'

import { getSkillById200Schema } from '@repo/api/base/codegen/zod/skillsController/getSkillByIdSchema'
import { getSkills200Schema } from '@repo/api/base/codegen/zod/skillsController/getSkillsSchema'
import { getSkillRows } from '@repo/api/database'

import 'server-only'

// `SkillRow` fields are all optional because they mirror a raw PostgREST
// projection (present fields depend on `select`). `getSkills` always selects
// id/title/topic/difficulty/questions_count, so these are guaranteed present
// here; `getSkills200Schema.parse` below still guards against a bad response.
function toSkillCard(row: SkillRow): GetSkills200[number] {
	return {
		id: row.id!,
		title: row.title!,
		questionsCount: row.questions_count!,
		difficulty: row.difficulty!,
		topic: row.topic!,
	}
}

function buildQuestionsCountFilter(
	minQuestionsCount: number | undefined,
	maxQuestionsCount: number | undefined,
): string[] | undefined {
	const filters: string[] = []

	if (minQuestionsCount != null) {
		filters.push(`gte.${minQuestionsCount}`)
	}

	if (maxQuestionsCount != null) {
		filters.push(`lte.${maxQuestionsCount}`)
	}

	return filters.length > 0 ? filters : undefined
}

export async function getSkills(filters: GetSkillsQueryParams = {}): Promise<GetSkills200> {
	const rows = await getSkillRows({
		params: {
			...(filters.search != null && filters.search !== ''
				? { title: `ilike.*${filters.search}*` }
				: {}),
			...(filters.topic != null && filters.topic !== ''
				? { topic: `eq.${filters.topic}` }
				: {}),
			...(filters.difficulty != null ? { difficulty: `eq.${filters.difficulty}` } : {}),
			...(() => {
				const questionsCount = buildQuestionsCountFilter(
					filters.minQuestionsCount,
					filters.maxQuestionsCount,
				)
				return questionsCount ? { questions_count: questionsCount } : {}
			})(),
			select: 'id,title,topic,difficulty,questions_count',
			order: 'title.asc',
		},
	})

	return getSkills200Schema.parse(rows.map((row) => toSkillCard(row)))
}

export async function getSkillById(id: string): Promise<GetSkillById200 | null> {
	const rows = await getSkillRows({
		params: { id: `eq.${id}`, select: 'title,questions', limit: 1 },
	})
	const row = rows[0]

	if (row == null) {
		return null
	}

	return getSkillById200Schema.parse({ title: row.title, questions: row.questions ?? [] })
}
