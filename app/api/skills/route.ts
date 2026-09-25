import type { GetSkillsQueryParams } from '@repo/api'
import type { NextRequest } from 'next/server'

import { getSkillsQueryParamsSchema } from '@repo/api/base/codegen/zod/skillsController/getSkillsSchema'
import { NextResponse } from 'next/server'

import { getSkills } from '#/modules/skills/server/skills-repository'

function parseFilters(searchParams: URLSearchParams) {
	const minQuestionsCount = searchParams.get('minQuestionsCount')
	const maxQuestionsCount = searchParams.get('maxQuestionsCount')

	return getSkillsQueryParamsSchema.parse({
		search: searchParams.get('search') ?? undefined,
		topic: searchParams.get('topic') ?? undefined,
		difficulty: searchParams.get('difficulty') ?? undefined,
		minQuestionsCount: minQuestionsCount == null ? undefined : Number(minQuestionsCount),
		maxQuestionsCount: maxQuestionsCount == null ? undefined : Number(maxQuestionsCount),
	})
}

export async function GET(request: NextRequest) {
	let filters: GetSkillsQueryParams

	try {
		filters = parseFilters(request.nextUrl.searchParams) ?? {}
	} catch {
		return NextResponse.json({ error: 'invalid_query' }, { status: 400 })
	}

	const skills = await getSkills(filters)

	return NextResponse.json(skills)
}
